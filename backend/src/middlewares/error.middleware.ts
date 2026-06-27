import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(`Prisma Known Error (${err.code}): ${err.message}`);
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Unique constraint violation';
        details = { target: err.meta?.target };
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
        details = env.NODE_ENV === 'development' ? { code: err.code, meta: err.meta } : undefined;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error(`Prisma Validation Error: ${err.message}`);
    statusCode = 400;
    message = 'Database validation failed';
    details = env.NODE_ENV === 'development' ? { error: err.message } : undefined;
  } else if (err.name === 'ZodError' || err.constructor?.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.errors || err.message;
  } else {
    logger.error(`Unhandled Error: ${err.stack || err.message || err}`);
    if (env.NODE_ENV === 'development') {
      details = { stack: err.stack, error: err.message };
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details !== undefined && { details }),
  });
};
