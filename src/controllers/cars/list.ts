import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { CustomError } from 'utils/response/custom-error/CustomError';

import { Car } from '../../orm/entities/cars/Car';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const carRepository = getRepository(Car);
  try {
    const cars = await carRepository.find({
      relations: ['driver'],
      select: ['id', 'model', 'mark', 'car_class', 'car_status', 'driver'],
    });
    res.customSuccess(200, 'List of cars.', cars);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of cars.`, null, err);
    return next(customError);
  }
};
