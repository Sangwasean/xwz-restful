//@ts-nocheck
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto, LoginDto } from '../types/custom.types';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/helpers';
import { comparePassword, hashPassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { UserRole } from '../types/enums';

const prisma = new PrismaClient();


class AuthService {
  async register(userData: CreateUserDto): Promise<User> {

    const { email, password, firstName, lastName, role } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    // Create user
    return prisma.user.create({
      data: {
        email,
        password: await hashedPassword,
        firstName,
        lastName,
        role: role || UserRole.USER,
      },
    });
  }

  async login(loginData: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check password
    const isPasswordValid = comparePassword(password,user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // 
    const token = generateToken({userId:user.id,role:user.role})

    // Remove password before returning
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

}

export default new AuthService();