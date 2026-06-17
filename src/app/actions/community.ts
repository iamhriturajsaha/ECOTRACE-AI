"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const postSchema = z.string()
  .min(1, "Post content cannot be empty")
  .max(280, "Post content cannot exceed 280 characters");

function sanitizeInput(val: string): string {
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function getCommunityPosts() {
  return await prisma.communityPost.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createCommunityPost(content: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // Input Validation
  const validated = postSchema.safeParse(content);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  // Sanitization to prevent XSS
  const sanitizedContent = sanitizeInput(validated.data.trim());

  const post = await prisma.communityPost.create({
    data: {
      userId: session.user.id,
      content: sanitizedContent,
    },
  });

  revalidatePath("/dashboard/community");
  return post;
}

export async function likeCommunityPost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.communityPost.update({
    where: { id: postId },
    data: {
      likes: {
        increment: 1,
      },
    },
  });

  revalidatePath("/dashboard/community");
  return post;
}
