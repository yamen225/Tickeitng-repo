import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
import { param } from 'express-validator';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  res.status(400).send({
    message: err.message,
  });
};
