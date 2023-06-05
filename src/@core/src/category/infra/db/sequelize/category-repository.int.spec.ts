import { CategorySequelize } from "./category-sequelize"
import { Category, CategoryRepository } from "#category/domain"
import NotFoundError from "#seedwork/domain/errors/not-found.error"
import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.vo"
import { setupSequelize } from "#seedwork/infra/testing/db"
import _chance from "chance"
const { CategoryModel, CategoryModelMapper, CategoryRepository: CategorySequelizeRepository } = CategorySequelize


describe('CategorySequelizeRepository Unit tests', () => {
  setupSequelize({ models: [CategoryModel] })
  let chance: Chance.Chance

  let repository: CategorySequelize.CategoryRepository

  beforeAll(() => {
    chance = _chance()
  })

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel)
  })

  it('should inserts a new entity', async () => {
    let category = new Category({ name: 'Movie' })
    await repository.insert(category)
    let model = await CategoryModel.findByPk(category.id)
    expect(model.toJSON()).toStrictEqual(category.toJSON())

    category = new Category({
      name: "Movie",
      description: "some description",
      is_active: false
    })
    await repository.insert(category)
    model = await CategoryModel.findByPk(category.id)
    expect(model.toJSON()).toStrictEqual(category.toJSON())
  })

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found using ID fake id")
    );

    await expect(
      repository.findById(
        new UniqueEntityId("6f1a1668-967c-424a-ab06-e0a627909339")
      )
    ).rejects.toThrow(
      new NotFoundError(
        "Entity Not Found using ID 6f1a1668-967c-424a-ab06-e0a627909339"
      )
    );
  });

  it("should find a entity by id", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all categories", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
  });

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date()
      await CategoryModel.factory().count(16).bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: 'Movie',
        description: null,
        is_active: true,
        created_at
      }))
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity')
      const searchOutput = await repository.search(new CategoryRepository.SearchParams())
      expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(15)
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null
      })
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(Category)
        expect(item.id).toBeDefined()
      })
      const items = searchOutput.items.map((item) => item.toJSON())
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Movie",
          description: null,
          is_active: true,
          created_at
        })
      )
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      await CategoryModel.factory().count(16).bulkCreate((index) => ({
        id: chance.guid({ version: 4 }),
        name: `Movie${index}`,
        description: null,
        is_active: true,
        created_at: new Date(created_at.getTime() + 100 + index)
      }))

      const searchOutput = await repository.search(new CategoryRepository.SearchParams())
      const items = searchOutput.items
      items.reverse().forEach((item, index) => {
        expect(`${item.name}${index + 1}`)
      })
    })

    it("should apply paginate and filter", async () => {

      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date()
      }

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "test", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "a", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TEST", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TeSt", price: 5, ...defaultProps },
      ];
      const categories = await CategoryModel.bulkCreate(categoriesProps)

      let searchOutput = await repository.search(
        new CategoryRepository.SearchParams({ page: 1, per_page: 2, filter: "TEST" })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [CategoryModelMapper.toEntity(categories[0]), CategoryModelMapper.toEntity(categories[2])],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "TEST",
        }).toJSON(true)
      );

      searchOutput = await repository.search(
        new CategoryRepository.SearchParams({ page: 2, per_page: 2, filter: "TEST" })
      );
      expect(searchOutput.toJSON(true)).toStrictEqual(
        new CategoryRepository.SearchResult({
          items: [CategoryModelMapper.toEntity(categories[3])],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "TEST",
        }).toJSON(true)
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'created_at'])
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date()
      }

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "b", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "a", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "d", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "e", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "c", price: 5, ...defaultProps },
      ];
      const categories = await CategoryModel.bulkCreate(categoriesProps)


      const arrange = [
        {
          params: new CategoryRepository.SearchParams({ page: 1, per_page: 2, sort: "name" }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[1]),
              CategoryModelMapper.toEntity(categories[0])
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CategoryRepository.SearchResult({
            items: [CategoryModelMapper.toEntity(categories[4]), CategoryModelMapper.toEntity(categories[2])],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [CategoryModelMapper.toEntity(categories[3]), CategoryModelMapper.toEntity(categories[2])],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [CategoryModelMapper.toEntity(categories[4]), CategoryModelMapper.toEntity(categories[0])],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(new CategoryRepository.SearchParams(i.params));
        expect(result.toJSON(true)).toStrictEqual(i.result.toJSON(true));
      }
    });

    it("should search using filter, sort and paginate", async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date()
      }

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "test", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "a", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TEST", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "e", price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TeSt", price: 5, ...defaultProps },
      ];

      const categories = await CategoryModel.bulkCreate(categoriesProps)

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          result: new CategoryRepository.SearchResult({
            items: [CategoryModelMapper.toEntity(categories[2]), CategoryModelMapper.toEntity(categories[4])],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          result: new CategoryRepository.SearchResult({
            items: [CategoryModelMapper.toEntity(categories[0])],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result.toJSON(true)).toStrictEqual(i.result.toJSON(true));
      }
    });
  })
})