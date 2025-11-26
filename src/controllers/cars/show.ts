import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { CustomError } from 'utils/response/custom-error/CustomError';

import { Car } from '../../orm/entities/cars/Car';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const carRepository = getRepository(Car);
  try {
    const car = await carRepository.findOne(id, {
      relations: ['driver'],
      select: ['id', 'model', 'mark', 'car_class', 'car_status', 'driver'],
    });

    if (!car) {
      const customError = new CustomError(404, 'General', `Car with id:${id} not found.`, ['Car not found.']);
      return next(customError);
    }

    res.customSuccess(200, 'Car found', car);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
