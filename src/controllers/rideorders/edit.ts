import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { RideOrder } from 'orm/entities/ride_orders/RideOrder';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { order_status, payment_type, start_date, end_date, driverId, clientId } = req.body;

  const rideOrderRepository = getRepository(RideOrder);
  const userRepository = getRepository(User);

  try {
    const order = await rideOrderRepository.findOne({ where: { id } });

    if (!order) {
      const customError = new CustomError(404, 'General', `Ride order with id:${id} not found.`, [
        'Ride order not found.',
      ]);
      return next(customError);
    }

    order.order_status = order_status ?? order.order_status;
    order.payment_type = payment_type ?? order.payment_type;

    if (driverId) {
      const driver = await userRepository.findOne(driverId);
      if (!driver) {
        const customError = new CustomError(404, 'General', `Driver with id:${driverId} not found.`, [
          'Driver not found.',
        ]);
        return next(customError);
      }
      order.driver = driver;
    }

    if (clientId) {
      const client = await userRepository.findOne(clientId);
      if (!client) {
        const customError = new CustomError(404, 'General', `Client with id:${clientId} not found.`, [
          'Client not found.',
        ]);
        return next(customError);
      }
      order.client = client;
    }

    await rideOrderRepository.save(order);
    res.customSuccess(200, 'Ride order successfully saved.');
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
