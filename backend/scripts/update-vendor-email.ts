import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('✏️ Updating Bliss Photography user email to pearl.gkp@gmail.com...');

  const vendor = await prisma.vendor.findFirst({
    where: { businessName: { contains: 'Bliss Photography', mode: 'insensitive' } },
    include: { user: true },
  });

  if (vendor && vendor.user) {
    await prisma.user.update({
      where: { id: vendor.userId },
      data: { email: 'pearl.gkp@gmail.com' },
    });
    console.log(`✅ Updated Bliss Photography user (${vendor.user.name}) email from ${vendor.user.email} -> pearl.gkp@gmail.com`);
  } else {
    console.log('⚠️ Bliss Photography vendor not found.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
