import { getRepository } from 'typeorm';

import { RideOrder } from '../orm/entities/ride_orders/RideOrder';
import { User } from '../orm/entities/users/User';
import { Order_status, Payment_type } from '../orm/entities/ride_orders/types';
import { CustomError } from '../utils/response/custom-error/CustomError';

class RideOrderService {
  private rideOrderRepository = getRepository(RideOrder);
  private userRepository = getRepository(User);

  async create(
    order_status: Order_status,
    payment_type: Payment_type,
    start_date: Date | string,
    clientId: number | string,
    driverId?: number | string,
    end_date?: Date | string,
  ): Promise<[RideOrder | null, CustomError | null]> {
    try {
      const order = new RideOrder();
      order.order_status = (order_status as any) || 'In Progress';
      order.payment_type = (payment_type as any) || 'Credit Card';
      order.start_date = start_date ? new Date(start_date) : null;
      order.end_date = end_date ? new Date(end_date) : null;

      if (driverId !== undefined && driverId !== null) {
        const driver = await this.userRepository.findOne(driverId);
        if (!driver) {
          return [null, new CustomError(404, 'General', `Driver with id:${driverId} not found.`, ['Driver not found.'])];
        }
        order.driver = driver;
      }

      const client = await this.userRepository.findOne(clientId);
      if (!client) {
        return [null, new CustomError(404, 'General', `Client with id:${clientId} not found.`, ['Client not found.'])];
      }
      order.client = client;

      await this.rideOrderRepository.save(order);
      return [order, null];
    } catch (err) {
      return [null, new CustomError(500, 'Raw', 'Error', null, err)];
    }
  }

  async list(): Promise<[RideOrder[] | null, CustomError | null]> {
    try {
      const orders = await this.rideOrderRepository.find({
        relations: ['driver', 'client'],
      });
      return [orders, null];
    } catch (err) {
      return [null, new CustomError(400, 'Raw', `Can't retrieve ride orders.`, null, err)];
    }
  }

  async show(id: number | string): Promise<[RideOrder | null, CustomError | null]> {
    try {
      const order = await this.rideOrderRepository.findOne(id, {
        relations: ['driver', 'client'],
      });

      if (!order) {
        return [null, new CustomError(404, 'General', `Ride order with id:${id} not found.`, ['Ride order not found.'])];
      }

      return [order, null];
    } catch (err) {
      return [null, new CustomError(400, 'Raw', 'Error', null, err)];
    }
  }

  async edit(
    id: number | string,
    order_status?: Order_status,
    payment_type?: Payment_type,
    start_date?: Date | string,
    end_date?: Date | string,
    driverId?: number | string,
    clientId?: number | string,
  ): Promise<[RideOrder | null, CustomError | null]> {
    try {
      const order = await this.rideOrderRepository.findOne({ where: { id } });

      if (!order) {
        return [null, new CustomError(404, 'General', `Ride order with id:${id} not found.`, ['Ride order not found.'])];
      }

      order.order_status = order_status ?? order.order_status;
      order.payment_type = payment_type ?? order.payment_type;
      order.start_date = start_date !== undefined ? (start_date ? new Date(start_date) : null) : order.start_date;
      order.end_date = end_date !== undefined ? (end_date ? new Date(end_date) : null) : order.end_date;

      if (driverId !== undefined) {
        if (driverId === null) {
          order.driver = null;
        } else {
          const driver = await this.userRepository.findOne(driverId);
          if (!driver) {
            return [null, new CustomError(404, 'General', `Driver with id:${driverId} not found.`, ['Driver not found.'])];
          }
          order.driver = driver;
        }
      }

      if (clientId !== undefined) {
        if (clientId === null) {
          order.client = null;
        } else {
          const client = await this.userRepository.findOne(clientId);
          if (!client) {
            return [null, new CustomError(404, 'General', `Client with id:${clientId} not found.`, ['Client not found.'])];
          }
          order.client = client;
        }
      }

      try {
        await this.rideOrderRepository.save(order);
        return [order, null];
      } catch (err) {
        return [null, new CustomError(409, 'Raw', `Ride order '${order.id}' can't be saved.`, null, err)];
      }
    } catch (err) {
      return [null, new CustomError(400, 'Raw', 'Error', null, err)];
    }
  }

  async destroy(id: number | string): Promise<[RideOrder | null, CustomError | null]> {
    try {
      const order = await this.rideOrderRepository.findOne({ where: { id } });

      if (!order) {
        return [null, new CustomError(404, 'General', 'Not Found', [`Ride order with id:${id} doesn't exist.`])];
      }

      await this.rideOrderRepository.delete(id);

      return [order, null];
    } catch (err) {
      return [null, new CustomError(400, 'Raw', 'Error', null, err)];
    }
  }
}

export { RideOrderService };