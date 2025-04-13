// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Get('me')
    getMe(@User() user: any) {
        return user;
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }
        return this.authService.login(user);

    }
}
