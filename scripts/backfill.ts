import { prisma } from "../src/lib/prisma";

const extraCategories = [
  { category: "WASTE", amount: 40, description: "Household waste" },
  { category: "WATER", amount: 20, description: "Water consumption" },
  { category: "CLOTHING", amount: 35, description: "Apparel and textiles" },
  { category: "ELECTRONICS", amount: 25, description: "Gadgets and appliances" },
  { category: "SERVICES", amount: 45, description: "Healthcare, education, etc." },
  { category: "ENTERTAINMENT", amount: 15, description: "Recreation and media" },
];

async function backfill() {
  console.log('Backfilling missing categories for all users...');
  
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    const existingRecords = await prisma.carbonRecord.findMany({
      where: { userId: user.id }
    });
    
    const existingCategories = new Set(existingRecords.map(r => r.category));
    
    const missing = extraCategories.filter(c => !existingCategories.has(c.category));
    
    if (missing.length > 0) {
      await prisma.carbonRecord.createMany({
        data: missing.map(m => ({
          userId: user.id,
          category: m.category,
          amount: m.amount,
          description: m.description,
        }))
      });
      console.log(`Backfilled ${missing.length} categories for user ${user.id}`);
    }
  }
  
  console.log('✅ Backfill complete!');
}

backfill()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
