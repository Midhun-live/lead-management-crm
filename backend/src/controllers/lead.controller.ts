import { Request, Response } from 'express';
import { LeadService } from '../services/lead.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const leadService = new LeadService();

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const lead = await leadService.createLead(userId, req.body);
  res.status(201).json(new ApiResponse('Lead created successfully', lead));
});

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await leadService.getLeads(userId, req.query as any);
  res.status(200).json(new ApiResponse('Leads retrieved successfully', result));
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const lead = await leadService.getLeadById(userId, req.params.id);
  res.status(200).json(new ApiResponse('Lead retrieved successfully', lead));
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const lead = await leadService.updateLead(userId, req.params.id, req.body);
  res.status(200).json(new ApiResponse('Lead updated successfully', lead));
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await leadService.deleteLead(userId, req.params.id);
  res.status(200).json(new ApiResponse('Lead deleted successfully', null));
});
