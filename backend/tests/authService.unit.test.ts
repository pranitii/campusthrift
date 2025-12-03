// Unit tests for AuthService using mocks (no DB access)
jest.mock('../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock('../src/middleware/auth', () => ({
  generateTokens: jest.fn(() => ({ accessToken: 'mock-access', refreshToken: 'mock-refresh' })),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(async (p: string) => `hashed-${p}`),
  compare: jest.fn(async (a: string, b: string) => a === b || b.startsWith('hashed-')),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

import { AuthService } from '../src/services/authService';
import { prisma } from '../src/lib/prisma';

describe('AuthService (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user when email does not exist', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const createdUser = { id: 'u1', email: 'u1@example.com', password: 'hashed-password' };
    (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await AuthService.register({ email: 'u1@example.com', password: 'secret123' });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'u1@example.com' } });
    expect(prisma.user.create).toHaveBeenCalled();
    expect(result.user).toEqual(createdUser);
    expect(result.accessToken).toBe('mock-access');
    expect(result.refreshToken).toBe('mock-refresh');
  });

  it('throws when registering with existing email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', email: 'u1@example.com' });

    await expect(AuthService.register({ email: 'u1@example.com', password: 'secret123' })).rejects.toThrow(
      'User already exists'
    );
  });

  it('logs in successfully with correct credentials', async () => {
    // Return a user record with a hashed password
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u2', email: 'u2@example.com', password: 'hashed-secret123' });

    const result = await AuthService.login({ email: 'u2@example.com', password: 'secret123' });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'u2@example.com' } });
    expect(result.user.email).toBe('u2@example.com');
    expect(result.accessToken).toBe('mock-access');
  });

  it('throws on login with invalid credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Use a valid-length password so schema validation passes and service checks credentials
    await expect(AuthService.login({ email: 'noone@example.com', password: 'password123' })).rejects.toThrow(
      'Invalid credentials'
    );
  });

  it('refreshes tokens with valid refresh token', async () => {
    const jwt = require('jsonwebtoken');
    (jwt.verify as jest.Mock).mockReturnValue({ userId: 'u1' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', email: 'u1@example.com' });

    const tokens = await AuthService.refreshToken('valid.refresh.token');

    expect(jwt.verify).toHaveBeenCalled();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'u1' } });
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });

  it('throws on refreshToken with invalid token', async () => {
    const jwt = require('jsonwebtoken');
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid'); });

    await expect(AuthService.refreshToken('bad.token')).rejects.toThrow('Invalid refresh token');
  });

  it('updates user profile', async () => {
    const updated = { id: 'u5', name: 'Updated' };
    (prisma.user.update as jest.Mock).mockResolvedValue(updated);

    const result = await AuthService.updateUser('u5', { name: 'Updated' });

    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 'u5' }, data: { name: 'Updated' } });
    expect(result).toEqual(updated);
  });

  it('gets user by id and throws when not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u6', email: 'u6@example.com', isDeleted: false });
    const user = await AuthService.getUserById('u6');
    expect(user.id).toBe('u6');

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(AuthService.getUserById('missing')).rejects.toThrow('User not found');

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u7', isDeleted: true });
    await expect(AuthService.getUserById('u7')).rejects.toThrow('User not found');
  });

  it('gets all users and deletes user (soft)', async () => {
    (prisma.user.findMany as any) = jest.fn().mockResolvedValue([{ id: 'a' }, { id: 'b' }]);
    const all = await AuthService.getAllUsers();
    expect(all.length).toBe(2);

    (prisma.user.update as jest.Mock).mockResolvedValue({});
    await AuthService.deleteUser('a');
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 'a' }, data: { isDeleted: true } });
  });
});
