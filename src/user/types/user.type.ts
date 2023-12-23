import { UserEntity } from '../entities/user.entity';
type UserType = Omit<UserEntity, 'hashPassword'>;

export { UserType };
