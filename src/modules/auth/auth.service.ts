import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { LoginResDto } from './dto/response-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(user: LoginResDto) {
        const payload = { email: user.email, sub: user._id, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return {
            success: true,
            access_token: accessToken,
            user: user,
        };
    }

    async validateUser(email: string, pass: string): Promise<LoginResDto> {
        const user = await this.usersService.findUsersByEmail(email);
        if (!user) {
            return null;
        }
        if (!user.password) {
            throw new Error("Password is missing for the user");
        }
        const hashedPassword = await bcrypt.compare(pass, user.password);
        if (user && hashedPassword) {
            return user;
        }
        return null;
    }
}
