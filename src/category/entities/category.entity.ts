import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.categories, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.category)
  transactions: TransactionEntity[];
}
