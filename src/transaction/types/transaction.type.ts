import { DeepPartial } from 'typeorm';
import { TransactionEntity } from '@app/transaction/entities/transaction.entity';

type TransactionType = DeepPartial<TransactionEntity>;

export { TransactionType };
