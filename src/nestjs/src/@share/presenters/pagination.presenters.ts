import { Exclude, Expose, Transform } from "class-transformer"

export type PaginationPresenterProps = {
  current_page: number
  per_page: number
  last_page: number
  total: number
}

export class PaginationPresenter {
  @Transform(({ value }) => parseInt(value))
  current_page: number
  @Transform(({ value }) => parseInt(value))
  per_page: number
  @Transform(({ value }) => parseInt(value))
  last_page: number
  @Transform(({ value }) => parseInt(value))
  total: number

  constructor(props: PaginationPresenterProps) {
    this.current_page = props.current_page
    this.per_page = props.per_page
    this.last_page = props.last_page
    this.total = props.total
  }
}


export abstract class CollectionPresenter {
  @Exclude()
  protected paginationPresenter: PaginationPresenter;

  constructor(props: PaginationPresenterProps) {
    this.paginationPresenter = new PaginationPresenter(props);
  }

  @Expose({ name: 'meta' })
  get meta() {
    return this.paginationPresenter;
  }

  abstract get data();
}