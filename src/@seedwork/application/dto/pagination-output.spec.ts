import CreateCategoryUsecase from "../../../category/application/use-cases/create-category.usecase";
import CategoryRepository from "../../../category/domain/repository/category.repository";
import CategoryInMemoryRepository from "../../../category/infra/repository/category-in-memory.repository";

describe("Pagination Unit Test", () => {
  let useCase: CreateCategoryUsecase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUsecase(repository);
  });
  test("toOutput method", () => {
    const result = new CategoryRepository.SearchResult({
      items: ["fake"] as any,
      total: 1,
      current_page: 1,
      per_page: 1,
      sort: "name",
      sort_dir: "desc",
      filter: "fake",
    });

    const output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });
});
