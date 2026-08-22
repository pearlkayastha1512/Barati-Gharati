import { PrismaClient, Role, VendorStatus, VendorBadge } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const mockVendors = [
  // ─── PHOTOGRAPHER CATEGORY (4 Vendors for Category Broadcast Testing) ───
  {
    email: 'blissphoto@weddingplanner.com',
    name: 'Aman Verma',
    phone: '9876543212',
    businessName: 'Bliss Photography',
    categoryName: 'Photographer',
    city: 'Delhi',
    badge: VendorBadge.GOLD,
    logoUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500',
    coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500',
    description: 'Capturing your precious wedding moments with cinematic storytelling and fine-art photography.',
    frontendVendorId: 2,
    packages: [
      { name: 'Full Wedding Coverage', price: 150000, description: 'Complete 2-day wedding & sangeet coverage with 4K video and luxury album.' },
      { name: 'Basic Shoot', price: 75000, description: '1-day event photography coverage.' },
    ],
  },
  {
    email: 'pixelperfect@weddingplanner.com',
    name: 'Rohan Malhotra',
    phone: '9876543221',
    businessName: 'Pixel Perfect Studios',
    categoryName: 'Photographer',
    city: 'Delhi',
    badge: VendorBadge.GOLD,
    logoUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500',
    coverImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500',
    description: 'Award-winning wedding photography duo specializing in candid moments and traditional cinematic films.',
    frontendVendorId: 10,
    packages: [
      { name: 'Full Wedding Coverage', price: 150000, description: 'Complete 2-day wedding & sangeet coverage with 4K video and luxury album.' },
      { name: 'Basic Shoot', price: 75000, description: '1-day event photography coverage.' },
    ],
  },
  {
    email: 'candidmoments@weddingplanner.com',
    name: 'Sneha Kapoor',
    phone: '9876543222',
    businessName: 'Candid Moments Films',
    categoryName: 'Photographer',
    city: 'Mumbai',
    badge: VendorBadge.SILVER,
    logoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
    description: 'Creative candid photography team crafting emotional, timeless memories for grand Indian weddings.',
    frontendVendorId: 11,
    packages: [
      { name: 'Full Wedding Coverage', price: 150000, description: 'Complete 2-day wedding & sangeet coverage with 4K video and luxury album.' },
      { name: 'Basic Shoot', price: 75000, description: '1-day event photography coverage.' },
    ],
  },
  {
    email: 'royallens@weddingplanner.com',
    name: 'Vikramaditya Singh',
    phone: '9876543223',
    businessName: 'Royal Lens Media',
    categoryName: 'Photographer',
    city: 'Jaipur',
    badge: VendorBadge.GOLD,
    logoUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500',
    description: 'Royal destination wedding photography and drone cinematography across Rajasthan and North India.',
    frontendVendorId: 12,
    packages: [
      { name: 'Full Wedding Coverage', price: 150000, description: 'Complete 2-day wedding & sangeet coverage with 4K video and luxury album.' },
      { name: 'Basic Shoot', price: 75000, description: '1-day event photography coverage.' },
    ],
  },

  // ─── DECORATOR CATEGORY (3 Vendors) ───
  {
    email: 'dreamdecor@weddingplanner.com',
    name: 'Priya Mehta',
    phone: '9876543213',
    businessName: 'Dream Decor Studio',
    categoryName: 'Decorator',
    city: 'Mumbai',
    badge: VendorBadge.GOLD,
    logoUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500',
    coverImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500',
    description: 'Transforming wedding spaces with exquisite floral arrangements, royal stage setups, and immersive lighting.',
    frontendVendorId: 3,
    packages: [
      { name: 'Stage & Mandap Decor', price: 120000, description: 'Royal stage flower setup and Mandap lighting.' },
      { name: 'Theme Wedding Setup', price: 250000, description: 'Complete venue theme transformation.' },
    ],
  },
  {
    email: 'grandfloral@weddingplanner.com',
    name: 'Karan Singhania',
    phone: '9876543224',
    businessName: 'Grand Floral Creations',
    categoryName: 'Decorator',
    city: 'Delhi',
    badge: VendorBadge.SILVER,
    logoUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500',
    coverImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500',
    description: 'Bespoke floral setups, entrance gates, and royal mandaps customized to your dream wedding theme.',
    frontendVendorId: 13,
    packages: [
      { name: 'Stage & Mandap Decor', price: 120000, description: 'Royal stage flower setup and Mandap lighting.' },
      { name: 'Theme Wedding Setup', price: 250000, description: 'Complete venue theme transformation.' },
    ],
  },
  {
    email: 'royalvows@weddingplanner.com',
    name: 'Ananya Roy',
    phone: '9876543225',
    businessName: 'Royal Vows Decorators',
    categoryName: 'Decorator',
    city: 'Jaipur',
    badge: VendorBadge.GOLD,
    logoUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500',
    description: 'Heritage theme decor, royal chandeliers, and regal mandaps for luxury weddings.',
    frontendVendorId: 14,
    packages: [
      { name: 'Stage & Mandap Decor', price: 120000, description: 'Royal stage flower setup and Mandap lighting.' },
      { name: 'Theme Wedding Setup', price: 250000, description: 'Complete venue theme transformation.' },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding Test Vendors for Category Broadcast & Alternative Vendor Selection...');

  const defaultPassword = await bcrypt.hash('Vendor@123456', 10);

  for (const item of mockVendors) {
    // 1. Category
    let category = await prisma.category.findFirst({
      where: { name: { contains: item.categoryName, mode: 'insensitive' } },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: item.categoryName, image: item.logoUrl },
      });
    }

    // 2. User
    const user = await prisma.user.upsert({
      where: { email: item.email },
      update: {
        role: Role.VENDOR,
        isVerified: true,
        adminVerificationStatus: 'APPROVED',
      },
      create: {
        name: item.name,
        email: item.email,
        phone: item.phone,
        password: defaultPassword,
        role: Role.VENDOR,
        isVerified: true,
        adminVerificationStatus: 'APPROVED',
      },
    });

    // 3. Vendor
    const vendor = await prisma.vendor.upsert({
      where: { userId: user.id },
      update: {
        businessName: item.businessName,
        city: item.city,
        description: item.description,
        status: VendorStatus.APPROVED,
        isActive: true,
        badge: item.badge,
        logoUrl: item.logoUrl,
        coverImage: item.coverImage,
        categoryId: category.id,
        frontendVendorId: item.frontendVendorId,
      },
      create: {
        userId: user.id,
        businessName: item.businessName,
        city: item.city,
        description: item.description,
        status: VendorStatus.APPROVED,
        isActive: true,
        badge: item.badge,
        logoUrl: item.logoUrl,
        coverImage: item.coverImage,
        categoryId: category.id,
        frontendVendorId: item.frontendVendorId,
      },
    });

    // 4. Lead Balance
    const cycleEnd = new Date();
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);

    await prisma.vendorLeadBalance.upsert({
      where: { vendorId: vendor.id },
      create: {
        vendorId: vendor.id,
        totalLeads: 50,
        usedLeads: 0,
        remainingLeads: 50,
        planType: item.badge,
        cycleStartAt: new Date(),
        cycleEndAt: cycleEnd,
      },
      update: {
        remainingLeads: 50,
      },
    });

    // 5. Packages
    for (const pkg of item.packages) {
      const existingPkg = await prisma.package.findFirst({
        where: { vendorId: vendor.id, title: pkg.name },
      });

      if (!existingPkg) {
        await prisma.package.create({
          data: {
            vendorId: vendor.id,
            categoryId: category.id,
            title: pkg.name,
            price: pkg.price,
            description: pkg.description,
          },
        });
      }
    }

    console.log(
      `✅ Seeded Vendor: ${vendor.businessName} (ID: ${vendor.frontendVendorId}, Category: ${category.name}, City: ${vendor.city})`
    );
  }

  console.log('\n🎉 Test Vendors Seeding Complete! Credentials for all vendors:');
  console.log('Password for all test vendors: Vendor@123456\n');
  for (const item of mockVendors) {
    console.log(`- ${item.businessName} [${item.categoryName}]: ${item.email}`);
  }
}

main()
  .catch((err) => {
    console.error('❌ Error seeding test vendors:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
