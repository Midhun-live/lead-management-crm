import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const dashboardService = new DashboardService();

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await dashboardService.getDashboardData(userId);
  res.status(200).json(new ApiResponse('Dashboard fetched successfully', data));
});
