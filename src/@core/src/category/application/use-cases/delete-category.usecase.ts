import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";
import CategoryRepository from "../../domain/repository/category.repository";

export namespace DeleteCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      await this.categoryRepo.delete(input.id);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = void;
}

export default DeleteCategoryUseCase;
