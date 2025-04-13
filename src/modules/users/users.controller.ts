import { Controller, Get, Post, Body, UseGuards, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Post('create-user')
  async createUser(
    @Body() newUser: CreateUserDto,
  ) {
    return this.usersService.createUser(newUser);
  }

  @Patch('update-user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() newUser: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, newUser);
  }

  @Patch('change-password/:id')
async changePassword(
  @Param('id') id: string,
  @Body() body: { oldPassword: string; newPassword: string }
) {
  return this.usersService.changePassword(id, body.oldPassword, body.newPassword);
}
}

