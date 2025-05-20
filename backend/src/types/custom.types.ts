// types/custom.types.ts
import { IsInt, IsNotEmpty, IsDateString, IsString, IsEnum, IsOptional } from "class-validator";

import { UserRole } from "./enums";

export class CreateTicketDto {
   @IsString()
   @IsNotEmpty()
   parkingId: string;

   @IsString()
   @IsNotEmpty()
   vehicleId: string;

   @IsDateString()
   @IsOptional()
   @IsNotEmpty()
   startTime: string;
}

export class ExtendTicketDto {
   @IsString()
   @IsNotEmpty()
   ticketId: string;

   @IsInt()
   @IsNotEmpty()
   additionalHours: number;
}


export type CreateParkingDto = {
   location: string;
   name: string;
   isAvailable?: boolean;
   fee : number;
};

export class CreateUserDto {
   @IsNotEmpty()
   email: string;

   @IsNotEmpty()
   password: string;

   @IsNotEmpty()
   firstName: string;

   @IsNotEmpty()
   lastName: string;

   @IsOptional()
   @IsEnum(UserRole)
   role?: UserRole;
}

export class LoginDto {
   @IsNotEmpty()
   email: string;

   @IsNotEmpty()
   password: string;
}

export interface AuthRequest extends Request {
   user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
   };
}
