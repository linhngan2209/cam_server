import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { LoginResDto } from '../auth/dto/response-login.dto';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async createUser(createUser: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUser.password, 10); 
    const newUser = new this.userModel({name: createUser.name, email: createUser.email, password: hashedPassword, role: createUser.role});
    return newUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().lean().exec();
    return users.map(user => ({
      ...user,
      _id: user._id.toString(),  
    }));
  }
  

  async findUsersByEmail(email: string): Promise<LoginResDto | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (user) {
      return plainToClass(LoginResDto, user);
    }
    return null;
  }
}
