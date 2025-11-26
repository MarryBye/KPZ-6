import { Request, Response, NextFunction } from 'express';

import { RideOrderService } from 'service/RideOrderService';
import { RideOrderResponseDTO } from '../../dto/rideorder_response_dto';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { order_status, payment_type, start_date, end_date, driverId, clientId } = req.body;

  const rideOrderService = new RideOrderService();

  const [order, error] = await rideOrderService.edit(id, order_status, payment_type, start_date, end_date, driverId, clientId);

  if (error) {
    return next(error);
  }

  const orderDTO = new RideOrderResponseDTO(order);

  res.customSuccess(200, 'Ride order successfully saved.', orderDTO);
};