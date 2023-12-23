import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '@app/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@app/category/dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '@app/category/entities/category.entity';
import { Repository } from 'typeorm';
import { ShortCaregoriesResponseType } from '@app/category/types/ShortCategoriesResponse.type';
//import { toTitleCapitalize } from '@app/shared/js/toTitleCapitalize';
import { ShortCategoryType } from '@app/category/types/StortCategory.type';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    currentUser: number,
  ): Promise<CategoryEntity> {
    const categoryByTitle = {
      user: { id: currentUser },
      title: createCategoryDto.title,
    };

    const isCategoryExist =
      await this.categoryRepository.findBy(categoryByTitle);

    this.errorResponseFunc('Category already exist', !isCategoryExist.length);

    const category = new CategoryEntity();
    Object.assign(category, categoryByTitle);

    return await this.categoryRepository.save(category);
  }

  async findAllByUserId(id: number): Promise<CategoryEntity[]> {
    const allCategories = await this.categoryRepository.find({
      where: {
        user: { id },
      },
      relations: {
        transactions: true,
      },
    });

    this.errorResponseFunc(
      'You don`t have any category yet',
      !!allCategories.length,
    );
    return allCategories;
  }

  //,== < ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  // async findOneByTitle(
  //   title: string,
  //   user_id: number,
  // ): Promise<CategoryEntity> {
  //   const selectedCategory = await this.categoryRepository.findOne({
  //     where: {
  //       title: toTitleCapitalize(title),
  //       user: { id: user_id },
  //     },
  //     relations: { user: true, transactions: true },
  //   });

  //   this.errorResponseFunc('Category not exist', !!selectedCategory);
  //   return selectedCategory;
  // }

  //,== </ ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  //?== < ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  async findOneById(id: number): Promise<CategoryEntity> {
    const selectedCategory = await this.categoryRepository.findOne({
      where: { category_id: id },
      relations: { user: true, transactions: true },
    });

    this.errorResponseFunc('Category not exist', !!selectedCategory);
    return selectedCategory;
  }

  //?== </ ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  async updateCategory(
    category_id: number,
    user_id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const updateCategory = await this.categoryRepository.findOne({
      where: { category_id, user: { id: user_id } },
    });

    this.errorResponseFunc('Category not exist', !!updateCategory);
    Object.assign(updateCategory, updateCategoryDto);

    return await this.categoryRepository.save(updateCategory);
  }

  //,== < ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  // async removeCategory(category_id: number, user_id: number): Promise<string> {
  //   const toDeleteCategory = await this.categoryRepository.findOne({
  //     where: { category_id, user: { id: user_id } },
  //   });

  //   this.errorResponseFunc('Category not exist', !!toDeleteCategory);

  //   await this.categoryRepository.delete(category_id);
  //   return `The category "${category_id} - ${toDeleteCategory.title}" has been deleted successfully`;
  // }

  //,== </ ВАРИАНТ-1 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ БЕЗ AUTHOGUARD > =======

  //?== < ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  async removeCategory(category_id: number): Promise<string> {
    const toDeleteCategory = await this.categoryRepository.findOne({
      where: { category_id },
    });

    this.errorResponseFunc('Category not exist', !!toDeleteCategory);

    await this.categoryRepository.delete(category_id);
    return `The category "${category_id} - ${toDeleteCategory.title}" has been deleted successfully`;
  }

  //?== </ ВАРИАНТ-2 ПРОВЕРКИ АВТОРСТВА ПОЛЬЗОВАТЕЛЯ С AUTHOGUARD > =======

  categoryBuilder(category: CategoryEntity): ShortCategoryType {
    const oneCategory = {
      id: category.category_id,
      title: category.title,
      user_id: category.user.id,
      transactions: [],
    };
    return oneCategory;
  }

  categoriesBuilder(categories: CategoryEntity[]): ShortCaregoriesResponseType {
    const shortCategories = categories.map((category) => ({
      id: category.category_id,
      title: category.title,
      user_id: category.user.id,
      transactions: [],
    }));
    return { categories: shortCategories };
  }

  errorResponseFunc(message: string, isExist: boolean) {
    const errorResponse = { errors: {} };
    if (!isExist) {
      errorResponse.errors = { message };
      throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
