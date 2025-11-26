import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { order_status, payment_type, start_date, end_date, driverId, clientId } = req.body;
  const { id } = req.params;
  const errors: ErrorValidation[] = [];

  if (!id) {
    errors.push({ field: 'id', message: 'Id is required.' });
  }

  if (order_status !== undefined && typeof order_status !== 'string') {
    errors.push({ field: 'order_status', message: 'order_status must be a string.' });
  }

  if (payment_type !== undefined && typeof payment_type !== 'string') {
    errors.push({ field: 'payment_type', message: 'payment_type must be a string.' });
  }

  if (driverId !== undefined && driverId !== null && typeof driverId !== 'number' && typeof driverId !== 'string') {
    errors.push({ field: 'driverId', message: 'driverId must be a number or string.' });
  }

  if (clientId !== undefined && clientId !== null && typeof clientId !== 'number' && typeof clientId !== 'string') {
    errors.push({ field: 'clientId', message: 'clientId must be a number or string.' });
  }

  if (start_date !== undefined && start_date !== null && isNaN(Date.parse(String(start_date)))) {
    errors.push({ field: 'start_date', message: 'start_date must be a valid date.' });
  }

  if (end_date !== undefined && end_date !== null && isNaN(Date.parse(String(end_date)))) {
    errors.push({ field: 'end_date', message: 'end_date must be a valid date.' });
  }

  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation errors occurred.'));
  }

  return next();
};
