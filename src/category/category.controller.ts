import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IndexCategoryQueryDto } from './dto/index-category-query.dto';
import { FindManyOptions } from 'typeorm';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  index(@Query() indexCategoryQueryDto: IndexCategoryQueryDto) {
    const { includes_products } = indexCategoryQueryDto;
    const options: FindManyOptions<Category> = {};

    if (includes_products === 'true') {
      options.relations = { products: true };
    }

    return this.categoriesService.findAll(options);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.categoriesService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const product = await this.categoriesService.findOne(+id);

    return this.categoriesService.remove(product);
  }
}
