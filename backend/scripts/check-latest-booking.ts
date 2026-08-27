import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking latest bookings in database...');
  const latestBookings = await prisma.booking.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      vendor: { include: { user: true } },
      user: true,
      vendorAssignments: { include: { vendor: { include: { user: true } } } },
    },
  });

  for (const b of latestBookings) {
    console.log(`\n📌 Booking ID: ${b.id} | BookingNumber: ${b.bookingNumber} | Status: ${b.status} | CreatedAt: ${b.createdAt.toISOString()}`);
    console.log(`   Primary Vendor: ${b.vendor?.businessName} (Email: ${b.vendor?.user?.email})`);
    console.log(`   Customer: ${b.user?.name} (Email: ${b.user?.email})`);
    console.log(`   Vendor Assignments Count: ${b.vendorAssignments.length}`);
    for (const a of b.vendorAssignments) {
      console.log(`     - Vendor: ${a.vendor?.businessName} | Role: ${a.role} | Status: ${a.status} | Email: ${a.vendor?.user?.email}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
