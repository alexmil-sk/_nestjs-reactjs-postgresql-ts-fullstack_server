import { UserLoginType } from './userLogin.type';

interface UserResponseInterface {
  user: UserLoginType & { token: string };
}

export { UserResponseInterface };
