import { PrismaClient, Role, AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@weddingplanner.com';
  const password = args[1] || 'Admin@123456';
  const name = args[2] || 'Super Admin';

  console.log(`Creating/updating Super Admin account for: ${email}...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: {
        role: Role.ADMIN,
        adminRole: AdminRole.SUPER_ADMIN,
        adminIsActive: true,
        isVerified: true,
        password: hashedPassword,
      },
    });
    console.log(`✅ User "${updated.email}" has been updated to SUPER_ADMIN with new password!`);
  } else {
    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.ADMIN,
        adminRole: AdminRole.SUPER_ADMIN,
        adminIsActive: true,
        isVerified: true,
      },
    });
    console.log(`✅ Super Admin created successfully!`);
    console.log(`   Email: ${created.email}`);
    console.log(`   Role: ADMIN (${created.adminRole})`);
  }
}

main()
  .catch((err) => {
    console.error('❌ Error creating Super Admin:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
