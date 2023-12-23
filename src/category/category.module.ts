import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { UserEntity } from '@app/user/entities/user.entity';
import { TransactionService } from '@app/transaction/transaction.service';
import { TransactionEntity } from '@app/transaction/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, UserEntity, TransactionEntity]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, TransactionService],
})
export class CategoryModule {}
