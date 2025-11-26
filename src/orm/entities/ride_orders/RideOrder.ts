import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../users/User';

import { Order_status, Payment_type } from './types';

@Entity('ride_orders')
export class RideOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 'In Progress' as Order_status,
    length: 32,
  })
  order_status: Order_status;

  @Column({
    default: 'Credit Card' as Payment_type,
    length: 32,
  })
  payment_type: Payment_type;

  @ManyToOne(() => User)
  @JoinColumn()
  driver: User;

  @ManyToOne(() => User)
  @JoinColumn()
  client: User;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;
}
