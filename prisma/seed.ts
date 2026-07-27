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
    spriteKey: 'cupcake',
    spriteSwap: { p: '#ffc9d8', P: '#ff6f6f' },
    flavor: 'strawberry',
    tag: 'new',
    category: 'cakes',
  },
  {
    name: 'Fudgy Chocolate Brownies',
    slug: 'fudgy-chocolate-brownies',
    description:
      'Rich, gooey chocolate brownies with a crackly top and a soft centre.',
    priceCents: 1000,
    stock: 16,
    imageUrl: null,
    spriteKey: 'dorayaki',
    spriteSwap: { b: '#8a5a3c', B: '#5e3b24' },
    flavor: 'redbean',
    tag: null,
    category: 'cakes',
  },
  {
    name: 'Matcha Donuts',
    slug: 'matcha-donuts',
    description:
      'Baked vanilla donuts glazed with earthy matcha and white chocolate.',
    priceCents: 1400,
    stock: 10,
    imageUrl: null,
    spriteKey: 'donut',
    spriteSwap: { p: '#bfe06e', P: '#5db272' },
    flavor: 'matcha',
    tag: 'bestseller',
    category: 'donuts',
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
