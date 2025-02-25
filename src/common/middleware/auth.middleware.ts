// src/common/middleware/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const token = authHeader.split(' ')[1]; 
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }
    try {
      const decoded = this.jwtService.verify(token); 
      req.user = decoded; 
      next(); 
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
