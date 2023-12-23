import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from './types/transaction.type';
import { TransactionResponseInterface } from './types/transactionResponse.interface';
import { CategoryEntity } from '@app/category/entities/category.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import * as _ from 'lodash';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllByOperation(
    user_id: number,
    operation: string,
  ): Promise<{ total: number }> {
    const transactionsOfOperation = await this.transactionRepository.find({
      where: { type: operation, user: { id: user_id } },
    });

    this.errorResponseTransaction(
      'Transactions with this type of operation not exist',
      !!transactionsOfOperation.length,
    );

    const totalTransactionsSum = transactionsOfOperation.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    return { total: totalTransactionsSum };
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    user_id: number,
  ): Promise<TransactionType> {
    const isCategoryExist = await this.categoryRepository.findOne({
      where: { category_id: +createTransactionDto.category },
    });

    this.errorResponseTransaction('Category not exist', !!isCategoryExist);

    const newTransaction = new TransactionEntity();
    Object.assign(newTransaction, {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: {
        category_id: +createTransactionDto.category,
      },
      user: { id: +user_id },
    });

    this.errorResponseTransaction('Transaction not allowed', !!newTransaction);

    return await this.transactionRepository.save(newTransaction);
  }

  async findAllByUserId(user_id: number): Promise<TransactionEntity[]> {
    const allTransactions = await this.transactionRepository.find({
      where: { user: { id: user_id } },
      relations: { user: true, category: true }, //,старый типовой вариант
      //,так же можно по новому варианту
      //,relations: ['user', 'category'],
      order: { createdAt: 'DESC' },
    });

    this.errorResponseTransaction(
      'You don`t have any transaction yet',
      !!allTransactions.length,
    );
    return allTransactions;
  }

  //,== < ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  // async findOneByUser(id: number, user_id: number): Promise<TransactionEntity> {
  //   const findOneTransaction = await this.transactionRepository.findOne({
  //     where: { transaction_id: id, user: { id: user_id } },
  //     relations: { user: true, category: true },
  //   });

  //   this.errorResponseTransaction(
  //     'Transaction not exist', !!findOneTransaction, );

  //,== </ ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  //?== < ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  async findOneById(id: number): Promise<TransactionEntity> {
    const findOneTransaction = await this.transactionRepository.findOne({
      where: { transaction_id: id },
      relations: { user: true, category: true },
    });

    this.errorResponseTransaction(
      'Transaction in service not exist',
      !!findOneTransaction,
    );

    //?== </ ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

    const oneTransaction = new TransactionEntity();
    Object.assign(oneTransaction, {
      id: findOneTransaction.transaction_id,
      title: findOneTransaction.title,
      amount: findOneTransaction.amount,
      type: findOneTransaction.type,
      category: {
        id: findOneTransaction.category?.category_id || null,
        title: findOneTransaction.category?.title || null,
      },
      user: {
        id: findOneTransaction.user.id,
        username: findOneTransaction.user.username,
        email: findOneTransaction.user.email,
      },
    });

    return oneTransaction;
  }

  async updateTransaction(
    user_id: number,
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionType> {
    const updateTransaction = await this.transactionRepository.findOne({
      where: {
        transaction_id: id,
        user: { id: user_id },
        //== ВАРИАНТ БЕЗ ИЗМЕНЕНИЯ CATEGORY ============
        //category: { category_id: updateTransactionDto.category.category_id },
      },
    });

    this.errorResponseTransaction('Transaction not exist', !!updateTransaction);

    //===== < ДЛЯ ВЫВОДА ОШИБКИ ПРИ ОТСУТСТВИИ ИЗМЕНЕНИЙ > ========================
    const templateUpdateTransactionBeforeChanging = {
      title: updateTransaction.title,
      amount: updateTransaction.amount,
      type: updateTransaction.type,
      user: {
        id: updateTransaction.user.id,
        username: updateTransaction.user.username,
        email: updateTransaction.user.email,
      },
      category: {
        category_id: updateTransaction.category.category_id,
      },
    };

    //===== </ ДЛЯ ВЫВОДА ОШИБКИ ПРИ ОТСУТСТВИИ ИЗМЕНЕНИЙ >========================

    //==== < ВАРИАНТ С ИЗМЕНЕНИЕМ CATEGORY > =======================

    const findOneUserCategory = await this.categoryRepository.findOne({
      where: {
        category_id: updateTransactionDto.category.category_id,
        user: { id: user_id },
      },
    });

    this.errorResponseTransaction('Category not exist', !!findOneUserCategory);

    //====== </ ВАРИАНТ С ИЗМЕНЕНИЕМ CATEGORY > =====================

    const findAllUserCategories = await this.categoryRepository.find({
      where: { user: { id: user_id } },
    });

    const isIncludesCategory = findAllUserCategories.map((category) => {
      if (category.category_id === updateTransactionDto.category.category_id) {
        return true;
      } else {
        return false;
      }
    });

    this.errorResponseTransaction(
      'Category not exist',
      isIncludesCategory.includes(true),
    );

    const templateUpdateTransaction = {
      title: updateTransactionDto.title,
      amount: updateTransactionDto.amount,
      type: updateTransactionDto.type,
      user: {
        id: updateTransaction.user.id,
        username: updateTransaction.user.username,
        email: updateTransaction.user.email,
      },
      category: {
        category_id: updateTransactionDto.category.category_id,
      },
      //== ВАРИАНТ БЕЗ ИЗМЕНЕНИЯ CATEGORY ============

      //category: Object.assign(
      //  updateTransactionDto.category,
      //  updateTransaction.category,
      //),
    };

    this.errorResponseTransaction(
      'No any changes have been made',
      !this.isEqualObjects(
        templateUpdateTransaction,
        templateUpdateTransactionBeforeChanging,
      ),
    );

    Object.assign(
      updateTransaction,
      templateUpdateTransaction,
      updateTransactionDto,
    );

    return await this.transactionRepository.save(updateTransaction);
  }

  async removeTransaction(id: number): Promise<string> {
    const toRemoveTransaction = await this.transactionRepository.findOne({
      where: { transaction_id: id },
    });

    this.errorResponseTransaction(
      'Transaction not exist',
      !!toRemoveTransaction,
    );

    await this.transactionRepository.remove(toRemoveTransaction);

    return `Transaction "#${id} - ${toRemoveTransaction.title}" was deleted successfully`;
  }

  async findAllWithPagination(
    user_id: number,
    page: number,
    limit: number,
  ): Promise<TransactionEntity[]> {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id: user_id },
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return transactions;
  }

  errorResponseTransaction(message: string, isExist: boolean) {
    const errorResponse = { errors: {} };

    if (!isExist) {
      errorResponse.errors = { message };
      throw new NotFoundException(errorResponse);
    }
  }

  transactionBuilder(
    transaction: TransactionType,
  ): TransactionResponseInterface {
    return { transaction };
  }

  transactionsBuilder(transactions: TransactionEntity[]): any {
    return { transactions };
  }

  isEqualObjects(a: object, b: object) {
    return _.isEqual(a, b);
  }
}
