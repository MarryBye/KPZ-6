import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { mark, model, car_class, car_status, driver_id } = req.body;
  const { id } = req.params;
  const errors: ErrorValidation[] = [];

  if (!id) {
    errors.push({ field: 'id', message: 'Id is required.' });
  }

  if (mark !== undefined && typeof mark !== 'string') {
    errors.push({ field: 'mark', message: 'Mark must be a string.' });
  }

  if (model !== undefined && typeof model !== 'string') {
    errors.push({ field: 'model', message: 'Model must be a string.' });
  }

  if (driver_id !== undefined && typeof driver_id !== 'number' && typeof driver_id !== 'string') {
    errors.push({ field: 'driver_id', message: 'driver_id must be a number or string.' });
  }

  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation errors occurred.'));
  }

  return next();
};
