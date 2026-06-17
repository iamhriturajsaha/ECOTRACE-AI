"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sanitizeHtml } from "@/lib/sanitize";

/** Maximum number of posts returned per feed request. */
const FEED_PAGE_SIZE = 50;

/** Zod schema for validating community post content. */
const postSchema = z.string()
  .min(1, "Post content cannot be empty")
  .max(280, "Post content cannot exceed 280 characters");

/** Zod schema for validating post ID parameters. */
const postIdSchema = z.string().min(1, "Post ID is required");

/**
 * Retrieves the most recent community posts with user information.
 * Results are limited to {@link FEED_PAGE_SIZE} entries, ordered newest-first.
 *
 * @returns Array of community posts with associated user name and image
 */
export async function getCommunityPosts() {
  return await prisma.communityPost.findMany({
    take: FEED_PAGE_SIZE,
    select: {
      id: true,
      content: true,
      likes: true,
      createdAt: true,
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

/**
 * Creates a new community post for the authenticated user.
 * Content is validated with Zod and sanitized to prevent XSS.
 *
 * @param content - The raw text content of the post (max 280 characters)
 * @returns The newly created post record
 * @throws {Error} If unauthenticated or content fails validation
 */
export async function createCommunityPost(content: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const validated = postSchema.safeParse(content);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  const sanitizedContent = sanitizeHtml(validated.data.trim());

  const post = await prisma.communityPost.create({
    data: {
      userId: session.user.id,
      content: sanitizedContent,
    },
  });

  revalidatePath("/dashboard/community");
  return post;
}

/**
 * Increments the like count on a community post by 1.
 *
 * @param postId - The ID of the post to like
 * @returns The updated post record
 * @throws {Error} If unauthenticated or postId is invalid
 */
export async function likeCommunityPost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const validatedId = postIdSchema.safeParse(postId);
  if (!validatedId.success) {
    throw new Error("Invalid post ID");
  }

  const post = await prisma.communityPost.update({
    where: { id: validatedId.data },
    data: {
      likes: {
        increment: 1,
      },
    },
  });

  revalidatePath("/dashboard/community");
  return post;
}
