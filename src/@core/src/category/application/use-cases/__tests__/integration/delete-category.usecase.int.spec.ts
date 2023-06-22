import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

import DeleteCategoryUseCase from "../../delete-category.usecase";

const { CategoryModel, CategoryRepository } = CategorySequelize;

describe("DeleteCategoryUseCase Integration Tests", () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id" })
    ).rejects.toThrow(new NotFoundError(`Entity Not Found using ID fake id`));
  });

  it("should delete a category", async () => {
    const model = (await CategoryModel.factory().create()).toJSON();
    await useCase.execute({
      id: model.id,
    });
    const noHasModel = await CategoryModel.findByPk(model.id)
    expect(noHasModel).toBeNull();
  });
});
