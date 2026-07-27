import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const products = [
  // — your originals —
  {
    name: 'Matcha Donuts',
    slug: 'matcha-donuts',
    description:
      'Baked vanilla donuts glazed with earthy matcha and white chocolate.',
    priceCents: 1400,
    stock: 10,
    spriteKey: 'donut',
    spriteSwap: { p: '#bfe06e', P: '#5db272' },
    flavor: 'Matcha',
    tag: 'bestseller',
    category: 'pastry',
  },
  {
    name: 'Fudgy Chocolate Brownies',
    slug: 'fudgy-chocolate-brownies',
    description: 'Dense, fudgy brownies with a crackly top.',
    priceCents: 1000,
    stock: 10,
    spriteKey: 'dorayaki',
    spriteSwap: { b: '#8a5a3c', B: '#5e3b24' },
    flavor: 'Chocolate',
    tag: null,
    category: 'pastry',
  },
  {
    name: 'Strawberry Shortcakes',
    slug: 'strawberry-shortcakes',
    description:
      'Fluffy vanilla sponge cakes layered with fresh strawberries and whipped cream.',
    priceCents: 1200,
    stock: 12,
    spriteKey: 'cupcake',
    spriteSwap: { p: '#ffc9d8', P: '#ff6f6f' },
    flavor: 'Strawberry',
    tag: 'new',
    category: 'pastry',
  },

  // — mochi —
  {
    name: 'Ichigo Daifuku',
    slug: 'ichigo-daifuku',
    description:
      'Pillowy mochi hugging a whole sweet strawberry and red bean paste.',
    priceCents: 450,
    stock: 24,
    spriteKey: 'mochi',
    spriteSwap: { w: '#ffd9e6', p: '#ff6f6f' },
    flavor: 'Strawberry',
    tag: 'bestseller',
    category: 'mochi',
  },
  {
    name: 'Matcha Mochi',
    slug: 'matcha-mochi',
    description:
      'Stone-ground matcha folded into chewy mochi. Earthy, not too sweet.',
    priceCents: 400,
    stock: 20,
    spriteKey: 'mochi',
    spriteSwap: { w: '#dff0b8', p: '#5db272' },
    flavor: 'Matcha',
    tag: 'new',
    category: 'mochi',
  },
  {
    name: 'Ramune Mochi',
    slug: 'ramune-mochi',
    description: 'Fizzy-blue ramune flavor in a cloud of soft rice cake.',
    priceCents: 400,
    stock: 18,
    spriteKey: 'mochi',
    spriteSwap: { w: '#d6efff', p: '#4ea7e0' },
    flavor: 'Soda',
    tag: null,
    category: 'mochi',
  },
  {
    name: 'Lavender Mochi',
    slug: 'lavender-mochi',
    description: 'Floral lavender-honey mochi. Calm in a bite-sized cloud.',
    priceCents: 400,
    stock: 16,
    spriteKey: 'mochi',
    spriteSwap: { w: '#e7defb', p: '#a48cf0' },
    flavor: 'Lavender',
    tag: null,
    category: 'mochi',
  },
  {
    name: 'Hanami Dango',
    slug: 'hanami-dango',
    description:
      'Three chewy rice dumplings on a skewer — pink, white & matcha.',
    priceCents: 375,
    stock: 14,
    spriteKey: 'dango',
    spriteSwap: Prisma.DbNull,
    flavor: 'Trio',
    tag: 'new',
    category: 'mochi',
  },

  // — pancake —
  {
    name: 'Classic Dorayaki',
    slug: 'classic-dorayaki',
    description:
      'Honey pancakes pressed around a generous scoop of azuki bean.',
    priceCents: 350,
    stock: 22,
    spriteKey: 'dorayaki',
    spriteSwap: Prisma.DbNull,
    flavor: 'Red Bean',
    tag: 'bestseller',
    category: 'pancake',
  },
  {
    name: 'Custard Taiyaki',
    slug: 'custard-taiyaki',
    description: 'Crispy fish-shaped waffle filled with warm vanilla custard.',
    priceCents: 300,
    stock: 20,
    spriteKey: 'taiyaki',
    spriteSwap: Prisma.DbNull,
    flavor: 'Custard',
    tag: null,
    category: 'pancake',
  },

  // — pastry —
  {
    name: 'Sakura Donut',
    slug: 'sakura-donut',
    description:
      'Fluffy ring donut under a blossom-pink glaze with rainbow sprinkles.',
    priceCents: 325,
    stock: 18,
    spriteKey: 'donut',
    spriteSwap: Prisma.DbNull,
    flavor: 'Sakura',
    tag: null,
    category: 'pastry',
  },
  {
    name: 'Peach Macaron',
    slug: 'peach-macaron',
    description: 'Crisp-then-chewy almond shells with silky peach ganache.',
    priceCents: 275,
    stock: 26,
    spriteKey: 'macaron',
    spriteSwap: Prisma.DbNull,
    flavor: 'Peach',
    tag: null,
    category: 'pastry',
  },
  {
    name: 'Matcha Macaron',
    slug: 'matcha-macaron',
    description: 'Delicate matcha shells with white-chocolate matcha filling.',
    priceCents: 275,
    stock: 26,
    spriteKey: 'macaron',
    spriteSwap: { p: '#bfe06e', P: '#5db272', e: '#dff0b8' },
    flavor: 'Matcha',
    tag: null,
    category: 'pastry',
  },
  {
    name: 'Berry Cupcake',
    slug: 'berry-cupcake',
    description:
      'Vanilla sponge crowned with a swirl of strawberry buttercream.',
    priceCents: 425,
    stock: 15,
    spriteKey: 'cupcake',
    spriteSwap: Prisma.DbNull,
    flavor: 'Strawberry',
    tag: 'bestseller',
    category: 'pastry',
  },
  {
    name: 'Ramune Cupcake',
    slug: 'ramune-cupcake',
    description: 'Cotton-soft cake topped with sky-blue ramune frosting.',
    priceCents: 425,
    stock: 15,
    spriteKey: 'cupcake',
    spriteSwap: { p: '#8fd0f5', P: '#4ea7e0' },
    flavor: 'Soda',
    tag: null,
    category: 'pastry',
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

  const slugs = products.map((p) => p.slug);
  const { count } = await prisma.product.deleteMany({
    where: { slug: { notIn: slugs } },
  });

  console.log(
    `✅ Seeded ${products.length} products${count ? `, pruned ${count} stale` : ''}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
