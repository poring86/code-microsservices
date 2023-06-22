import { Test } from "@nestjs/testing"
import { DatabaseModule } from "./database.module"
import { ConfigModule } from "@nestjs/config"
import { getConnectionToken } from "@nestjs/sequelize"
import { Sequelize } from 'sequelize-typescript'
import * as Joi from 'joi'
import { CONFIG_DB_SCHEMA } from "../config/config.module"

describe('DatabaseModule Unit Tests', () => {

  describe('sqlite connection', () => {
    const connOptions = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: true,
      DB_AUTO_LOAD_MODELS: true
    }
    it('should be valid', () => {
      const schema = Joi.object({
        ...CONFIG_DB_SCHEMA
      })
      const { error } = schema.validate(connOptions, {})
      expect(error).toBeUndefined()
    })
  })

  it('should be a sqlite connection', async () => {
    const connOptions = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: true
    }
    const schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    })
    schema.validate(connOptions)

    const module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          validationSchema: null,
          load: [
            () => ({
              DB_VENDOR: 'sqlite',
              DB_HOST: ':memory:'
            })
          ]
        })
      ]
    }).compile()

    const app = module.createNestApplication()
    const conn = app.get<Sequelize>(getConnectionToken())
    expect(conn).toBeDefined()
    expect(conn.options.dialect).toBe('sqlite')
    expect(conn.options.host).toBe(':memory:')
    await conn.close()
  })

  // TODO
  // it('should be a mysql connection', () => {
  //   describe('mysql connection', () => {
  //     const connOptions = {
  //       DB_VENDOR: 'mysql',
  //       DB_HOST: 'locahost',
  //       DB_DATABASE: 'micro-videos',
  //       DB_USERNAME: 'root',
  //       DB_PASSWORD: 'root',
  //       DB_PORT: 3306,
  //       DB_LOGGING: true,
  //       DB_AUTO_LOAD_MODELS: true
  //     }
  //     it('should be valid', () => {
  //       const schema = Joi.object({
  //         ...CONFIG_DB_SCHEMA
  //       })
  //       const { error } = schema.validate(connOptions, {})
  //       expect(error).toBeUndefined()
  //     })

  //     it('should be a mysql connection', async () => {
  //       const module = await Test.createTestingModule({
  //         imports: [
  //           DatabaseModule,
  //           ConfigModule.forRoot({
  //             isGlobal: true,
  //             ignoreEnvFile: true,
  //             ignoreEnvVars: true,
  //             validationSchema: null,
  //             load: [() => connOptions]
  //           })
  //         ]
  //       }).compile()

  //       const app = module.createNestApplication()
  //       const conn = app.get<Sequelize>(getConnectionToken())
  //       expect(conn).toBeDefined()
  //       expect(conn.options.dialect).toBe('myslq')
  //       expect(conn.options.host).toBe('localhost')
  //       expect(conn.options.database).toBe('localhost')
  //       expect(conn.options.username).toBe('root')
  //       expect(conn.options.password).toBe('root')
  //       expect(conn.options.port).toBe(3306)
  //       await conn.close()
  //     })
  //   })
  // })
})