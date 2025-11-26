import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { RideOrder } from 'orm/entities/ride_orders/RideOrder';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const rideOrderRepository = getRepository(RideOrder);
  try {
    const orders = await rideOrderRepository.find({
      relations: ['driver', 'client'],
      select: ['id', 'order_status', 'payment_type', 'start_date', 'end_date', 'driver', 'client'],
    });

    res.customSuccess(200, 'List of ride orders.', orders);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve ride orders.`, null, err);
    return next(customError);
  }
};
