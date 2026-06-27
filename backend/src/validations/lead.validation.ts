import { z } from 'zod';
import { LeadStatus, LeadSource } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const validateUuidParam = (req: Request, res: Response, next: NextFunction) => {
  if (!UUID_REGEX.test(req.params.id)) {
    return next(new ApiError(400, 'Invalid Lead ID.'));
  }
  next();
};

const collapseSpaces = (val: string) => val.replace(/\s+/g, ' ');

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name is required')
      .transform(collapseSpaces),
    company: z.string({ required_error: 'Company is required' })
      .trim()
      .min(1, 'Company is required')
      .transform(collapseSpaces),
    email: z.string({ required_error: 'Email is required' })
      .trim()
      .min(1, 'Email cannot be empty')
      .email('Invalid email address')
      .toLowerCase(),
    phone: z.string({ required_error: 'Phone is required' })
      .trim()
      .min(5, 'Phone must be at least 5 characters')
      .max(20, 'Phone must be at most 20 characters'),
    source: z.nativeEnum(LeadSource, { errorMap: () => ({ message: 'Invalid lead source' }) }),
    status: z.nativeEnum(LeadStatus, { errorMap: () => ({ message: 'Invalid lead status' }) }),
    notes: z.string().trim().min(1, 'Notes cannot be empty').nullable().optional(),
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name cannot be empty').transform(collapseSpaces).optional(),
    company: z.string().trim().min(1, 'Company cannot be empty').transform(collapseSpaces).optional(),
    email: z.string().trim().min(1, 'Email cannot be empty').email('Invalid email address').toLowerCase().optional(),
    phone: z.string().trim().min(5, 'Phone must be at least 5 characters').max(20, 'Phone must be at most 20 characters').optional(),
    source: z.nativeEnum(LeadSource, { errorMap: () => ({ message: 'Invalid lead source' }) }).optional(),
    status: z.nativeEnum(LeadStatus, { errorMap: () => ({ message: 'Invalid lead status' }) }).optional(),
    notes: z.string().trim().min(1, 'Notes cannot be empty').nullable().optional(),
  }),
});

export const queryParamsSchema = z.object({
  query: z.object({
    page: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().positive('Page must be a positive integer')).default(1),
    limit: z.preprocess((val) => (val ? Number(val) : 10), z.number().int().positive('Limit must be a positive integer').max(100, 'Limit cannot exceed 100')).default(10),
    q: z.string().trim().optional(),
    status: z.nativeEnum(LeadStatus, { errorMap: () => ({ message: 'Invalid lead status' }) }).optional(),
    source: z.nativeEnum(LeadSource, { errorMap: () => ({ message: 'Invalid lead source' }) }).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'company'], { errorMap: () => ({ message: 'Invalid sort field' }) }).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc'], { errorMap: () => ({ message: 'Invalid sort order' }) }).default('desc'),
  }).strict('Unexpected query parameters'),
});
