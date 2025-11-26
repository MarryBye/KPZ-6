import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const errors: ErrorValidation[] = [];

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required.' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation errors occurred.'));
  }

  return next();
};
