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
    this.username = user.username ?? null;
    this.name = user.name ?? null;
    this.role = (user.role as any) ?? undefined;
    this.language = (user.language as any) ?? undefined;
    this.created_at = user.created_at ?? undefined;
    this.updated_at = user.updated_at ?? undefined;
    if (user.car) {
      this.car = { id: user.car.id, mark: user.car.mark, model: user.car.model };
    }
  }
};