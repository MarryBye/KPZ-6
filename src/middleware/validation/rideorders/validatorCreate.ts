import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { order_status, payment_type, start_date, end_date, driverId, clientId } = req.body;
  const errors: ErrorValidation[] = [];

  if (!clientId) {
    errors.push({ field: 'clientId', message: 'clientId is required.' });
  }

  if (!order_status) {
    errors.push({ field: 'order_status', message: 'order_status must be a string.' });
  }

  if (!payment_type) {
    errors.push({ field: 'payment_type', message: 'payment_type must be a string.' });
  }

  if (!driverId) {
    errors.push({ field: 'driverId', message: 'driverId must be a number or string.' });
  }

  if (!start_date) {
    errors.push({ field: 'start_date', message: 'start_date must be a valid date.' });
  }

  if (!end_date) {
    errors.push({ field: 'end_date', message: 'end_date must be a valid date.' });
  }

  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation errors occurred.'));
  }

  return next();
};
