import { Category } from "#category/domain";
import { CategoryInMemoryRepository } from "#category/infra/db/in-memory";
import { NotFoundError } from "#seedwork/domain/errors/not-found.error";

import DeleteCategoryUseCase from "../../delete-category.usecase";

describe("UpdteCategoryUsecase Unit Tests", () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    expect(
      async () => await useCase.execute({ id: "fake id" })
    ).rejects.toThrow(new NotFoundError(`Entity Not Found using ID fake id`));
  });

  it("should delete a category", async () => {
    const entity = new Category({ name: "test" });
    repository.items = [entity];
    await useCase.execute({
      id: entity.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
