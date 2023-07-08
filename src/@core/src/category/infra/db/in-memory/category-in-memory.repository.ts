
import { Category, CategoryRepository } from "#category/domain";
import { InMemorySearchableRepository } from "#seedwork/domain/repository/in-memory.repository";
import { SortDirection } from "#seedwork/domain/repository/repository-contracts";


export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository {
  bulkInsert(entities: Category[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }
    return items.filter((i) => {
      return i.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }
  protected async applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<Category[]> {
    return !sort
      ? await super.applySort(items, "created_at", "desc")
      : await super.applySort(items, sort, sort_dir);
  }
}

export default CategoryInMemoryRepository;
