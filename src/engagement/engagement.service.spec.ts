import { NotFoundException } from "@nestjs/common";
import { describe, expect, it, jest } from "@jest/globals";

import { PrismaService } from "@/prisma/prisma.service";

import { EngagementService } from "./engagement.service";

type MockFn = ReturnType<typeof jest.fn>;

function mockResolvedValue(mock: MockFn, value: unknown): MockFn {
  return mock.mockResolvedValue(value);
}

const now = new Date("2026-01-03T00:00:00.000Z");

const post = {
  id: "post_1",
  slug: "the-myth-of-clean-code",
  clapCount: 10,
  shareCount: 3,
};

type MockPrisma = {
  post: { findUnique: MockFn; update: MockFn };
  clap: { findUnique: MockFn; upsert: MockFn; findMany: MockFn };
  share: { create: MockFn; findMany: MockFn };
  $transaction: MockFn;
};

function makeService(): { service: EngagementService; prisma: MockPrisma } {
  const prisma: MockPrisma = {
    post: {
      findUnique: mockResolvedValue(jest.fn(), post),
      update: mockResolvedValue(jest.fn(), post),
    },
    clap: {
      findUnique: mockResolvedValue(jest.fn(), null),
      upsert: mockResolvedValue(jest.fn(), null),
      findMany: mockResolvedValue(jest.fn(), []),
    },
    share: {
      create: mockResolvedValue(jest.fn(), null),
      findMany: mockResolvedValue(jest.fn(), []),
    },
    $transaction: jest.fn(async (arg: unknown) => {
      if (typeof arg === "function") {
        return (arg as (tx: MockPrisma) => unknown)(prisma);
      }
      return Promise.all(arg as Promise<unknown>[]);
    }),
  };

  return {
    service: new EngagementService(prisma as unknown as PrismaService),
    prisma,
  };
}

describe("EngagementService", () => {
  describe("clap", () => {
    it("adds claps for a first-time reader", async () => {
      const { service, prisma } = makeService();
      prisma.post.update.mockResolvedValueOnce({ ...post, clapCount: 11 });

      const result = await service.clap(
        "the-myth-of-clean-code",
        "reader_1",
        1,
        "test-agent",
      );

      expect(prisma.clap.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: {
            postId: "post_1",
            readerId: "reader_1",
            count: 1,
            userAgent: "test-agent",
          },
        }),
      );
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: "post_1" },
        data: { clapCount: { increment: 1 } },
      });
      expect(result).toEqual({ readerClapCount: 1, postClapCount: 11 });
    });

    it("caps a reader's total claps at 50", async () => {
      const { service, prisma } = makeService();
      prisma.clap.findUnique.mockResolvedValueOnce({
        count: 48,
        readerId: "reader_1",
      });
      prisma.post.update.mockResolvedValueOnce({ ...post, clapCount: 12 });

      const result = await service.clap(
        "the-myth-of-clean-code",
        "reader_1",
        10,
      );

      expect(prisma.clap.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ count: 50 }),
        }),
      );
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: "post_1" },
        data: { clapCount: { increment: 2 } },
      });
      expect(result.readerClapCount).toBe(50);
    });

    it("does nothing when the reader is already at the cap", async () => {
      const { service, prisma } = makeService();
      prisma.clap.findUnique.mockResolvedValueOnce({
        count: 50,
        readerId: "reader_1",
      });

      const result = await service.clap(
        "the-myth-of-clean-code",
        "reader_1",
        5,
      );

      expect(prisma.clap.upsert).not.toHaveBeenCalled();
      expect(prisma.post.update).not.toHaveBeenCalled();
      expect(result).toEqual({ readerClapCount: 50, postClapCount: 10 });
    });

    it("throws when the post does not exist", async () => {
      const { service, prisma } = makeService();
      prisma.post.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.clap("missing", "reader_1", 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("getReaderClapCount", () => {
    it("returns 0 when no readerId is given", async () => {
      const { service } = makeService();

      await expect(
        service.getReaderClapCount("the-myth-of-clean-code"),
      ).resolves.toEqual({ readerClapCount: 0, postClapCount: 10 });
    });

    it("returns the reader's existing clap count", async () => {
      const { service, prisma } = makeService();
      prisma.clap.findUnique.mockResolvedValueOnce({ count: 7 });

      await expect(
        service.getReaderClapCount("the-myth-of-clean-code", "reader_1"),
      ).resolves.toEqual({ readerClapCount: 7, postClapCount: 10 });
    });
  });

  describe("share", () => {
    it("records a share and increments the post's share count", async () => {
      const { service, prisma } = makeService();
      prisma.post.update.mockResolvedValueOnce({ ...post, shareCount: 4 });

      const result = await service.share(
        "the-myth-of-clean-code",
        "reader_1",
        "twitter",
        "test-agent",
      );

      expect(prisma.share.create).toHaveBeenCalledWith({
        data: {
          postId: "post_1",
          readerId: "reader_1",
          platform: "twitter",
          userAgent: "test-agent",
        },
      });
      expect(result).toEqual({ postShareCount: 4 });
    });

    it("throws when the post does not exist", async () => {
      const { service, prisma } = makeService();
      prisma.post.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.share("missing", "reader_1", "twitter"),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("getEngagementForPost", () => {
    it("returns clap/share totals and detail lists", async () => {
      const { service, prisma } = makeService();
      prisma.clap.findMany.mockResolvedValueOnce([
        { readerId: "reader_1", count: 5 },
      ]);
      prisma.share.findMany.mockResolvedValueOnce([
        { readerId: "reader_1", platform: "twitter", createdAt: now },
      ]);

      const result = await service.getEngagementForPost("post_1");

      expect(result).toEqual({
        clapCount: 10,
        shareCount: 3,
        clappers: [{ readerId: "reader_1", count: 5 }],
        sharers: [{ readerId: "reader_1", platform: "twitter", createdAt: now }],
      });
    });

    it("throws when the post does not exist", async () => {
      const { service, prisma } = makeService();
      prisma.post.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.getEngagementForPost("missing"),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
