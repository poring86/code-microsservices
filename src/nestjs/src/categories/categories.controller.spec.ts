import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateCategoryUseCase } from '@fc/micro-videos/category/application';

describe('CategoriesController unit tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should creates a category', async () => {
    const expectedOutput: CreateCategoryUseCase.Output = {
      id: 'b4b930ad-4ef7-4ec9-8a8a-798534340117',
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    };

    //@ts-expect-error
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };
    const output = await controller.create(input);
    expect(mockCreateUseCase.execute).toBeCalledWith(input);
    expect(expectedOutput).toStrictEqual(output);
  });
});
