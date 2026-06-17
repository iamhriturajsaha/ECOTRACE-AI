/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { updateProfile, deleteAccount } from '../app/actions/settings';
import { getAndSeedChallenges, logChallengeProgress, repeatChallenge } from '../app/actions/challenges';
import { markRecommendationDone } from '../app/actions/recommendations';
import { createCommunityPost, likeCommunityPost } from '../app/actions/community';
import { getServerSession } from 'next-auth/next';
import { prisma } from '../lib/prisma';

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
    challenge: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      createMany: vi.fn(),
    },
    achievement: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    recommendation: {
      findUnique: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    communityPost: {
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    carbonProfile: {
      findUnique: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    carbonRecord: {
      deleteMany: vi.fn(),
    },
    activityLog: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock('../lib/xp', () => ({
  awardXP: vi.fn().mockResolvedValue({}),
}));

describe('Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Settings Actions', () => {
    it('should throw Unauthorized if no session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const formData = new FormData();
      formData.append('name', 'EcoChamp');

      await expect(updateProfile(formData)).rejects.toThrow('Unauthorized');
    });

    it('should throw if name contains HTML tags or script elements', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user_123' } });
      const formData = new FormData();
      formData.append('name', '<script>alert()</script>');

      await expect(updateProfile(formData)).rejects.toThrow('Name contains invalid characters');
    });

    it('should successfully update profile name if valid', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user_123' } });
      const formData = new FormData();
      formData.append('name', 'Eco Champion');

      const result = await updateProfile(formData);
      expect(result).toEqual({ success: true });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_123' },
        data: { name: 'Eco Champion' },
      });
    });
  });

  describe('Challenges Actions', () => {
    it('should seed default challenges if database is empty', async () => {
      vi.mocked(prisma.challenge.findMany).mockResolvedValue([]);
      
      await getAndSeedChallenges();
      expect(prisma.challenge.createMany).toHaveBeenCalled();
    });
  });

  describe('Recommendations Actions', () => {
    it('should complete recommendation and award XP', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user_123' } });
      const mockRec = { id: 'rec_1', userId: 'user_123', isCompleted: false, title: 'LED', impactScore: 10 };
      vi.mocked(prisma.recommendation.findUnique).mockResolvedValue(mockRec as any);

      await markRecommendationDone('rec_1');
      expect(prisma.recommendation.update).toHaveBeenCalledWith({
        where: { id: 'rec_1' },
        data: { isCompleted: true },
      });
      expect(prisma.activityLog.create).toHaveBeenCalled();
    });
  });

  describe('Community Actions', () => {
    it('should create a valid community post and sanitize tags', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user_123', name: 'Al' } });
      vi.mocked(prisma.communityPost.create).mockResolvedValue({ id: 'post_1' } as any);

      const result = await createCommunityPost('Checking the <b>Eco</b> rules!');
      expect(result.id).toBe('post_1');
      expect(prisma.communityPost.create).toHaveBeenCalledWith({
        data: {
          userId: 'user_123',
          content: 'Checking the &lt;b&gt;Eco&lt;/b&gt; rules!',
        },
      });
    });

    it('should update like count for a community post', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user_123' } });

      await likeCommunityPost('post_1');
      expect(prisma.communityPost.update).toHaveBeenCalledWith({
        where: { id: 'post_1' },
        data: { likes: { increment: 1 } },
      });
    });
  });
});
