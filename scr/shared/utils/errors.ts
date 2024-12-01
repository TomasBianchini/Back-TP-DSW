import { HttpStatus } from './HttpStatus.js';
class NotFoundError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.status = HttpStatus.NOT_FOUND;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.status = HttpStatus.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}

class UnauthorizedError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = HttpStatus.UNAUTHORIZED;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ForbiddenError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.status = HttpStatus.FORBIDDEN;
    Error.captureStackTrace(this, this.constructor);
  }
}

class InvalidCredentialsError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCredentialsError';
    this.status = HttpStatus.UNAUTHORIZED;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.status = HttpStatus.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}

export {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  InvalidCredentialsError,
  BadRequestError,
};
