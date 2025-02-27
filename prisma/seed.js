const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { category_name: "Work" },
    { category_name: "School" },
    { category_name: "Personal" },
    { category_name: "Health" },
    { category_name: "Finance" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { category_name: category.category_name },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
