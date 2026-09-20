import { prisma } from "./prisma";

/**
 * Calculates the required XP to reach the next level.
 * Simple formula: level * 100
 */
export function getRequiredXpForNextLevel(currentLevel: number): number {
  return currentLevel * 100;
}

/**
 * Awards XP to a user, checking if they should level up.
 * Returns the updated profile.
 */
export async function awardXP(userId: string, amount: number) {
  // First, get the current profile
  const profile = await prisma.carbonProfile.findUnique({
    where: { userId },
  });

  if (!profile) throw new Error("Profile not found");

  let newXp = profile.xp + amount;
  let newLevel = profile.level;
  let requiredXp = getRequiredXpForNextLevel(newLevel);

  // Check for level ups (handle multiple levels if they earned a lot of XP)
  while (newXp >= requiredXp) {
    newXp -= requiredXp;
    newLevel += 1;
    requiredXp = getRequiredXpForNextLevel(newLevel);
  }

  // Update the profile
  const updatedProfile = await prisma.carbonProfile.update({
    where: { userId },
    data: {
      xp: newXp,
      level: newLevel,
    },
  });

  return updatedProfile;
}
