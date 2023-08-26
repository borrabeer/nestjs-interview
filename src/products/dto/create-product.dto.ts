import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ example: 1000 })
  @IsInt()
  priceSubunit: number;

  @ApiProperty({ enum: ['USD', 'GBP', 'EUR', 'THB'] })
  @IsString()
  @Length(3, 3)
  priceCurrency: string;

  @ApiPropertyOptional({ example: [1] })
  @IsOptional()
  @IsNumber({}, { each: true })
  categoriesId?: number[];
}
