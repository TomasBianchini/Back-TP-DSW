import { NextFunction, Request, Response } from 'express';

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === 11000) {
    return res
      .status(409)
      .json({ message: 'A unique constraint violation occurred.' });
  }
  res.status(500).json({ message: err.message });
};

export default ErrorHandler;
