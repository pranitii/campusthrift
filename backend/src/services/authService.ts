import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateTokens } from '../middleware/auth';
import { userSchema, loginSchema, updateUserSchema } from '../types/schemas';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';

export class AuthService {
  static async register(data: any) {
    const validatedData = userSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = validatedData.password
      ? await bcrypt.hash(validatedData.password, 12)
      : null;

    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
    });

    const tokens = generateTokens(user.id);
    return { user, ...tokens };
  }

  static async login(data: any) {
    const { email, password } = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const tokens = generateTokens(user.id);
    return { user, ...tokens };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      const tokens = generateTokens(user.id);
      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async updateUser(userId: string, data: any) {
    const validatedData = updateUserSchema.parse(data);

    const user = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
    });

    return user;
  }

  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.isDeleted) {
      throw new Error('User not found');
    }

    return user;
  }

  static async getAllUsers() {
    return prisma.user.findMany({
      where: { isDeleted: false },
    });
  }

  static async deleteUser(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });
  }
}