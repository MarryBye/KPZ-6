import { Request, Response, NextFunction } from 'express';

import { CarService } from 'service/CarService';
import { CarResponseDTO } from '../../dto/car_response_dto';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const carService = new CarService();

  const [cars, error] = await carService.list();

  if (error) {
    return next(error);
  }

  const carsDTOs = cars.map((car) => new CarResponseDTO(car));

  res.customSuccess(200, 'List of cars.', carsDTOs);
};