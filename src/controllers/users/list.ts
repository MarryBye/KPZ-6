import { Request, Response, NextFunction } from 'express';

import { UserService } from 'service/UserService';
import { UserResponseDTO } from '../../dto/user_response_dto';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const userService = new UserService();

  const [users, error] = await userService.list();

  if (error) {
    return next(error);
  }

  const userDTOs = users.map(user => new UserResponseDTO(user));

  res.customSuccess(200, 'List of users.', userDTOs);
};