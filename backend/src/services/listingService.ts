import { listingSchema, updateListingSchema, searchListingsSchema } from '../types/schemas';
import { generateQRCode } from '../utils/qrCode';
import { prisma } from '../lib/prisma';

export class ListingService {
  static async createListing(userId: string, data: any, baseUrl: string) {
    const validatedData = listingSchema.parse(data);

    const listing = await prisma.listing.create({
      data: {
        ...validatedData,
        sellerId: userId,
      },
    });

    // Generate QR code for listing URL
    const listingUrl = `${baseUrl}/listings/${listing.id}`;
    const qrUrl = await generateQRCode(listingUrl);

    const updatedListing = await prisma.listing.update({
      where: { id: listing.id },
      data: { qrUrl },
    });

    return updatedListing;
  }

  static async getListings(filters: any) {
    const { query, category, minPrice, maxPrice, hostel, sortBy, page, limit } = searchListingsSchema.parse(filters);

    const where: any = { isDeleted: false };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    if (hostel) {
      where.seller = { hostel };
    }

    const orderBy: any = {};
    if (sortBy === 'price_asc') {
      orderBy.price = 'asc';
    } else if (sortBy === 'price_desc') {
      orderBy.price = 'desc';
    } else {
      // Default to newest
      orderBy.createdAt = 'desc';
    }

    const listings = await prisma.listing.findMany({
      where,
      include: { seller: { select: { name: true, hostel: true } } },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.listing.count({ where });

    return { listings, total, page, limit };
  }

  static async getListingById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id, isDeleted: false },
      include: { seller: { select: { name: true, email: true, phoneNumber: true, hostel: true } } },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    return listing;
  }

  static async updateListing(id: string, userId: string, data: any) {
    const validatedData = updateListingSchema.parse(data);

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing || listing.sellerId !== userId) {
      throw new Error('Listing not found or unauthorized');
    }

    return prisma.listing.update({
      where: { id },
      data: validatedData,
    });
  }

  static async deleteListing(id: string, userId: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing || listing.sellerId !== userId) {
      throw new Error('Listing not found or unauthorized');
    }

    await prisma.listing.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  static async getUserListings(userId: string) {
    return prisma.listing.findMany({
      where: { sellerId: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }
}