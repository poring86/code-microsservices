import InvalidUuidError from "../../errors/invalid-uuid.error";
import UniqueEntityId from "./../unique-entity-id.vo";
import { validate as uuidValidate } from "uuid";

function spyValidateMethod() {
  return jest.spyOn(UniqueEntityId.prototype as any, "validate");
}

describe("UniqueEntityId Unit Tests", () => {
  // beforeEach(() => {
  //   jest.clearAllMocks()
  // })

  // const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");

  // beforeEach(() => {
  //   validateSpy.mockClear();
  // });

  it("should throw error when uuid is invalid", () => {
    const validateSpy = spyValidateMethod();
    expect(() => new UniqueEntityId("fake id")).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should accept a uuid in constructor", () => {
    const validateSpy = spyValidateMethod();
    const uuid = "3936900b-92c8-4446-b1d7-1933eeaec6fa";
    const vo = new UniqueEntityId(uuid);
    expect(vo.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should accept a uuid in constructor", () => {
    const validateSpy = spyValidateMethod();
    const vo = new UniqueEntityId();
    expect(uuidValidate(vo.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});
