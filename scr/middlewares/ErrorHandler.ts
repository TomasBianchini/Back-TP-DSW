import { NextFunction, Request, Response } from 'express';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { HttpStatus } from '../shared/constants/HttpStatus.js';
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from '../shared/constants/errors.js';

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: err.message,
    });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  if (err instanceof ForbiddenError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  if (err instanceof UniqueConstraintViolationException) {
    return res
      .status(HttpStatus.CONFLICT)
      .json({ message: 'A unique constraint violation occurred.' });
  }
  if (err.code === '23503') {
    return res
      .status(HttpStatus.CONFLICT)
      .json({ message: 'A foreign key constraint violation occurred.' });
  }
  if (err.code === 11000) {
    return res
      .status(HttpStatus.CONFLICT)
      .json({ message: 'A unique constraint violation occurred.' });
  }
  console.error(err);
  res.status(500).json({ message: err.message });
};

export default ErrorHandler;
