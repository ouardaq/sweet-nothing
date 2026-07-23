import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const products = [
  {
    name: 'Strawberry Shortcakes',
    slug: 'strawberry-shortcakes',
    description:
      'Fluffy vanilla sponge cakes layered with fresh strawberries and whipped cream.',
    priceCents: 1200,
    stock: 12,
    imageUrl: null,
  },
  {
    name: 'Fudgy Chocolate Brownies',
    slug: 'fudgy-chocolate-brownies',
    description:
      'Rich, gooey chocolate brownies with a crackly top and a soft centre.',
    priceCents: 1000,
    stock: 16,
    imageUrl: null,
  },
  {
    name: 'Matcha Donuts',
    slug: 'matcha-donuts',
    description:
      'Baked vanilla donuts glazed with earthy matcha and white chocolate.',
    priceCents: 1400,
    stock: 10,
    imageUrl: null,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`✅ Seeded ${products.length} products`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
