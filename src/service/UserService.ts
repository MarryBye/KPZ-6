import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../orm/entities/users/User';
import { Role, Language } from '../orm/entities/users/types';
import { CustomError } from '../utils/response/custom-error/CustomError';

class ProductService {
  private userRepository = getRepository(User);

  async create(
    email: string,
    password: string,
    username: string,
    name: string,
    role: Role,
    language: Language,
  ): Promise<[User, CustomError]> {
    let result: User = null;
    let message: CustomError = null;

    try {
      const user_exists = await userRepository.findOne({ where: { email } });

      if (user_exists) {
        message = new CustomError(400, 'General', 'Exists', [`User exists.`]);
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
      message = new CustomError(400, 'Raw', 'Error', null, err);
    }

    return [result, message];
  }

  async findOne(id: string): Promise<User> {
    return user;
  }

  async findAll(): Promise<Promise<User>[]> {
    return user;
  }

  async update(): Promise<User> {
    return user;
  }

  async delete(): Promise<User> {
    return user;
  }
}

export { ProductService };