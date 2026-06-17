import { prisma } from "../src/lib/prisma";

async function fixAccounts() {
  const credentialsUser = await prisma.user.findUnique({
    where: { email: "iamhriturajsaha@gmail.com" }
  });

  if (!credentialsUser) {
    console.log("No credentials user found!");
    return;
  }

  console.log("Credentials user ID:", credentialsUser.id);

  // Find any Google account records NOT linked to the credentials user
  const googleAccounts = await prisma.account.findMany({
    where: { provider: "google" }
  });

  console.log("Google account records found:", googleAccounts.length);

  for (const account of googleAccounts) {
    if (account.userId !== credentialsUser.id) {
      console.log(`Reassigning Google account ${account.id} from user ${account.userId} to ${credentialsUser.id}`);
      
      // Delete the old orphan user if they have no other purpose
      const oldUser = await prisma.user.findUnique({ 
        where: { id: account.userId },
        include: { carbonProfile: true }
      });

      // Reassign the Google Account to the Credentials user
      await prisma.account.update({
        where: { id: account.id },
        data: { userId: credentialsUser.id }
      });

      // Clean up the orphan Google-only user if it has no profile
      if (oldUser && !oldUser.carbonProfile) {
        console.log(`Deleting orphan user ${oldUser.id} (${oldUser.email || 'no email'})`);
        await prisma.user.delete({ where: { id: oldUser.id } });
      }
    }
  }

  // Verify
  const finalUser = await prisma.user.findUnique({
    where: { email: "iamhriturajsaha@gmail.com" },
    include: { accounts: true }
  });
  console.log("\n✅ Final state:");
  console.log("User:", finalUser?.id, finalUser?.name);
  console.log("Linked accounts:", finalUser?.accounts.map(a => `${a.provider} (${a.providerAccountId})`));
}

fixAccounts()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); });
