const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories and products...');

  // 1. SOUVENIRS / TOYS
  let souvenirsCategory = await prisma.category.findFirst({
    where: { title: 'SOUVENIRS / TOYS' }
  });

  if (!souvenirsCategory) {
    souvenirsCategory = await prisma.category.create({
      data: { title: 'SOUVENIRS / TOYS' }
    });
    console.log('Created SOUVENIRS / TOYS category.');
  }

  // 2. SNACKS
  let snacksCategory = await prisma.category.findFirst({
    where: { title: 'SNACKS' }
  });

  if (!snacksCategory) {
    snacksCategory = await prisma.category.create({
      data: { title: 'SNACKS' }
    });
    console.log('Created SNACKS category.');
  }

  // 3. Add 3-4 blank products to SOUVENIRS / TOYS
  for (let i = 1; i <= 4; i++) {
    await prisma.product.create({
      data: {
        title: `Mock Souvenir Item ${i}`,
        description: 'A beautiful souvenir for tourists.',
        price: 15.99 + i,
        stock: 50,
        images: [],
        categories: {
          connect: { id: souvenirsCategory.id }
        }
      }
    });
  }
  console.log('Added mock products to SOUVENIRS / TOYS.');

  // 4. Add mock items to SNACKS to test pagination limits
  for (let i = 1; i <= 15; i++) {
    await prisma.product.create({
      data: {
        title: `Mock Snack Item ${i}`,
        description: 'Delicious snack for pagination testing.',
        price: 5.99 + (i * 0.5),
        stock: 100,
        images: [],
        categories: {
          connect: { id: snacksCategory.id }
        }
      }
    });
  }
  console.log('Added mock products to SNACKS.');

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
