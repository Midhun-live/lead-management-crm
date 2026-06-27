import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(201).json(new ApiResponse('User registered successfully', user));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json(new ApiResponse('Login successful', result));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const { password, ...sanitized } = req.user!;
  res.status(200).json(new ApiResponse('Current user retrieved successfully', sanitized));
});
