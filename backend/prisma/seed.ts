import { prisma } from '../src/lib/prisma';
import * as bcrypt from 'bcryptjs';

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@campus.com' },
    update: {},
    create: {
      email: 'admin@campus.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      campus: 'Main Campus',
      hostel: 'Admin Block',
      phoneNumber: '1234567890',
    },
  });

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'student1@campus.com' },
    update: {},
    create: {
      email: 'student1@campus.com',
      password: await bcrypt.hash('password123', 12),
      name: 'John Doe',
      role: 'STUDENT',
      campus: 'Main Campus',
      hostel: 'Hostel A',
      phoneNumber: '9876543210',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'student2@campus.com' },
    update: {},
    create: {
      email: 'student2@campus.com',
      password: await bcrypt.hash('password123', 12),
      name: 'Jane Smith',
      role: 'STUDENT',
      campus: 'Main Campus',
      hostel: 'Hostel B',
      phoneNumber: '8765432109',
    },
  });

  // Create sample listings
  await prisma.listing.createMany({
    data: [
      {
        title: 'Used Laptop',
        description: 'Good condition laptop for sale',
        category: 'Electronics',
        price: 25000,
        condition: 'Good',
        negotiable: true,
        imageUrls: ['https://example.com/laptop.jpg'],
        sellerId: user1.id,
      },
      {
        title: 'Calculus Textbook',
        description: 'Slightly used textbook',
        category: 'Books',
        price: 500,
        condition: 'Very Good',
        negotiable: false,
        imageUrls: ['https://example.com/book.jpg'],
        sellerId: user2.id,
      },
    ],
  });

  // Create sample borrow requests
  await prisma.borrowRequest.createMany({
    data: [
      {
        itemName: 'Projector',
        reason: 'For presentation',
        budgetRange: '₹1000-2000',
        neededFor: '2 days',
        requesterId: user1.id,
      },
    ],
  });

  // Create sample night market posts
  await prisma.nightMarketPost.createMany({
    data: [
      {
        item: 'Pizza',
        price: 150,
        quantity: 10,
        hostel: 'Hostel A',
        sellerId: user1.id,
      },
      {
        item: 'Burger',
        price: 100,
        quantity: 5,
        hostel: 'Hostel B',
        sellerId: user2.id,
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });