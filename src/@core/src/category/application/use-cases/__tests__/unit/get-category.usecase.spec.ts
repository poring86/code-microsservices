import { Category } from "#category/domain";
import { CategoryInMemoryRepository } from "#category/infra/db/in-memory";
import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { GetCategoryUseCase } from "../../get-category.usecase";

describe("CreateCategoryUsecase Unit Tests", () => {
  let useCase: GetCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    expect(
      async () => await useCase.execute({ id: "fake id" })
    ).rejects.toThrow(new NotFoundError(`Entity Not Found using ID fake id`));
  });

  it("should returns a category", async () => {
    const items = [new Category({ name: "Movie" })];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, "findById");
    const output = await useCase.execute({ id: items[0].id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].id,
      name: "Movie",
      description: null,
      is_active: true,
      created_at: items[0].created_at,
    });
  });
});
