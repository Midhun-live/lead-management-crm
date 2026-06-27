import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
};
