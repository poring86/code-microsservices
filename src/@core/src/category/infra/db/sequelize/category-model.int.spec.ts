import { DataType } from "sequelize-typescript"
import { CategorySequelize } from "./category-sequelize"

import { setupSequelize } from "#seedwork/infra/testing/helpers/db"

const { CategoryModel } = CategorySequelize

describe("CategoryModel Unit Tests", () => {
  setupSequelize({ models: [CategoryModel] })

  test('mapping props', () => {
    const attributesMap = CategoryModel.getAttributes()
    const attributes = Object.keys(attributesMap)
    expect(attributes).toStrictEqual(['id', 'name', 'description', 'is_active', 'created_at'])

    const idAttr = attributesMap.id
    expect(idAttr).toMatchObject({
      field: 'id',
      fieldName: 'id',
      primaryKey: true,
      type: DataType.UUID()
    })

    const nameAttr = attributesMap.name
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255)
    })

    const descriptionAttr = attributesMap.description
    expect(descriptionAttr).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT()
    })

    const isActiveAttr = attributesMap.is_active
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      allowNull: false,
      type: DataType.BOOLEAN()
    })

    const createdAtAttr = attributesMap.created_at
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.BOOLEAN()
    })
  })

  test('create', async () => {
    const arrange = {
      id: 'b4b930ad-4ef7-4ec9-8a8a-798534340117',
      name: 'test',
      is_active: true,
      created_at: new Date()
    }
    const category = await CategoryModel.create(arrange)
    expect(category.toJSON()).toStrictEqual(arrange)
  })
})