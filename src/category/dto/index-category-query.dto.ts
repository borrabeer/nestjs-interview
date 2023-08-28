import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';

export class IndexCategoryQueryDto {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBooleanString()
  includes_products?: string;
}
