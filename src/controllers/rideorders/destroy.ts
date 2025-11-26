import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { RideOrder } from 'orm/entities/ride_orders/RideOrder';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const rideOrderRepository = getRepository(RideOrder);

  try {
    const order = await rideOrderRepository.findOne({ where: { id } });

    if (!order) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Ride order with id:${id} doesn't exist.`]);
      return next(customError);
    }

    await rideOrderRepository.delete(id);

    res.customSuccess(200, 'Ride order successfully deleted.', {
      id: order.id,
      order_status: order.order_status,
      payment_type: order.payment_type,
    });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
