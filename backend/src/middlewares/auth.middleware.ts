import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const userRepository = new UserRepository();

export const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization token is missing or malformed');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new ApiError(401, 'User associated with this token does not exist');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'User account is deactivated');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new ApiError(401, 'Token is invalid due to version mismatch');
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Authorization token has expired');
    }
    throw new ApiError(401, 'Authorization token is invalid');
  }
});
