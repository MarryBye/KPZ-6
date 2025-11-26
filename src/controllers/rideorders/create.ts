import { Request, Response, NextFunction } from 'express';

import { RideOrderService } from 'service/RideOrderService';
import { RideOrderResponseDTO } from '../../dto/rideorder_response_dto';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const rideOrderService = new RideOrderService();

  const { order_status, payment_type, start_date, end_date, driverId, clientId } = req.body;

  const [order, error] = await rideOrderService.create(order_status, payment_type, start_date, end_date, driverId, clientId);

  if (error) {
    return next(error);
  }

  const orderDTO = new RideOrderResponseDTO(order);

  res.customSuccess(201, 'Ride order successfully created.', orderDTO);
};