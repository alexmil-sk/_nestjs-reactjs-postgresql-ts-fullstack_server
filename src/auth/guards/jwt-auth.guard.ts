import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      //throw err || new UnauthorizedException('You are not authenticated');
      throw (
        err ||
        new UnauthorizedException({
          message: 'You are not authenticated',
          error: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
        })
      );
    }
    return user;
  }
}
