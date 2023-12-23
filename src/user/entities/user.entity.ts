import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../../category/entities/category.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { hash } from 'argon2';
import { MinLength } from 'class-validator';
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  @MinLength(6, { message: 'Password shouldn`t be less then 6 symbols' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CategoryEntity, (category) => category.user, {
    onDelete: 'CASCADE',
  })
  categories: CategoryEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  transactions: TransactionEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}
