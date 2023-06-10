const createErrorFactory = (name) =>
  class BusinessError extends Error {
    constructor(message) {
      super(message);
      this.name = name;
    }
  };

export const connectionError = createErrorFactory("ConnectionError");
export const validationError = createErrorFactory("ValidationError");
