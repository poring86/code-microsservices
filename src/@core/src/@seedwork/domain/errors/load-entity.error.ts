import { FieldsErrors } from "../validators/validator-fields-interface";

export class LoadEntityError extends Error {
  constructor(public error: FieldsErrors, message?: string) {
    super(message ?? 'An entity was not loaded')
    this.name = "LoadEntityError"
  }
}