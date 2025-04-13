import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { LoginResDto } from '../auth/dto/response-login.dto';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async createUser(createUser: CreateUserDto): Promise<User> {
    const existingEmail = await this.userModel.findOne({ email: createUser.email }).exec();
    if (existingEmail) {
      throw new ConflictException({
        errorCode: 'EMAIL_EXISTS',
        message: 'Email đã được đăng ký',
        field: 'email',
        existingValue: createUser.email
      });
    }
  
    const existingPhone = await this.userModel.findOne({ phone: createUser.phone }).exec();
    if (existingPhone) {
      throw new ConflictException({
        errorCode: 'PHONE_EXISTS',
        message: 'Số điện thoại đã được đăng ký',
        field: 'phone',
        existingValue: createUser.phone
      });
    }
  
    const hashedPassword = await bcrypt.hash(createUser.password, 10);
    
    const newUser = new this.userModel({
      ...createUser,
      password: hashedPassword,
      role: createUser.role || 'user'
    });
  
    return newUser.save();
  }

  async updateUser(id: string, updateUser: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel.findById(id).exec();
    if (!existingUser) {
      throw new NotFoundException({
        errorCode: 'USER_NOT_FOUND',
        message: 'Không tìm thấy người dùng',
      });
    }

    if (updateUser.email && updateUser.email !== existingUser.email) {
      const emailExists = await this.userModel.findOne({ email: updateUser.email }).exec();
      if (emailExists) {
        throw new ConflictException({
          errorCode: 'EMAIL_EXISTS',
          message: 'Email đã được đăng ký bởi tài khoản khác',
          field: 'email',
        });
      }
    }

    if (updateUser.phone && updateUser.phone !== existingUser.phone) {
      const phoneExists = await this.userModel.findOne({ phone: updateUser.phone }).exec();
      if (phoneExists) {
        throw new ConflictException({
          errorCode: 'PHONE_EXISTS',
          message: 'Số điện thoại đã được đăng ký bởi tài khoản khác',
          field: 'phone',
        });
      }
    }

   

    return this.userModel.findByIdAndUpdate(
      id,
      { ...updateUser, updatedAt: new Date() },
      { new: true } 
    ).exec();
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().lean().exec();
    return users.map(user => ({
      ...user,
      _id: user._id.toString(),  
    }));
  }
  
  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findById(id).select('+password');
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  
    return { message: 'Password changed successfully' };
  }

  async findUsersByEmail(email: string): Promise<LoginResDto | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('+password') 
      .lean()
      .exec();
  
    if (!user) return null;
    console.log('user before transform:', user);
    return plainToClass(LoginResDto, user, {
      excludeExtraneousValues: true, 
    });
  }
}
