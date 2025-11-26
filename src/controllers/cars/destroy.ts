import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Car } from 'orm/entities/cars/Car';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const carRepository = getRepository(Car);
  try {
    const car = await carRepository.findOne({ where: { id } });

    if (!car) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Car with id:${id} doesn't exist.`]);
      return next(customError);
    }

    await carRepository.delete(id);

    res.customSuccess(200, 'Car successfully deleted.', {
      id: car.id,
      mark: car.mark,
      model: car.model,
    });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
