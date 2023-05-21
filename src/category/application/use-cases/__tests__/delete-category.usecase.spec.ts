import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../domain/entities/category";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import DeleteCategoryUsecase from "../delete-category.usecase";

describe("CUpdteCategoryUsecase Unit Tests", () => {
  let useCase: DeleteCategoryUsecase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUsecase(repository);
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
