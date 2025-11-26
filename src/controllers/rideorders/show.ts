import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { RideOrder } from 'orm/entities/ride_orders/RideOrder';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const rideOrderRepository = getRepository(RideOrder);

  try {
    const order = await rideOrderRepository.findOne(id, {
      relations: ['driver', 'client'],
      select: ['id', 'order_status', 'payment_type', 'start_date', 'end_date', 'driver', 'client'],
    });

    if (!order) {
      const customError = new CustomError(404, 'General', `Ride order with id:${id} not found.`, [
        'Ride order not found.',
      ]);
      return next(customError);
    }

    res.customSuccess(200, 'Ride order found.', order);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
