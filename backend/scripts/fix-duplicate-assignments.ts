import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up duplicate primary/standby assignments in database...');

  const bookings = await prisma.booking.findMany({
    include: { vendorAssignments: true },
  });

  for (const b of bookings) {
    // Find primary vendor ID
    const primaryVendorId = b.vendorId;

    // Remove any STANDBY assignment that matches primaryVendorId
    const duplicates = b.vendorAssignments.filter(
      (a) => a.vendorId === primaryVendorId && a.role === 'STANDBY',
    );

    if (duplicates.length > 0) {
      console.log(`Deleting ${duplicates.length} duplicate standby assignment(s) for booking ${b.bookingNumber}...`);
      await prisma.bookingVendorAssignment.deleteMany({
        where: {
          id: { in: duplicates.map((d) => d.id) },
        },
      });
    }
  }

  console.log('✅ Cleanup completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
