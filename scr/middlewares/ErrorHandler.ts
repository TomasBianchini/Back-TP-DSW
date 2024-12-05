import { NextFunction, Request, Response } from 'express';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import jsonwebtoken from 'jsonwebtoken';
const { TokenExpiredError, JsonWebTokenError } = jsonwebtoken;
import { HttpStatus } from '../shared/utils/HttpStatus.js';
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  InvalidCredentialsError,
  BadRequestError,
  MeliError,
} from '../shared/utils/errors.js';

import logger from '../shared/utils/logger.js';

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = errorStatus(error);
  const message = errorMessage(error);
  logger.error({
    name: error.name ?? 'Error',
    message,
    stack: error.stack || 'There is no stack',
    error: error,
  });
  res.status(status).json({ message });
};

const errorStatus = (error: any): number => {
  if (error instanceof InvalidCredentialsError) return error.status;
  if (error instanceof ValidationError) return error.status;
  if (error instanceof NotFoundError) return HttpStatus.NOT_FOUND;
  if (error instanceof UnauthorizedError) return error.status;
  if (error instanceof ForbiddenError) return error.status;
  if (error instanceof BadRequestError) return error.status;
  if (error instanceof UniqueConstraintViolationException)
    return HttpStatus.CONFLICT;
  if (error instanceof MeliError) return error.status;
  if (error instanceof TokenExpiredError) return HttpStatus.UNAUTHORIZED;
  if (error instanceof JsonWebTokenError) return HttpStatus.UNAUTHORIZED;

  if (error.code === 23503) return HttpStatus.CONFLICT;
  if (error.code === 11000) return HttpStatus.CONFLICT;

  return HttpStatus.INTERNAL_SERVER_ERROR;
};

const errorMessage = (error: any): string => {
  if (error instanceof InvalidCredentialsError) return error.message;
  if (error instanceof ValidationError) return error.message;
  if (error instanceof NotFoundError) return error.message;
  if (error instanceof UnauthorizedError) return error.message;
  if (error instanceof BadRequestError) return error.message;
  if (error instanceof ForbiddenError) return error.message;
  if (error instanceof MeliError) return error.message;
  if (error instanceof UniqueConstraintViolationException)
    return 'A unique constraint violation occurred.';
  if (error instanceof TokenExpiredError) return error.message;
  if (error instanceof JsonWebTokenError) return error.message;

  if (error.code === 23503)
    return 'A foreign key constraint violation occurred.';
  if (error.code === 11000) return 'A unique constraint violation occurred.';

  return error.message;
};

export default errorHandler;
