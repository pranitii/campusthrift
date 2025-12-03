import { nightMarketPostSchema, updateNightMarketPostSchema } from '../types/schemas';
import { prisma } from '../lib/prisma';

export class NightMarketService {
  static async createNightMarketPost(userId: string, data: any) {
    const validatedData = nightMarketPostSchema.parse(data);

    return prisma.nightMarketPost.create({
      data: {
        ...validatedData,
        sellerId: userId,
      },
    });
  }

  static async getNightMarketPosts() {
    const posts = await prisma.nightMarketPost.findMany({
      where: { isDeleted: false, isAvailable: true },
      include: { seller: { select: { name: true, phoneNumber: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Group by hostel
    const grouped = posts.reduce((acc: any, post: any) => {
      if (!acc[post.hostel]) {
        acc[post.hostel] = [];
      }
      acc[post.hostel].push(post);
      return acc;
    }, {});

    return grouped;
  }

  static async getNightMarketPostById(id: string) {
    const post = await prisma.nightMarketPost.findUnique({
      where: { id, isDeleted: false },
      include: { seller: { select: { name: true, email: true, phoneNumber: true } } },
    });

    if (!post) {
      throw new Error('Night market post not found');
    }

    return post;
  }

  static async updateNightMarketPost(id: string, userId: string, data: any) {
    const validatedData = updateNightMarketPostSchema.parse(data);

    const post = await prisma.nightMarketPost.findUnique({
      where: { id },
    });

    if (!post || post.sellerId !== userId) {
      throw new Error('Night market post not found or unauthorized');
    }

    return prisma.nightMarketPost.update({
      where: { id },
      data: validatedData,
    });
  }

  static async deleteNightMarketPost(id: string, userId: string) {
    const post = await prisma.nightMarketPost.findUnique({
      where: { id },
    });

    if (!post || post.sellerId !== userId) {
      throw new Error('Night market post not found or unauthorized');
    }

    await prisma.nightMarketPost.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  static async getUserNightMarketPosts(userId: string) {
    return prisma.nightMarketPost.findMany({
      where: { sellerId: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }
}