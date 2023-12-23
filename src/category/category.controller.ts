import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoryService } from '@app/category/category.service';
import { CreateCategoryDto } from '@app/category/dto/create-category.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { UpdateCategoryDto } from '@app/category/dto/update-category.dto';
import { AuthorGuard } from '@app/guards/author.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createCategory(
    @Body('category') createCategoryDto: CreateCategoryDto,
    @Req() req,
  ): Promise<any> {
    const category = await this.categoryService.createCategory(
      createCategoryDto,
      req.user['id'],
    );
    return this.categoryService.categoryBuilder(category);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllByUserId(@Req() req): Promise<any> {
    const categories = await this.categoryService.findAllByUserId(req.user.id);
    return this.categoryService.categoriesBuilder(categories);
  }

  //,== < ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  // @Get(':title')
  // @UseGuards(JwtAuthGuard)
  // async findOneByTitle(
  //   @Req() req,
  //   @Param('title') title: string,
  // ): Promise<any> {
  //   const category = await this.categoryService.findOneByTitle(
  //     title,
  //     req.user.id,
  //   );
  //   return this.categoryService.categoryBuilder(category);
  // }

  //,== </ ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  //?== < ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  async findOneById(@Param('id') id: string): Promise<any> {
    const category = await this.categoryService.findOneById(+id);
    return this.categoryService.categoryBuilder(category);
  }

  //?== </ ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @UsePipes(new ValidationPipe())
  async updateCategory(
    @Body('category') updateCategoryDto: UpdateCategoryDto,
    @Req() req,
    @Param('id') id: number,
  ): Promise<any> {
    const toUpdateCategory = await this.categoryService.updateCategory(
      +id,
      +req.user.id,
      updateCategoryDto,
    );
    return this.categoryService.categoryBuilder(toUpdateCategory);
  }

  //,== < ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  // @Delete(':type/:category_id')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  // @UsePipes(new ValidationPipe())
  // async removeCategory(
  //   @Param('category_id') category_id: number,
  //   @Req() req,
  // ): Promise<string> {
  //   return this.categoryService.removeCategory(+category_id, +req.user.id);
  // }

  //,== </ ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  //?== < ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @UsePipes(new ValidationPipe())
  async removeCategory(@Param('id') id: number): Promise<string> {
    return this.categoryService.removeCategory(+id);
  }

  //?== </ ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======
}
