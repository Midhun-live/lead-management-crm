import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject } from 'zod';

const collapseSpaces = (val: string) => val.replace(/\s+/g, ' ');

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name is required')
      .transform(collapseSpaces)
      .refine((val) => val.length >= 2, { message: 'Name must be at least 2 characters' }),
    email: z.string({ required_error: 'Email is required' })
      .trim()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .toLowerCase(),
    password: z.string({ required_error: 'Password is required' })
      .trim()
      .min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .trim()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .toLowerCase(),
    password: z.string({ required_error: 'Password is required' })
      .trim()
      .min(1, 'Password is required'),
  }),
});

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query;
      if (parsed.params !== undefined) req.params = parsed.params;
      next();
    } catch (error) {
      next(error);
    }
  };
};
