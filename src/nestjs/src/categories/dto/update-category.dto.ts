import { UpdateCategoryUseCase } from '@fc/micro-videos/category/application';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator'

export class UpdateCategoryDto
  implements Omit<UpdateCategoryUseCase.Input, 'id'>
{
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
