import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking vendor user emails in database...');
  const vendors = await prisma.vendor.findMany({
    include: {
      user: { select: { id: true, email: true, name: true } },
      category: { select: { name: true } },
    },
  });

  for (const v of vendors) {
    console.log(`- ${v.businessName} [Category: ${v.category?.name}]: User Email = "${v.user?.email}"`);
  }

  console.log('\n📜 Recent Email Logs in DB:');
  const logs = await prisma.emailLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  for (const log of logs) {
    console.log(`[${log.createdAt.toISOString()}] To: ${log.to} | Subject: "${log.subject}" | Status: ${log.status}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
