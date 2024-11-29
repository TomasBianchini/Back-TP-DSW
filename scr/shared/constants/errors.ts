import { HttpStatus } from './HttpStatus.js';
class NotFoundError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.status = HttpStatus.NOT_FOUND;
  }
}

class ValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.status = HttpStatus.BAD_REQUEST;
  }
}

class UnauthorizedError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = HttpStatus.UNAUTHORIZED;
  }
}

class ForbiddenError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.status = HttpStatus.FORBIDDEN;
  }
}

class InvalidCredentialsError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCredentialsError';
    this.status = HttpStatus.UNAUTHORIZED;
  }
}

export {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  InvalidCredentialsError,
};
