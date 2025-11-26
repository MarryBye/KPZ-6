import { getRepository } from 'typeorm';

import { Car } from '../orm/entities/cars/Car';
import { Car_class, Car_status } from '../orm/entities/cars/types';
import { User } from '../orm/entities/users/User';
import { CustomError } from '../utils/response/custom-error/CustomError';

class CarService {
  private carRepository = getRepository(Car);
  private userRepository = getRepository(User);

  async create(
    mark: string,
    model: string,
    car_class: Car_class,
    car_status: Car_status,
    driver_id?: number | null,
  ): Promise<[Car | null, CustomError | null]> {
    try {
      const car = new Car();
      car.mark = mark;
      car.model = model;
      car.car_class = (car_class as any) || 'STANDARD';
      car.car_status = (car_status as any) || 'AVAILABLE';

      if (driver_id !== undefined) {
        const driver = await this.userRepository.findOne({ where: { id: driver_id } });
        if (!driver) {
          return [
            null,
            new CustomError(404, 'General', `Driver with id:${driver_id} not found.`, ['Driver not found.']),
          ];
        }
        car.driver = driver;
      }

      await this.carRepository.save(car);
      return [car, null];
    } catch (err) {
      return [null, new CustomError(500, 'Raw', 'Error', null, err)];
    }
  }

  async list(): Promise<[Car[] | null, CustomError | null]> {
    try {
      const cars = await this.carRepository.find({
        relations: ['driver'],
        select: ['id', 'model', 'mark', 'car_class', 'car_status', 'driver'],
      });
      return [cars, null];
    } catch (err) {
      return [null, new CustomError(400, 'Raw', `Can't retrieve list of cars.`, null, err)];
    }
  }

  async show(id: number | string): Promise<[Car | null, CustomError | null]> {
    try {
      const car = await this.carRepository.findOne(id, {
        relations: ['driver'],
        select: ['id', 'model', 'mark', 'car_class', 'car_status', 'driver'],
      });

      if (!car) {
        return [null, new CustomError(404, 'General', `Car with id:${id} not found.`, ['Car not found.'])];
      }

      return [car, null];
    } catch (err) {
      return [null, new CustomError(400, 'Raw', 'Error', null, err)];
    }
  }

  async edit(
    id: number | string,
    mark?: string,
    model?: string,
    car_class?: string,
    car_status?: string,
    driver_id?: number,
  ): Promise<[Car | null, CustomError | null]> {
    try {
      const car = await this.carRepository.findOne({ where: { id } });

      if (!car) {
        return [null, new CustomError(404, 'General', `Car with id:${id} not found.`, ['Car not found.'])];
      }

      if (mark !== undefined) car.mark = mark;
      if (model !== undefined) car.model = model;
      if (car_class !== undefined) car.car_class = car_class as any;
      if (car_status !== undefined) car.car_status = car_status as any;

      if (driver_id !== undefined) {
        const client = await this.userRepository.findOne({ where: { id: driver_id } });
        if (!client) {
          return [
            null,
            new CustomError(404, 'General', `Driver with id:${driver_id} not found.`, ['Driver not found.']),
          ];
        }
        car.driver = client;
      }

      try {
        await this.carRepository.save(car);
        return [car, null];
      } catch (err) {
        return [null, new CustomError(409, 'Raw', `Car '${car.mark} ${car.model}' can't be saved.`, null, err)];
      }
    } catch (err) {
      return [null, new CustomError(400, 'Raw', 'Error', null, err)];
    }
  }

  async destroy(
    id: number | string,
  ): Promise<[Car | null, CustomError | null]> {
    try {
      const car = await this.carRepository.findOne({ where: { id } });

      if (!car) {
        return [null, new CustomError(404, 'General', 'Not Found', [`Car with id:${id} doesn't exist.`])];
      }

      await this.carRepository.delete(id);

      return [car, null];
    } catch (err) {
      return [null, new CustomError(400, 'Raw', 'Error', null, err)];
    }
  }
}

export { CarService };
