import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const publicRoutes = ['/auth/login'];
    if (publicRoutes.includes(request.path)) {
      return true; 
    }

    return super.canActivate(context);
  }
}
