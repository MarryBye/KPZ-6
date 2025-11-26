import { User } from '../orm/entities/users/User';

export class UserResponseDTO {
  id: number;
  email: string;
  username?: string | null;
  name?: string | null;
  role?: string;
  language?: string;
  created_at?: Date;
  updated_at?: Date;
  car?: { id: number; mark: string; model: string } | null;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name ?? null;
    this.role = user.role ?? null;
    this.username = user.username ?? null;
    this.language = (user.language as any) ?? undefined;
    if (user.car !== null && user.car !== undefined) {
      this.car = { id: user.car.id, mark: user.car.mark, model: user.car.model };
    }
  }
};