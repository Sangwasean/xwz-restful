
import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestError } from '../utils/helpers';


export const validationMiddleware = <T extends object>(type: ClassConstructor<T>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const convertedObject = plainToInstance(type, req.body);
    const errors = await validate(convertedObject);

    if (errors.length > 0) {
      const message = errors
        .map((error) => {
          if (error.constraints) {
            return `${error.property}: ${Object.values(error.constraints).join(', ')}`;
          }
          if (error.children?.length) {
            return `${error.property}: ${error.children
              .map(child => Object.values(child.constraints || {}).join(', '))
              .join('; ')}`;
          }
          return `Validation failed for ${error.property}`;
        })
        .join('; ');
      
      next(new BadRequestError(message));
      return;
    }

    req.body = convertedObject;
    next();
  };
};