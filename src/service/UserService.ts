import { getRepository } from 'typeorm';

import { Role, Language } from '../orm/entities/users/types';
import { User } from '../orm/entities/users/User';
import { CustomError } from '../utils/response/custom-error/CustomError';

class UserService {
  private userRepository = getRepository(User);

  async create(
    email: string,
    password: string,
    username: string,
    name: string,
    role: Role,
    language: Language,
  ): Promise<[User | null, CustomError | null]> {
    let result: User | null = null;

    try {
      const user_exists = await this.userRepository.findOne({ where: { email } });

      if (user_exists) {
        return [null, new CustomError(400, 'General', 'Exists', [`User exists.`])];
      }

      const user = new User();
      user.email = email;
      user.password = password;
      user.username = username || null;
      user.name = name || null;
      user.role = role || 'STANDARD';
      user.language = language || 'en-US';

      user.hashPassword();

      await this.userRepository.save(user);

      result = user;
    } catch (err) {
      return [null, new CustomError(500, 'Raw', 'Error', null, err)];
    }

    return [result, null];
  }

  async list(): Promise<[User[] | null, CustomError | null]> {
    try {
      const users = await this.userRepository.find({
        relations: ['car', 'orders_as_driver', 'orders_as_client'],
      });
      return [users, null];
    } catch (err) {
      return [null, new CustomError(400, 'Raw', `Can't retrieve list of users.`, null, err)];
    }
  }

  async show(id: number | string): Promise<[User | null, CustomError | null]> {
    try {
      const user = await this.userRepository.findOne(id, {
        relations: ['car', 'orders_as_driver', 'orders_as_client'],
      });

      if (!user) {
        return [null, new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.'])];
      }

      return [user, null];
    } catch (err) {
      return [null, new CustomError(400, 'Raw', 'Error', null, err)];
    }
  }

  async edit(id: number | string, username?: string, name?: string): Promise<[User | null, CustomError | null]> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return [null, new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.'])];
      }

      user.username = username;
      user.name = name;

      try {
        await this.userRepository.save(user);
        return [user, null];
      } catch (err) {
        return [null, new CustomError(409, 'Raw', `User '${user.email}' can't be saved.`, null, err)];
      }
    } catch (err) {
      return [null, new CustomError(400, 'Raw', 'Error', null, err)];
    }
  }

  async destroy(id: number | string): Promise<[User | null, CustomError | null]> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return [null, new CustomError(404, 'General', 'Not Found', [`User with id:${id} doesn't exists.`])];
      }

      await this.userRepository.delete(id);

      return [user, null];
    } catch (err) {
      return [null, new CustomError(400, 'Raw', 'Error', null, err)];
    }
  }
}

export { UserService };
