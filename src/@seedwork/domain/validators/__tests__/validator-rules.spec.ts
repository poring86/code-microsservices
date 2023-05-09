import { ValidationError } from "../../errors/validation.error";
import ValidatorRules from "../validator-rules";

type Values = {
  value: any;
  property: string;
};

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
};

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, "error">) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule];
  method.apply(validator, params);
}

function assertIsInvalid({
  value,
  property,
  rule,
  error,
  params = [],
}: ExpectedRule): void {
  expect(() => {
    runRule({ value, property, rule, params });
  }).toThrow(error);
}

function assertIsValid({
  value,
  property,
  rule,
  error,
  params = [],
}: ExpectedRule): void {
  expect(() => {
    runRule({ value, property, rule, params });
  }).not.toThrow(error);
}

describe("ValidatorRules Unit Tests", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("some value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field");
  });

  test("required validation rule", () => {
    // invalid cases
    let arrange: Values[] = [
      { value: null, property: "field" },
      {
        value: undefined,
        property: "field",
      },
      {
        value: "",
        property: "field",
      },
    ];
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "required",
        error: new ValidationError("The field is required"),
      });
    });

    // valid cases
    arrange = [
      {
        value: "test",
        property: "field",
      },
      {
        value: 5,
        property: "field",
      },
      {
        value: 0,
        property: "field",
      },
      {
        value: false,
        property: "field",
      },
    ];
    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "required",
        error: new ValidationError("The field is required"),
      });
    });
  });
  test("string validation rule", () => {
    // invalid
    let arrange: Values[] = [
      { value: 5, property: "field" },
      {
        value: {},
        property: "field",
      },
      {
        value: false,
        property: "field",
      },
    ];
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "string",
        error: new ValidationError("The field must be a string"),
      });
    });
    // valid
    arrange = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: "test", property: "field" },
    ];
    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "string",
        error: new ValidationError("The field must be a string"),
      });
    });
  });

  test("maxLenght validation rule", () => {
    // Casos inválidos
    let arrange: Values[] = [{ value: "aaaaa", property: "field" }];
    const error = new ValidationError(
      "The field must be less or equal than 4 characters"
    );
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [4],
      });
    });
    // Casos válidos
    arrange = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: "aaaaa", property: "field" },
    ];
    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [5],
      });
    });
  });

  test("boolean validation rule", () => {
    // Casos inválidos
    let arrange: Values[] = [
      { value: "true", property: "field" },
      { value: "false", property: "field" },
    ];
    const error = new ValidationError("The field must be a boolean");
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
      });
    });
    // Casos válidos
    arrange = [
      { value: false, property: "field" },
      { value: true, property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];
    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
        params: [5],
      });
    });
  });

  it("should throw a validation error when combine two or more validation rules", () => {
    let validator = ValidatorRules.values(null, "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(new ValidationError("The field is required"));

    validator = ValidatorRules.values(5, "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(new ValidationError("The field must be a string"));

    validator = ValidatorRules.values("aaaaaa", "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError("The field must be less or equal than 5 characters")
    );

    validator = ValidatorRules.values("aaaaaa", "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError("The field must be less or equal than 5 characters")
    );

    validator = ValidatorRules.values("aaaaaa", "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError("The field must be less or equal than 5 characters")
    );

    validator = ValidatorRules.values(null, "field");
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError("The field is required"));

    validator = ValidatorRules.values(5, "field");
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError("The field must be a boolean"));
  });

  it("should valid when combine two or more validation rules", () => {
    expect.assertions(0);
    // string
    ValidatorRules.values("test", "field").required().string();
    ValidatorRules.values("aaaaa", "field").required().string().maxLength(5);

    // boolean
    ValidatorRules.values(true, "field").required().boolean();
    ValidatorRules.values(false, "field").required().boolean();
  });
});
