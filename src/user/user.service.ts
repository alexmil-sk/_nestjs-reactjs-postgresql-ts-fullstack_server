import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserType } from './types/user.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = { errors: {} };

    const userByUsername: UserEntity = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    const userByEmail: UserEntity = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByUsername) {
      errorResponse.errors['username'] = 'Username already exist...';
    }

    if (userByEmail) {
      errorResponse.errors['email'] = 'Email already exist...';
    }

    if (userByUsername || userByEmail) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  buildUserObject(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.jwtService.sign({ email: user.email, id: user.id }),
      },
    };
  }

  async findOne(email: string): Promise<UserType | undefined> {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
