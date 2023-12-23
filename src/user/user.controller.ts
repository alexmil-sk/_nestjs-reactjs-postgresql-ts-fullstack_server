import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { BackendValidationPipe } from '@app/shared/pipes/backenValidation.pipe';
import { UserResponseInterface } from './types/userResponse.interface';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserObject(user);
  }
}
