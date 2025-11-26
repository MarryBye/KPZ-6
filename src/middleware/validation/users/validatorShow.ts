import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorShow = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const errors: ErrorValidation[] = [];

  if (!id) {
    errors.push({ field: 'id', message: 'Id is required.' });
  }

  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation errors occurred.'));
  }

  return next();
};
