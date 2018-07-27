
export class ConfigurationError extends Error {
  super(msg: string) {
    this.super(msg);
  }
}

export class ConfigurationFileNotFoundErorr extends ConfigurationError {
  super(msg: string) {
    this.super(msg);
  }
}

export class ConfigurationPropertyRequiredError extends ConfigurationError {
  super(msg: string) {
    this.super(msg);
  }
}