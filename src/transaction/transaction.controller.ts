import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { TransactionResponseInterface } from './types/transactionResponse.interface';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthorGuard } from '@app/guards/author.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':operation/total')
  @UseGuards(JwtAuthGuard)
  async fyndAllByOperation(
    @Req() req,
    @Param('operation') operation: string,
  ): Promise<any> {
    return await this.transactionService.findAllByOperation(
      +req.user.id,
      operation,
    );
  }

  @Get('pagination')
  @UseGuards(JwtAuthGuard)
  async findAllWithPagination(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ) {
    console.log('variables: '.bgYellow, req.user.id, page, limit);
    return await this.transactionService.findAllWithPagination(
      +req.user.id,
      +page,
      +limit,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createTransaction(
    @Body('transaction') createTransactionDto: CreateTransactionDto,
    @Req() req,
  ): Promise<TransactionResponseInterface> {
    const toCreateTransaction = await this.transactionService.createTransaction(
      createTransactionDto,
      +req.user.id,
    );
    return this.transactionService.transactionBuilder(toCreateTransaction);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllByUserId(@Req() req): Promise<any> {
    const allTransactions = await this.transactionService.findAllByUserId(
      +req.user.id,
    );
    return this.transactionService.transactionsBuilder(allTransactions);
  }

  //,== < ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // async findOneByUser(@Req() req, @Param('id') id: string): Promise<any> {
  //   const transaction = await this.transactionService.findOneByUser( +id,  +req.user.id, );
  //   return this.transactionService.transactionBuilder(transaction);
  // }

  //,== </ ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  //?== < ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  // http://localhost:3000/api/transactions/:type/:id
  // :type === transaction

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  async findOneById(@Param('id') id: string): Promise<any> {
    const transaction = await this.transactionService.findOneById(+id);
    return this.transactionService.transactionBuilder(transaction);
  }

  //?== </ ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @UsePipes(new ValidationPipe())
  async updateTransaction(
    @Body('transaction') updateTransactionDto: UpdateTransactionDto,
    @Param('id') id: string,
    @Req() req,
  ): Promise<any> {
    const updateTransaction = await this.transactionService.updateTransaction(
      +req.user.id,
      +id,
      updateTransactionDto,
    );

    return this.transactionService.transactionBuilder(updateTransaction);
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  async removeTransaction(@Param('id') id: string): Promise<string> {
    return await this.transactionService.removeTransaction(+id);
  }
}
