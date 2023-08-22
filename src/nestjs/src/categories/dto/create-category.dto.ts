import { CreateCategoryUseCase } from '@fc/micro-videos/category/application';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator'

export class CreateCategoryDto implements CreateCategoryUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
