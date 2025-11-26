import { Request, Response, NextFunction } from 'express';

import { UserService } from 'service/UserService';
import { UserResponseDTO } from '../../dto/user_response_dto';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const userService = new UserService();

  const [user, error] = await userService.show(id);

  if (error) {
    return next(error);
  }

  const userDTO = new UserResponseDTO(user);

  res.customSuccess(200, 'User found', userDTO);
};