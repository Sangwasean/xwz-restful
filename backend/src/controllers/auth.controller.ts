
import { Request, Response } from 'express';
import userService from '../services/user.service';
import { CreateUserDto, LoginDto } from '../types/custom.types';
import { BadRequestError } from '../utils/helpers';
import authService from '../services/auth.service';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const userData: CreateUserDto = req.body;
      const user = await authService.register(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginDto = req.body;
      const { user, token } = await authService.login(loginData);
      res.json({ user, token });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }
      //@ts-ignore
      const user = await userService.getUserById(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

}

export default new AuthController;