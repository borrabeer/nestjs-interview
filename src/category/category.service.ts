import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  findAll(options?: FindManyOptions<Category>) {
    return this.categoriesRepository.find(options);
  }

  findOne(id: number) {
    return this.categoriesRepository.findOneByOrFail({ id });
  }

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.save(createCategoryDto);
  }

  update(category: Category, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesRepository.save({
      ...category,
      ...updateCategoryDto,
    });
  }

  remove(category: Category) {
    return this.categoriesRepository.delete(category.id);
  }
}
