import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Car } from 'orm/entities/cars/Car';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { mark, model, car_class, car_status, driver } = req.body;

  const carRepository = getRepository(Car);
  try {
    const car = await carRepository.findOne({ where: { id } });

    if (!car) {
      const customError = new CustomError(404, 'General', `Car with id:${id} not found.`, ['Car not found.']);
      return next(customError);
    }

    car.mark = mark;
    car.model = model;
    car.car_class = car_class;
    car.car_status = car_status;

    // если нужно менять водителя
    if (driver !== undefined) {
      car.driver = driver;
    }

    try {
      await carRepository.save(car);
      res.customSuccess(200, 'Car successfully saved.');
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `Car '${car.mark} ${car.model}' can't be saved.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
