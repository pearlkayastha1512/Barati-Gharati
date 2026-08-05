import { PrismaClient, Role, AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const categories = [
  { name: 'Venue', image: 'https://example.com/venue.jpg' },
  { name: 'Photographer', image: 'https://example.com/photographer.jpg' },
  { name: 'Videographer', image: 'https://example.com/videographer.jpg' },
  { name: 'Decorator', image: 'https://example.com/decorator.jpg' },
  { name: 'Makeup Artist', image: 'https://example.com/makeup.jpg' },
  { name: 'Mehendi Artist', image: 'https://example.com/mehendi.jpg' },
  { name: 'Caterer', image: 'https://example.com/caterer.jpg' },
  { name: 'Cake Designer', image: 'https://example.com/cake.jpg' },
  { name: 'DJ', image: 'https://example.com/dj.jpg' },
  { name: 'Live Band', image: 'https://example.com/live-band.jpg' },
  { name: 'Entertainment', image: 'https://example.com/entertainment.jpg' },
  { name: 'Wedding Planner', image: 'https://example.com/planner.jpg' },
  { name: 'Transportation', image: 'https://example.com/transportation.jpg' },
  { name: 'Accommodation', image: 'https://example.com/accommodation.jpg' },
  { name: 'Invitation Designer', image: 'https://example.com/invitations.jpg' },
  { name: 'Bridal Wear', image: 'https://example.com/bridal-wear.jpg' },
  { name: 'Groom Wear', image: 'https://example.com/groom-wear.jpg' },
  { name: 'Jewellery', image: 'https://example.com/jewellery.jpg' },
  { name: 'Florist', image: 'https://example.com/florist.jpg' },
  { name: 'Pandit / Priest', image: 'https://example.com/priest.jpg' },
  { name: 'Event Planner', image: 'https://example.com/event-planner.jpg' },
  { name: 'Birthday Planner', image: 'https://example.com/birthday-planner.jpg' },
  { name: 'Kids Party Planner', image: 'https://example.com/kids-party.jpg' },
  { name: 'Balloon Decorator', image: 'https://example.com/balloons.jpg' },
  { name: 'Theme Decorator', image: 'https://example.com/theme-decorator.jpg' },
  { name: 'Kids Entertainer', image: 'https://example.com/kids-entertainer.jpg' },
  { name: 'Magician', image: 'https://example.com/magician.jpg' },
  { name: 'Anchor / Emcee', image: 'https://example.com/emcee.jpg' },
  { name: 'Choreographer', image: 'https://example.com/choreographer.jpg' },
  { name: 'Party Supplies', image: 'https://example.com/party-supplies.jpg' },
  { name: 'Return Gifts', image: 'https://example.com/return-gifts.jpg' },
  { name: 'Gift Hampers', image: 'https://example.com/gift-hampers.jpg' },
  { name: 'Sound and Lighting', image: 'https://example.com/sound-lighting.jpg' },
  { name: 'Photo Booth', image: 'https://example.com/photo-booth.jpg' },
  { name: 'Event Security', image: 'https://example.com/event-security.jpg' },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
  console.log('✅ Categories seeded!');

  // Seed default Super Admin
  const adminEmail = process.env.INITIAL_SUPER_ADMIN_EMAIL || 'admin@weddingplanner.com';
  const adminPassword = process.env.INITIAL_SUPER_ADMIN_PASSWORD || 'Admin@123456';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      adminRole: AdminRole.SUPER_ADMIN,
      adminIsActive: true,
      isVerified: true,
    },
    create: {
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      adminRole: AdminRole.SUPER_ADMIN,
      adminIsActive: true,
      isVerified: true,
    },
  });

  console.log(`✅ Super Admin seeded! (${adminEmail})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
