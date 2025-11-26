import { Car } from '../orm/entities/cars/Car';
import { RideOrder } from '../orm/entities/ride_orders/RideOrder';
import { Order_status, Payment_type } from '../orm/entities/ride_orders/types'
import { UserResponseDTO } from '../dto/user_response_dto';
import { Car_class, Car_status } from '../orm/entities/cars/types';

export class RideOrderResponseDTO {
  order_status: Order_status;
  payment_type: Payment_type;
  start_date: Date;
  end_date: Date | null;
  driver: UserResponseDTO | null;
  client: UserResponseDTO | null;


  constructor(rideOrder: RideOrder) {
    this.start_date = rideOrder.start_date;
    this.end_date = rideOrder.end_date ? new Date(rideOrder.end_date) : null;
    this.driver = rideOrder.driver ? new UserResponseDTO(rideOrder.driver) : null;
    this.client = rideOrder.client ? new UserResponseDTO(rideOrder.client) : null;
  }
}