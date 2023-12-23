import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { CategoryEntity } from '@app/category/entities/category.entity';
import { CategoryService } from '@app/category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, CategoryEntity])],
  controllers: [TransactionController],
  providers: [TransactionService, CategoryService],
})
export class TransactionModule {}
