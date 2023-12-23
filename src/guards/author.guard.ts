import { CategoryService } from '@app/category/category.service';
import { CategoryEntity } from '@app/category/entities/category.entity';
import { TransactionEntity } from '@app/transaction/entities/transaction.entity';
import { TransactionService } from '@app/transaction/transaction.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly categoryService: CategoryService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    const { id, type } = request.params;

    let entity: TransactionEntity | CategoryEntity;

    switch (type) {
      case 'transaction':
        entity = await this.transactionService.findOneById(id);

        break;
      case 'category':
        entity = await this.categoryService.findOneById(id);
        break;
      default:
        throw new NotFoundException('Probably some mistakes in path');
    }

    const user = request.user;

    console.log('user: '.bgCyan, user);

    if (entity && user && entity.user.id !== user.id) {
      throw new NotFoundException(
        `User:"${user.username}" is not the author of the ${type}`,
        {
          cause: new Error(),
          description: `The author of the ${type} is User:"${entity.user.username}" `,
        },
      );
    }

    if (entity && user && entity.user.id === user.id) return true;

    throw new NotFoundException(`This ${type} not exist`, {
      cause: new Error(),
      description: 'Error in AuthorGuard description',
    });
  }
}
