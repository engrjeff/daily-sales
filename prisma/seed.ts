import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // seed categories
  // const categories = await prisma.category.createMany({
  //   data: [
  //     'Women Clothes',
  //     'Men Clothes',
  //     'Beauty',
  //     'Health',
  //     'Fashion Accessories',
  //     'Home & Living',
  //     'Men Shoes',
  //     'Women Shoes',
  //     'Men Bags',
  //     'Women Bags',
  //     'Watches',
  //     'Electronics Parts & Components',
  //     'Computers & Accessories',
  //     'Drinks',
  //     'Bread & Pastries',
  //     'Sports & Outdoors',
  //     'Stationery',
  //     'Bookes & Magazines',
  //     'Automobile Parts & Accessories',
  //     'Motorcycle Parts & Accessories',
  //     'Pets',
  //     'Baby & Kids',
  //     'Travel & Luggage',
  //   ].map((category) => ({
  //     name: category,
  //   })),
  // });
  // console.log(`Successfully seeded ${categories.count} categories`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }

    await prisma.$disconnect();
    process.exit(1);
  });
