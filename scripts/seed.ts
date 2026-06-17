import { prisma } from "../src/lib/prisma";

const FAKE_USERS = [
  { name: "Elena Rodriguez", avatar: "E", xp: 14250, level: 42, score: 320 },
  { name: "Marcus Thorne", avatar: "M", xp: 12400, level: 39, score: 345 },
  { name: "Sarah Jenkins", avatar: "S", xp: 11100, level: 36, score: 380 },
  { name: "Alex Kumar", avatar: "A", xp: 9850, level: 34, score: 410 },
  { name: "David Lee", avatar: "D", xp: 8600, level: 31, score: 450 },
  { name: "Jessica Wu", avatar: "J", xp: 7100, level: 28, score: 490 },
  { name: "Michael Chen", avatar: "M", xp: 6400, level: 26, score: 520 },
  { name: "Emma Watson", avatar: "E", xp: 5800, level: 25, score: 550 },
  { name: "Oliver Smith", avatar: "O", xp: 4200, level: 21, score: 610 },
  { name: "Sophia Garcia", avatar: "S", xp: 3800, level: 20, score: 630 },
  { name: "James Wilson", avatar: "J", xp: 3100, level: 18, score: 680 },
  { name: "Isabella Martinez", avatar: "I", xp: 2800, level: 17, score: 710 },
  { name: "William Taylor", avatar: "W", xp: 2200, level: 15, score: 750 },
  { name: "Mia Anderson", avatar: "M", xp: 1800, level: 14, score: 780 },
  { name: "Lucas Thomas", avatar: "L", xp: 1500, level: 13, score: 810 },
  { name: "Charlotte Jackson", avatar: "C", xp: 1200, level: 11, score: 850 },
  { name: "Amelia White", avatar: "A", xp: 950, level: 9, score: 900 },
  { name: "Benjamin Harris", avatar: "B", xp: 700, level: 8, score: 950 },
  { name: "Ethan Martin", avatar: "E", xp: 450, level: 6, score: 1000 },
  { name: "Harper Thompson", avatar: "H", xp: 200, level: 4, score: 1100 }
];

async function seed() {
  console.log('Seeding fake users for leaderboard...');
  
  for (const fake of FAKE_USERS) {
    const email = `${fake.name.toLowerCase().replace(' ', '.')}@example.com`;
    
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: fake.name,
          email: email,
          image: null,
        }
      });
      
      // Create their carbon profile
      await prisma.carbonProfile.create({
        data: {
          userId: user.id,
          transportationHabit: "Mixed",
          dietPreference: "Mixed",
          electricityConsumption: 300,
          travelFrequency: "1-2 flights",
          shoppingBehavior: "Average",
          wasteManagement: "Average",
          homeHeatingType: "Electricity",
          renewableEnergyUsage: "No",
          waterUsage: "Average",
          totalCarbonScore: fake.score,
          level: fake.level,
          xp: fake.xp,
        }
      });
      console.log(`Seeded user: ${fake.name} with ${fake.xp} XP`);
    } else {
      console.log(`User ${fake.name} already exists. Skipping.`);
    }
  }
  
  console.log('✅ Seeding complete!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
