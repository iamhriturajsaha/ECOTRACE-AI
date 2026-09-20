import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCarbonFootprint } from "@/services/ai-calculator";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Call AI or heuristic calculator
    const result = await calculateCarbonFootprint(data);

    // Save profile to database
    const profile = await prisma.carbonProfile.create({
      data: {
        userId: session.user.id,
        transportationHabit: data.transportationHabit,
        dietPreference: data.dietPreference,
        electricityConsumption: data.electricityConsumption,
        travelFrequency: data.travelFrequency,
        shoppingBehavior: data.shoppingBehavior,
        wasteManagement: data.wasteManagement,
        homeHeatingType: data.homeHeatingType,
        renewableEnergyUsage: data.renewableEnergyUsage,
        waterUsage: data.waterUsage,
        totalCarbonScore: result.score,
      },
    });

    // Save breakdown as records
    await prisma.carbonRecord.createMany({
      data: result.breakdown.map((b) => ({
        userId: session.user.id,
        category: b.category as string,
        amount: b.amount,
        description: b.description,
      })),
    });

    // Save recommendations
    await prisma.recommendation.createMany({
      data: result.recommendations.map((r) => ({
        userId: session.user.id,
        title: r.title,
        description: r.description,
        impactScore: r.impactScore,
      })),
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
