import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindManyOptions, In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoriesService } from '../category/category.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  findAll(options?: FindManyOptions<Product>) {
    return this.productsRepository.find(options);
  }

  findOne(id: number, withCategories = true) {
    return this.productsRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        categories: withCategories,
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const { categoriesId } = createProductDto;

    if (categoriesId) {
      const categories = await this.categoriesService.findAll({
        where: {
          id: In(categoriesId),
        },
      });

      if (categories.length === 0) {
        throw new NotFoundException();
      }

      delete createProductDto.categoriesId;

      return this.productsRepository.save({ ...createProductDto, categories });
    }

    return this.productsRepository.save(createProductDto);
  }

  async update(product: Product, updateProductDto: UpdateProductDto) {
    const { categoriesId } = updateProductDto;

    if (categoriesId) {
      const categories = await this.categoriesService.findAll({
        where: {
          id: In(categoriesId),
        },
      });

      if (categories.length === 0) {
        throw new NotFoundException();
      }

      product.categories = categories;

      delete updateProductDto.categoriesId;
    }

    return this.productsRepository.save({ ...product, ...updateProductDto });
  }

  remove(product: Product) {
    return this.productsRepository.delete(product.id);
  }
}
