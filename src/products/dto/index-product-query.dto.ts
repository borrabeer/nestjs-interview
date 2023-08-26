import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PriceSubunitQueryDto {
  @ApiPropertyOptional({ name: 'price_subunit[gte]' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gte?: number;

  @ApiPropertyOptional({ name: 'price_subunit[lte]' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lte?: number;
}

export class IndexProductQueryDto {
  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @Type(() => PriceSubunitQueryDto)
  @ValidateNested()
  price_subunit: PriceSubunitQueryDto;
}
