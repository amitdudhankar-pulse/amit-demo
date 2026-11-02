class ValidationError {
  constructor(public message: string | string[]) {}
}

class MessageError extends Error {
  constructor(public message: string) {
    super();
  }
}

export { ValidationError, MessageError };
