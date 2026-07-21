/**
 * Seed script: Initialize VendorLeadBalance for all existing approved vendors
 * that don't yet have a lead balance record.
 *
 * Lead allocation by badge plan:
 *   BRONZE → 10 leads/month
 *   SILVER → 25 leads/month
 *   GOLD   → 50 leads/month
 *
 * Run: npx ts-node prisma/seed-lead-balances.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LEAD_ALLOCATIONS: Record<string, number> = {
  BRONZE: 10,
  SILVER: 25,
  GOLD: 50,
};

async function main() {
  console.log('🌱 Seeding VendorLeadBalance for existing vendors...');

  // Fetch all approved vendors without a lead balance
  const vendors = await prisma.vendor.findMany({
    where: {
      leadBalance: null, // no balance row yet
    },
    select: {
      id: true,
      businessName: true,
      badge: true,
    },
  });

  console.log(`  Found ${vendors.length} vendor(s) without lead balance.`);

  const cycleStart = new Date();
  const cycleEnd = new Date();
  cycleEnd.setMonth(cycleEnd.getMonth() + 1);

  let created = 0;

  for (const vendor of vendors) {
    const badge = (vendor.badge ?? 'BRONZE').toUpperCase();
    const totalLeads = LEAD_ALLOCATIONS[badge] ?? LEAD_ALLOCATIONS.BRONZE;

    try {
      await prisma.vendorLeadBalance.create({
        data: {
          vendorId: vendor.id,
          totalLeads,
          usedLeads: 0,
          remainingLeads: totalLeads,
          planType: badge,
          cycleStartAt: cycleStart,
          cycleEndAt: cycleEnd,
        },
      });
      created++;
      console.log(
        `  ✅ ${vendor.businessName} — badge=${badge}, leads=${totalLeads}`,
      );
    } catch (err: any) {
      if (err?.code === 'P2002') {
        // Already exists (race condition), skip
        console.log(`  ⏭️  ${vendor.businessName} — already has a balance`);
      } else {
        console.error(`  ❌ ${vendor.businessName} — error: ${err?.message}`);
      }
    }
  }

  console.log(`\n✅ Done. Created ${created} lead balance record(s).`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
