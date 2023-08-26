import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import {
  Between,
  FindManyOptions,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import { IndexProductQueryDto } from './dto/index-product-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /*
   * TODO: Add ability to filter by name to this controller action.
   * TODO: Add ability to filter by price to this controller action. Support "greater than or equal" and "lesser than or equal".
   *
   * Example: /products?name=Something&price_subunit[gte]=10&price_subunit[lte]=100
   */

  @Get()
  index(@Query() indexProductQueryDto: IndexProductQueryDto) {
    const { name, price_subunit } = indexProductQueryDto;
    const { gte: priceGte, lte: priceLte } = price_subunit || {};
    const options: FindManyOptions<Product> = {
      where: {},
    };

    if (name) {
      options.where['name'] = Like(`%${name}%`);
    }

    if (priceGte !== undefined) {
      options.where['priceSubunit'] = MoreThanOrEqual(priceGte);
    }

    if (priceLte !== undefined) {
      options.where['priceSubunit'] = LessThanOrEqual(priceLte);
    }

    if (priceGte && priceLte) {
      options.where['priceSubunit'] = Between(priceGte, priceLte);
    }

    return this.productsService.findAll(options);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.productsService.findOne(+id);
  }

  /*
   * TODO: Add the Category entity and create a Many-To-Many association to Products.
   * TODO: Add ability to link Products to Categories.
   */

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.findOne(id);

    return this.productsService.update(product, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);

    return this.productsService.remove(product);
  }
}
