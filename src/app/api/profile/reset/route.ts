import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete existing profile, records, and recommendations
    // Because of onDelete: Cascade on the foreign keys in the schema (if applicable), 
    // or we can explicitly delete them to be safe.
    
    await prisma.carbonRecord.deleteMany({
      where: { userId },
    });

    await prisma.recommendation.deleteMany({
      where: { userId },
    });

    await prisma.carbonProfile.delete({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile reset error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
