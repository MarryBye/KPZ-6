import { Request, Response, NextFunction } from 'express';

import { CarService } from 'service/CarService';
import { CarResponseDTO } from '../../dto/car_response_dto';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const carService = new CarService();

  const { mark, model, car_class, car_status, driver_id } = req.body;

  const [car, error] = await carService.create(mark, model, car_class, car_status, driver_id);

  if (error) {
    return next(error);
  }

  const carDTO = new CarResponseDTO(car!);

  res.customSuccess(201, 'Car successfully created.', carDTO);
};