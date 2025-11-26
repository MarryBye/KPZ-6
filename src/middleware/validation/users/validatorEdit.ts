import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { username, name } = req.body;
  const { id } = req.params;

  const errors: ErrorValidation[] = [];

  if (!id) {
    errors.push({ field: 'id', message: 'Id is required.' });
  }

  if (!username) {
    errors.push({ field: 'username', message: 'Username must be a string.' });
  }

  if (!name) {
    errors.push({ field: 'name', message: 'Name must be a string.' });
  }

  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation errors occurred.'));
  }

  return next();
};
