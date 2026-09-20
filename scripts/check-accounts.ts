import { prisma } from "../src/lib/prisma";

async function checkAccounts() {
  const accounts = await prisma.account.findMany();
  console.log("All Account records:", JSON.stringify(accounts, null, 2));
  
  const users = await prisma.user.findMany({ 
    where: { email: "iamhriturajsaha@gmail.com" },
    include: { accounts: true }
  });
  console.log("\nUser with email iamhriturajsaha@gmail.com:", JSON.stringify(users, null, 2));
}

checkAccounts()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); });
