// import { CategoryModelMapper } from "./category-mapper"
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error"
import { Category } from "#category/domain"
import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.vo"
import { setupSequelize } from "#seedwork/infra/testing/db"
import { CategorySequelize } from "./category-sequelize"

describe("CategoryModelMapper Unit Tests", () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] })

  it('should throws error when category is invalid', () => {
    const model = CategorySequelize.CategoryModel.build({ id: '6f1a1668-967c-424a-ab06-e0a627909339' })
    try {
      CategorySequelize.CategoryModelMapper.toEntity(model)
      fail('The category is valid, but it needs to trow a LoadEntityError')
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError)
      expect(e.error).toMatchObject({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'],

      })
    }
  })

  it('should throw a generic error', () => {
    const error = new Error("Generic Error");
    const spyValidate = jest
      .spyOn(Category, "validate")
      .mockImplementation(() => {
        throw error;
      });
    const model = CategorySequelize.CategoryModel.build({
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });
    expect(() => CategorySequelize.CategoryModelMapper.toEntity(model)).toThrow(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  })

  it("should convert a category model to a category entity", () => {
    const created_at = new Date();
    const model = CategorySequelize.CategoryModel.build({
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
    const entity = CategorySequelize.CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category(
        {
          name: "some value",
          description: "some description",
          is_active: true,
          created_at,
        },
        new UniqueEntityId("9366b7dc-2d71-4799-b91c-c64adb205104")
      ).toJSON()
    );
  });
})