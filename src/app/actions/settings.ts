"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  
  if (!name || name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  // Update user model
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() }
  });

  // Revalidate to update the dropdown instantly
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/settings");

  return { success: true };
}

export async function deleteAccount() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Due to SQLite foreign key limitations in some setups, we'll manually delete cascaded records first
  await prisma.activityLog.deleteMany({ where: { userId } });
  await prisma.achievement.deleteMany({ where: { userId } });
  await prisma.recommendation.deleteMany({ where: { userId } });
  await prisma.carbonRecord.deleteMany({ where: { userId } });
  await prisma.carbonProfile.deleteMany({ where: { userId } });
  
  // Finally delete the user
  await prisma.user.delete({ where: { id: userId } });

  return { success: true };
}
