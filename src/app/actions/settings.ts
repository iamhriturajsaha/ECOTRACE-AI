"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { z } from "zod";

const profileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s.\-_]+$/, "Name contains invalid characters")
});

function sanitizeInput(val: string): string {
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const rawName = formData.get("name") as string;
  const validated = profileSchema.safeParse({ name: rawName });

  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  const sanitizedName = sanitizeInput(validated.data.name.trim());

  // Update user model
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: sanitizedName }
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
