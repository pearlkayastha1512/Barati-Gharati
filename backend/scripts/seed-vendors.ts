import { PrismaClient, Role, VendorStatus, VendorBadge } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const mockVendors = [
  {
    email: 'royalpalace@weddingplanner.com',
    name: 'Rajesh Sharma',
    phone: '9876543211',
    businessName: 'Royal Palace Jaipur',
    categoryName: 'Venue',
    city: 'Jaipur',
    price: 250000,
    badge: VendorBadge.GOLD,
    logoUrl: '/vendors/vendor2.jpg',
    coverImage: '/vendors/vendor2.jpg',
    description: "Royal Palace Jaipur is one of Rajasthan's most luxurious wedding venues, offering breathtaking architecture, royal hospitality, and world-class event management for unforgettable celebrations.",
    frontendVendorId: 1,
    packages: [
      { name: 'Silver Package', price: 250000 },
      { name: 'Gold Package', price: 400000 },
      { name: 'Royal Package', price: 650000 },
    ],
  },
  {
    email: 'blissphoto@weddingplanner.com',
    name: 'Aman Verma',
    phone: '9876543212',
    businessName: 'Bliss Photography',
    categoryName: 'Photographer',
    city: 'Delhi',
    price: 75000,
    badge: VendorBadge.SILVER,
    logoUrl: '/vendors/vendor1.jpg',
    coverImage: '/vendors/vendor1.jpg',
    description: 'Capturing your precious wedding moments with cinematic storytelling and fine-art photography.',
    frontendVendorId: 2,
    packages: [
      { name: 'Basic Shoot', price: 75000 },
      { name: 'Full Wedding Coverage', price: 150000 },
    ],
  },
  {
    email: 'dreamdecor@weddingplanner.com',
    name: 'Priya Mehta',
    phone: '9876543213',
    businessName: 'Dream Decor Studio',
    categoryName: 'Decorator',
    city: 'Mumbai',
    price: 120000,
    badge: VendorBadge.GOLD,
    logoUrl: '/vendors/vendor3.jpg',
    coverImage: '/vendors/vendor3.jpg',
    description: 'Transforming wedding spaces with exquisite floral arrangements, royal stage setups, and immersive lighting.',
    frontendVendorId: 3,
    packages: [
      { name: 'Stage & Mandap Decor', price: 120000 },
      { name: 'Theme Wedding Setup', price: 250000 },
    ],
  },
  {
    email: 'flavorscatering@weddingplanner.com',
    name: 'Sanjeev Kapoor',
    phone: '9876543214',
    businessName: 'Flavors Catering',
    categoryName: 'Caterer',
    city: 'Bengaluru',
    price: 180000,
    badge: VendorBadge.BRONZE,
    logoUrl: '/vendors/vendor4.jpg',
    coverImage: '/vendors/vendor4.jpg',
    description: 'Exquisite multi-cuisine wedding catering service featuring live counters, gourmet desserts, and royal dining.',
    frontendVendorId: 4,
    packages: [
      { name: 'Standard Buffet Menu', price: 180000 },
      { name: 'Royal Multi-Catering', price: 350000 },
    ],
  },
  {
    email: 'glamourmakeup@weddingplanner.com',
    name: 'Kavita Singh',
    phone: '9876543215',
    businessName: 'Glamour Makeup Studio',
    categoryName: 'Makeup Artist',
    city: 'Mumbai',
    price: 35000,
    badge: VendorBadge.SILVER,
    logoUrl: '/vendors/vendor5.jpg',
    coverImage: '/vendors/vendor5.jpg',
    description: 'HD & Airbrush Bridal Makeup by celebrity artists. Look radiant on your special day.',
    frontendVendorId: 5,
    packages: [
      { name: 'Bridal HD Makeup', price: 35000 },
      { name: 'Airbrush Luxury Package', price: 60000 },
    ],
  },
  {
    email: 'soundwave@weddingplanner.com',
    name: 'DJ Rohit',
    phone: '9876543216',
    businessName: 'SoundWave DJ & Entertainment',
    categoryName: 'DJ',
    city: 'Delhi',
    price: 50000,
    badge: VendorBadge.GOLD,
    logoUrl: '/vendors/vendor1.jpg',
    coverImage: '/vendors/vendor1.jpg',
    description: 'High-energy DJ setups, concert sound, intelligent moving lighting, and LED walls for Sangeet & Reception.',
    frontendVendorId: 6,
    packages: [
      { name: 'Sangeet DJ Setup', price: 50000 },
      { name: 'Mega Concert Rig', price: 100000 },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding Dynamic Vendors into PostgreSQL Database...');

  const defaultPassword = await bcrypt.hash('Vendor@123456', 10);

  for (const item of mockVendors) {
    // 1. Find or create category
    let category = await prisma.category.findFirst({
      where: { name: { contains: item.categoryName, mode: 'insensitive' } },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: item.categoryName, image: item.logoUrl },
      });
    }

    // 2. Create User account
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

    // 3. Create or Update Vendor Profile
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

    // 4. Create Packages if none exist
    const existingPackages = await prisma.package.findMany({
      where: { vendorId: vendor.id },
    });

    if (existingPackages.length === 0 && item.packages) {
      for (const pkg of item.packages) {
        await prisma.package.create({
          data: {
            vendorId: vendor.id,
            categoryId: category.id,
            title: pkg.name,
            price: pkg.price,
            description: `Includes full service package for ${pkg.name}`,
          },
        });
      }
    }

    console.log(`✅ Seeded Vendor: ${vendor.businessName} (Category: ${category.name}, City: ${vendor.city})`);
  }

  console.log('🎉 Dynamic Vendor seeding complete!');
}

main()
  .catch((err) => {
    console.error('❌ Error seeding vendors:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
