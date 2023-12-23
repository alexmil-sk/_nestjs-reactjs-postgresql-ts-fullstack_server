import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { UserService } from '@app/user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { UserLoginType } from '@app/user/types/userLogin.type';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const errorResponse = { errors: {} };

    const userByMail = await this.userService.findOne(email);

    if (!userByMail) {
      errorResponse.errors['email'] = 'User is not exist...';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isRightPassword = await verify(userByMail.password, password);

    if (!isRightPassword) {
      errorResponse.errors['password'] = 'Password is not correct...';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return userByMail;
  }

  async login(user: UserLoginType): Promise<UserResponseInterface> {
    const { id, email, username } = user;
    return {
      user: {
        id,
        username,
        email,
        token: this.jwtService.sign({
          email: user.email,
          id: user.id,
          username: user.username,
        }),
      },
    };
  }

  async getProfile(user: UserLoginType): Promise<UserLoginType> {
    return user;
  }
}
