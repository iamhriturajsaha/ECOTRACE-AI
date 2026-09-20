"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/lib/xp";
import { revalidatePath } from "next/cache";

const DEFAULT_CHALLENGES = [
  { title: "Plastic-Free Week", description: "Avoid single-use plastics for 7 consecutive days. Use reusable bags, bottles, and containers.", rewardXp: 500, durationDays: 7 },
  { title: "Bike to Work", description: "Replace 3 car commutes with biking or public transit this month.", rewardXp: 800, durationDays: 3 },
  { title: "Meatless Mondays", description: "Complete 4 consecutive Meatless Mondays.", rewardXp: 300, durationDays: 4 },
  { title: "Zero-Waste Grocery Run", description: "Complete a grocery shopping trip completely package-free using your own jars and bags.", rewardXp: 400, durationDays: 1 },
  { title: "Cold Wash Month", description: "Wash all your laundry on the cold setting for 4 consecutive weeks.", rewardXp: 600, durationDays: 4 },
  { title: "Phantom Power Purge", description: "Unplug 5 unused electronics or use a smart power strip to eliminate phantom loads.", rewardXp: 200, durationDays: 1 },
  { title: "Second-hand September", description: "Buy zero new clothing items for a full month; shop only thrift or second-hand.", rewardXp: 1000, durationDays: 30 },
  { title: "Thrifty Traveler", description: "Take a vacation or weekend trip using only trains, buses, or carpooling instead of flying.", rewardXp: 1500, durationDays: 1 },
  { title: "Compost Champion", description: "Successfully compost your organic waste for 14 consecutive days.", rewardXp: 750, durationDays: 14 },
  { title: "LED Upgrade", description: "Replace at least 5 old incandescent bulbs in your house with energy-efficient LEDs.", rewardXp: 250, durationDays: 1 }
];

export async function getAndSeedChallenges() {
  let challenges = await prisma.challenge.findMany();
  
  const existingTitles = new Set(challenges.map((c) => c.title));
  const newChallenges = DEFAULT_CHALLENGES.filter((c) => !existingTitles.has(c.title));

  if (newChallenges.length > 0) {
    await prisma.challenge.createMany({
      data: newChallenges,
    });
    challenges = await prisma.challenge.findMany();
  }
  
  return challenges;
}

export async function logChallengeProgress(challengeId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId }
  });

  if (!challenge) throw new Error("Challenge not found");

  // Find or create achievement
  let achievement = await prisma.achievement.findFirst({
    where: { userId: session.user.id, challengeId: challengeId }
  });

  if (!achievement) {
    achievement = await prisma.achievement.create({
      data: {
        userId: session.user.id,
        challengeId: challengeId,
        progress: 1,
        isCompleted: 1 >= challenge.durationDays,
        completedAt: 1 >= challenge.durationDays ? new Date() : null,
      }
    });
  } else if (!achievement.isCompleted) {
    const newProgress = achievement.progress + 1;
    const isCompleted = newProgress >= challenge.durationDays;
    
    achievement = await prisma.achievement.update({
      where: { id: achievement.id },
      data: {
        progress: newProgress,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      }
    });
  }

  // If newly completed, award XP
  if (achievement.isCompleted && achievement.progress === challenge.durationDays) {
    await awardXP(session.user.id, challenge.rewardXp);
    
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: `Completed Challenge: ${challenge.title} (+${challenge.rewardXp} XP)`,
      }
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/challenges");
}

export async function repeatChallenge(challengeId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const achievement = await prisma.achievement.findFirst({
    where: { userId: session.user.id, challengeId: challengeId }
  });

  if (achievement && achievement.isCompleted) {
    await prisma.achievement.update({
      where: { id: achievement.id },
      data: {
        progress: 0,
        isCompleted: false,
        completedAt: null
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/challenges");
  }
}
