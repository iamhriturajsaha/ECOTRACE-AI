"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sanitizeHtml } from "@/lib/sanitize";

/** Zod schema for validating display name updates. */
const profileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s.\-_]+$/, "Name contains invalid characters")
});

/**
 * Updates the authenticated user's display name.
 * Validates input via Zod, sanitizes against XSS, and persists to the database.
 *
 * @param formData - Form data containing a `name` field
 * @returns An object indicating success
 * @throws {Error} If the user is unauthenticated or validation fails
 */
export async function updateProfile(formData: FormData): Promise<{ success: boolean }> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const rawName = formData.get("name") as string;
  const validated = profileSchema.safeParse({ name: rawName });

  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  const sanitizedName = sanitizeHtml(validated.data.name.trim());

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: sanitizedName }
  });

  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/settings");

  return { success: true };
}

/**
 * Permanently deletes the authenticated user's account and all associated data.
 * Uses a database transaction to ensure atomicity of the cascading delete.
 *
 * @returns An object indicating success
 * @throws {Error} If the user is unauthenticated
 */
export async function deleteAccount(): Promise<{ success: boolean }> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Use a transaction for atomic cascading deletes
  await prisma.$transaction([
    prisma.activityLog.deleteMany({ where: { userId } }),
    prisma.achievement.deleteMany({ where: { userId } }),
    prisma.communityPost.deleteMany({ where: { userId } }),
    prisma.recommendation.deleteMany({ where: { userId } }),
    prisma.carbonRecord.deleteMany({ where: { userId } }),
    prisma.carbonProfile.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return { success: true };
}
