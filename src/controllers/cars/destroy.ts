import { Request, Response, NextFunction } from 'express';

import { CarService } from 'service/CarService';
import { CarResponseDTO } from '../../dto/car_response_dto';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const carService = new CarService();

  const [car, error] = await carService.destroy(id);

  if (error) {
    return next(error);
  }

  const carDTO = new CarResponseDTO(car!);

  res.customSuccess(200, 'Car successfully deleted.', carDTO);
};