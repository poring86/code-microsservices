import { PaginationPresenter } from 'nestjs/src/@share/presenters/pagination.presenters'
import { CategoryCollectionPresenter, CategoryPresenter } from './category.presenter'
import { instanceToPlain } from 'class-transformer'

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date()
      const presenter = new CategoryPresenter({
        id: '40c87c37-f522-48c7-a3f0-dc4edb60c9d0',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at
      })

      expect(presenter.id).toBe('40c87c37-f522-48c7-a3f0-dc4edb60c9d0')
      expect(presenter.name).toBe('movie')
      expect(presenter.description).toBe('some description')
      expect(presenter.is_active).toBe(true)
      expect(presenter.created_at).toBe(created_at)
    })

    it('should presenter data', () => {
      const created_at = new Date()
      const presenter = new CategoryPresenter({
        id: '40c87c37-f522-48c7-a3f0-dc4edb60c9d0',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at
      })

      const data = instanceToPlain(presenter)
      expect(data).toStrictEqual({
        id: '40c87c37-f522-48c7-a3f0-dc4edb60c9d0',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at: created_at.toISOString()
      })
    })
  })
})

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date()
      const presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: 'd5e99c11-de67-47e1-b3dc-dd0363434db2',
            name: 'movie',
            description: 'some description',
            is_active: true,
            created_at
          }
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4
      })

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter)
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4
        })
      )
      expect(presenter.data).toStrictEqual([
        new CategoryPresenter({
          id: 'd5e99c11-de67-47e1-b3dc-dd0363434db2',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at
        })
      ])
    })

    it('should presenter data', () => {
      const created_at = new Date()
      let presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: 'd5e99c11-de67-47e1-b3dc-dd0363434db2',
            name: 'movie',
            description: 'some description',
            is_active: true,
            created_at
          }
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4
      })

      expect(instanceToPlain(presenter)).toStrictEqual({
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4
        },
        data: [
          {
            id: 'd5e99c11-de67-47e1-b3dc-dd0363434db2',
            name: 'movie',
            description: 'some description',
            is_active: true,
            created_at: created_at.toISOString()
          }
        ]
      })


      presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: 'd5e99c11-de67-47e1-b3dc-dd0363434db2',
            name: 'movie',
            description: 'some description',
            is_active: true,
            created_at
          }
        ],
        current_page: "1" as any,
        per_page: "2" as any,
        last_page: "3" as any,
        total: "4" as any
      })


      expect(instanceToPlain(presenter)).toStrictEqual({
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4
        },
        data: [
          {
            id: 'd5e99c11-de67-47e1-b3dc-dd0363434db2',
            name: 'movie',
            description: 'some description',
            is_active: true,
            created_at: created_at.toISOString()
          }
        ]
      })
    })
  })
})