import { borrowRequestSchema, updateBorrowRequestSchema } from '../types/schemas';
import { prisma } from '../lib/prisma';

export class BorrowService {
  static async createBorrowRequest(userId: string, data: any) {
    const validatedData = borrowRequestSchema.parse(data);

    return prisma.borrowRequest.create({
      data: {
        ...validatedData,
        requesterId: userId,
      },
    });
  }

  static async getBorrowRequests(filters: any = {}) {
    const { status, page = 1, limit = 10 } = filters;

    const where: any = { isDeleted: false };

    if (status) {
      where.status = status;
    }

    const requests = await prisma.borrowRequest.findMany({
      where,
      include: { requester: { select: { name: true, email: true, phoneNumber: true, hostel: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.borrowRequest.count({ where });

    return { requests, total, page, limit };
  }

  static async getBorrowRequestById(id: string) {
    const request = await prisma.borrowRequest.findUnique({
      where: { id, isDeleted: false },
      include: { requester: { select: { name: true, email: true, phoneNumber: true, hostel: true } } },
    });

    if (!request) {
      throw new Error('Borrow request not found');
    }

    return request;
  }

  static async updateBorrowRequest(id: string, userId: string, data: any) {
    const validatedData = updateBorrowRequestSchema.parse(data);

    const request = await prisma.borrowRequest.findUnique({
      where: { id },
    });

    if (!request || request.requesterId !== userId) {
      throw new Error('Borrow request not found or unauthorized');
    }

    return prisma.borrowRequest.update({
      where: { id },
      data: validatedData,
    });
  }

  static async deleteBorrowRequest(id: string, userId: string) {
    const request = await prisma.borrowRequest.findUnique({
      where: { id },
    });

    if (!request || request.requesterId !== userId) {
      throw new Error('Borrow request not found or unauthorized');
    }

    await prisma.borrowRequest.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  static async getUserBorrowRequests(userId: string) {
    return prisma.borrowRequest.findMany({
      where: { requesterId: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async respondToBorrowRequest(id: string, sellerId: string, response: string) {
    // This could be extended to create a response record or notification
    // For now, just mark as fulfilled if accepted
    if (response === 'accept') {
      await prisma.borrowRequest.update({
        where: { id },
        data: { status: 'FULFILLED' },
      });
    }
    return { message: 'Response recorded' };
  }
}