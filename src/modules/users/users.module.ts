import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.model';

@Module({
  imports: [TypegooseModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
