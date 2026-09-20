"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/lib/xp";
import { revalidatePath } from "next/cache";

export async function markRecommendationDone(recommendationId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // Verify the recommendation belongs to the user and isn't already completed
  const rec = await prisma.recommendation.findUnique({
    where: { id: recommendationId },
  });

  if (!rec || rec.userId !== session.user.id || rec.isCompleted) {
    throw new Error("Invalid recommendation");
  }

  // Mark as completed
  await prisma.recommendation.update({
    where: { id: recommendationId },
    data: { isCompleted: true },
  });

  // Award XP based on impact score (e.g. 10 kg CO2e saved = 50 XP)
  // Let's just use the impactScore directly or multiplied.
  const xpReward = Math.max(Math.round(rec.impactScore * 2), 10);
  await awardXP(session.user.id, xpReward);

  // Add activity log
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: `Completed AI Insight: ${rec.title} (+${xpReward} XP)`,
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/recommendations");
}

export async function generateMoreInsights() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const GENERIC_INSIGHTS = [
    { title: "Switch to a Bamboo Toothbrush", description: "Save plastic waste by using compostable toothbrushes.", impactScore: 2 },
    { title: "Use a Smart Thermostat", description: "Optimize your home heating and cooling automatically.", impactScore: 40 },
    { title: "Fix Leaky Faucets", description: "A dripping faucet can waste thousands of gallons a year.", impactScore: 10 },
    { title: "Switch to LED Bulbs", description: "LEDs use 75% less energy and last 25 times longer.", impactScore: 25 },
    { title: "Start Composting", description: "Turn your food scraps into nutrient-rich soil.", impactScore: 15 },
    { title: "Opt for Paperless Billing", description: "Reduce paper waste and the carbon footprint of mail delivery.", impactScore: 5 },
    { title: "Wash Clothes in Cold Water", description: "90% of the energy used by washing machines goes to heating water.", impactScore: 20 },
    { title: "Air Dry Your Clothes", description: "Ditch the dryer and let the sun do the work to save electricity.", impactScore: 30 },
  ];

  // Pick 3 random insights
  const shuffled = GENERIC_INSIGHTS.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  await prisma.recommendation.createMany({
    data: selected.map(insight => ({
      userId: session.user.id,
      title: insight.title,
      description: insight.description,
      impactScore: insight.impactScore,
      isCompleted: false
    }))
  });

  revalidatePath("/dashboard/recommendations");
}
