import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const email = process.argv[2];
if (!email) {
  console.error('usage: tsx prisma/promote-admin.ts <email>');
  process.exit(1);
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const user = await db.user.update({
    where: { email: email.toLowerCase() },
    data: { role: 'admin' },
  });
  console.log(`✅ ${user.email} is now admin`);
}

main()
  .catch((e) => {
    console.error(e?.message ?? e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
