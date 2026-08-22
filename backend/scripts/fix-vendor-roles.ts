import { PrismaClient, VendorAssignmentRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing existing BookingVendorAssignment roles & primary vendor in database...');

  const bookings = await prisma.booking.findMany({
    include: {
      vendorAssignments: {
        orderBy: { priority: 'asc' },
      },
    },
  });

  for (const booking of bookings) {
    if (!booking.vendorAssignments || booking.vendorAssignments.length === 0) continue;

    // Check if any vendor accepted
    const acceptedAssignment = booking.vendorAssignments.find((a) => a.status === 'ACCEPTED');

    // The primary vendor is either the one who ACCEPTED, or the priority 1 vendor (initially requested)
    const primaryVendorId = acceptedAssignment ? acceptedAssignment.vendorId : (booking.vendorAssignments[0]?.vendorId ?? booking.vendorId);

    // Update booking.vendorId if needed
    if (booking.vendorId !== primaryVendorId) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { vendorId: primaryVendorId },
      });
      console.log(`Updated booking ${booking.bookingNumber} main vendorId -> ${primaryVendorId}`);
    }

    for (const assignment of booking.vendorAssignments) {
      const isPrimary = assignment.vendorId === primaryVendorId;
      const correctRole = isPrimary ? VendorAssignmentRole.PRIMARY : VendorAssignmentRole.STANDBY;

      if (assignment.role !== correctRole) {
        await prisma.bookingVendorAssignment.update({
          where: { id: assignment.id },
          data: { role: correctRole },
        });
        console.log(`Updated assignment ${assignment.id} (${booking.bookingNumber}): vendor ${assignment.vendorId} -> ${correctRole}`);
      }
    }
  }

  console.log('✅ DB Cleanup complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
