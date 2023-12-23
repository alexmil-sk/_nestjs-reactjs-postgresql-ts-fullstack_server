import { CategoryEntity } from '@app/category/entities/category.entity';
import { UserEntity } from '@app/user/entities/user.entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  type: 'expense' | 'income';

  @IsNotEmpty()
  @IsNotEmpty()
  category: CategoryEntity;

  @IsNotEmpty()
  @IsNotEmpty()
  user: UserEntity;
}
