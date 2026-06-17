/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getRequiredXpForNextLevel, awardXP } from '../lib/xp';
import { prisma } from '../lib/prisma';

vi.mock('../lib/prisma', () => ({
  prisma: {
    carbonProfile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('XP Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate correct required XP', () => {
    expect(getRequiredXpForNextLevel(1)).toBe(100);
    expect(getRequiredXpForNextLevel(2)).toBe(200);
  });

  it('should award XP and level up if threshold is crossed', async () => {
    const mockProfile = { userId: '123', xp: 50, level: 1 };
    vi.mocked(prisma.carbonProfile.findUnique).mockResolvedValue(mockProfile as any);
    vi.mocked(prisma.carbonProfile.update).mockImplementation(async ({ data }: any) => ({
      userId: '123',
      xp: data.xp,
      level: data.level,
    }) as any);

    const result = await awardXP('123', 80);
    expect(result.level).toBe(2);
    expect(result.xp).toBe(30); // 50 + 80 = 130. level up requires 100. 130 - 100 = 30.
  });

  it('should support multiple level ups', async () => {
    const mockProfile = { userId: '123', xp: 10, level: 1 };
    vi.mocked(prisma.carbonProfile.findUnique).mockResolvedValue(mockProfile as any);
    vi.mocked(prisma.carbonProfile.update).mockImplementation(async ({ data }: any) => ({
      userId: '123',
      xp: data.xp,
      level: data.level,
    }) as any);

    // level 1 needs 100 XP to level up. level 2 needs 200 XP.
    // Total XP earned = 350.
    // 10 + 350 = 360.
    // level 1: 360 >= 100 -> level up to 2. remaining XP = 260.
    // level 2: 260 >= 200 -> level up to 3. remaining XP = 60.
    const result = await awardXP('123', 350);
    expect(result.level).toBe(3);
    expect(result.xp).toBe(60);
  });
});
