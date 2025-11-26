import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { mark, model, car_class, car_status, driver_id } = req.body;
  const errors: ErrorValidation[] = [];

  if (!mark) {
    errors.push({ field: 'mark', message: 'Mark is required.' });
  }

  if (!model) {
    errors.push({ field: 'model', message: 'Model is required.' });
  }

  if (car_class !== undefined && typeof car_class !== 'string') {
    errors.push({ field: 'car_class', message: 'car_class must be a string.' });
  }

  if (car_status !== undefined && typeof car_status !== 'string') {
    errors.push({ field: 'car_status', message: 'car_status must be a string.' });
  }

  if (driver_id !== undefined && typeof driver_id !== 'number' && typeof driver_id !== 'string') {
    errors.push({ field: 'driver_id', message: 'driver_id must be a number or string.' });
  }

  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation errors occurred.'));
  }

  return next();
};
