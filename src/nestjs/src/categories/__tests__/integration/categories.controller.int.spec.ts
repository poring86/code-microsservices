
import { Test, TestingModule } from "@nestjs/testing"
import { CategoriesController } from "../../../categories/categories.controller"
import { CategoriesModule } from "../../../categories/categories.module"
import { DatabaseModule } from "../../../database/database.module"
import { CreateCategoryUseCase, UpdateCategoryUseCase, ListCategoriesUseCase, DeleteCategoryUseCase, GetCategoryUseCase } from "@fc/micro-videos/category/application"
import { ConfigModule } from "../../../config/config.module"
import CategoryRepository from "@fc/micro-videos/dist/category/domain/repository/category.repository"
import { CATEGORY_PROVIDERS } from "../../../categories/category.providers"
import { CategorySequelize } from "@fc/micro-videos/category/infra"
import { NotFoundError } from "rxjs"
import { CategoryCollectionPresenter, CategoryPresenter } from "../../../categories/presenter/category.presenter"
import { Category } from '@fc/micro-videos/category/domain';
import { SortDirection } from "@fc/micro-videos/dist/@seedwork/domain/repository/repository-contracts"
import { CategoryFixture } from "nestjs/test/categories/fixtures"

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController
  let repository: CategoryRepository.Repository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase
    )
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase
    )
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase
    )
    expect(controller['getUseCase']).toBeInstanceOf(
      GetCategoryUseCase.UseCase
    )
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase
    )
  })

  describe('should create a category', () => {
    const arrange = CategoryFixture.arrangeForSave()

    test.each(arrange)(
      'with request $request',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(presenter.id)

        expect(entity.toJSON()).toStrictEqual({
          id: presenter.id,
          created_at: presenter.created_at,
          ...send_data,
          ...expected,
        })

        expect(presenter).toEqual(new CategoryPresenter(entity))
      }
    )

  })

  describe('should update a category', () => {
    const arrange = [
      {
        request: {
          name: 'Movie',
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: null,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          is_active: false,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: false,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'description test',
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'description test',
          is_active: true,
        },
      },
    ];
    test.each(arrange)(
      'with request $request',
      async ({ request, expectedPresenter }) => {
        const category = Category.fake().aCategory().build();
        await repository.insert(category);
        const presenter = await controller.create(request);
        const entity = await repository.findById(presenter.id)

        expect(entity).toMatchObject({
          id: presenter.id,
          name: expectedPresenter.name,
          description: expectedPresenter.description,
          is_active: expectedPresenter.is_active,
          created_at: presenter.created_at
        })

        expect(presenter).toBeInstanceOf(CategoryPresenter)
        expect(presenter.id).toBe(entity.id)
        expect(presenter.name).toBe(expectedPresenter.name)
        expect(presenter.description).toBe(expectedPresenter.description)
        expect(presenter.is_active).toBe(expectedPresenter.is_active)
        expect(presenter.created_at).toStrictEqual(entity.created_at)
      }
    )
  })

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category)
    const response = await controller.remove(category.id)
    expect(response).not.toBeDefined()
    await expect(repository.findById(category.id)).rejects.toThrow(new NotFoundError(`Entity Not Found using ID ${category.id}`))
  })

  it('should get a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create()
    const presenter = await controller.findOne(category.id)

    expect(presenter).toBeInstanceOf(CategoryPresenter)
    expect(presenter.id).toBe(category.id);
    expect(presenter.name).toBe(category.name);
    expect(presenter.description).toBe(category.description);
    expect(presenter.is_active).toBe(category.is_active);
    expect(presenter.created_at).toStrictEqual(category.created_at);
  })

  describe('search method', () => {
    it("should return output using empty input with categories ordered by created_at", async () => {

      const categories = Category.fake()
        .theCategories(4)
        .withName((index) => index + '')
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .build();
      await repository.bulkInsert(categories);

      const arrange = [
        {
          send_data: {},
          expected: {
            items: [categories[3], categories[2], categories[1], categories[0]],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },

        },
        {
          send_data: { per_page: 2 },
          expected: {
            items: [categories[3], categories[2]],
            current_page: 1,
            last_page: 2,
            per_page: 15,
            total: 4,
          },
        }
      ]

      for (const item of arrange) {
        const presenter = await controller.search(item.send_data);
        expect(presenter.data).toStrictEqual(item.expected.items)
        expect(presenter).toMatchObject(
          new CategoryCollectionPresenter(item.expected),
        );
      }
    });

    it('should returns output using pagination, sort and filter', async () => {
      const faker = Category.fake().aCategory();
      const categories = [
        faker.withName('a').build(),
        faker.withName('AAA').build(),
        faker.withName('AaA').build(),
        faker.withName('b').build(),
        faker.withName('c').build(),
      ];
      await repository.bulkInsert(categories);

      const arrange_asc = [
        {
          send_data: {
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'a',
          },
          expected: {
            items: [categories[1], categories[2]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
        {
          send_data: {
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'a',
          },
          expected: {
            items: [categories[0]],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      ];

      for (const item of arrange_asc) {
        const presenter = await controller.search(item.send_data);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected),
        );
      }

      const arrange_desc = [
        {
          send_data: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [categories[0], categories[2]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
        {
          send_data: {
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [categories[1]],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      ];

      for (const item of arrange_desc) {
        const presenter = await controller.search(item.send_data);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected),
        );
      }
    });
  })
})