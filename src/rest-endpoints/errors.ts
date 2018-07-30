
export class BaseLogicalError extends Error {
  public code: string;

  constructor(code: string, msg: string) {
    super(msg);
    this.code = code;
  }
}

export class ParameterValidationError extends BaseLogicalError {
  constructor(keyName: string) {
    super('INVALID_PARAM', `parameter not supplied or invalid param: ${keyName}`);
  }
}

export class InvalidCredentialError extends BaseLogicalError {
  constructor() { 
    super('INVALID_CREDENTIAL', 'supplied credential was not valid.');
  }
}