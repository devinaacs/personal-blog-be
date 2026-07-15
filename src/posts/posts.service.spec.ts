import { describe, expect, it, jest } from "@jest/globals";

import { PrismaService } from "@/prisma/prisma.service";

import { PostsService } from "./posts.service";
import { PostRecord } from "./types/post-record";

type MockFn = ReturnType<typeof jest.fn>;

function mockResolvedValue(mock: MockFn, value: unknown): MockFn {
  return mock.mockResolvedValue(value);
}

const now = new Date("2026-01-03T00:00:00.000Z");

const post: PostRecord = {
  id: "post_1",
  slug: "the-myth-of-clean-code",
  title: "the myth of clean code",
  number: "003",
  publishedAt: now,
  subheading: "Good enough is often good enough",
  quote: null,
  quoteAuthor: null,
  paragraphs: ["para one"],
  list: [],
  archived: false,
  authorId: "user_1",
  createdAt: now,
  updatedAt: now,
};

type MockPrisma = {
  post: {
    create: MockFn;
    update: MockFn;
    delete: MockFn;
    findMany: MockFn;
    count: MockFn;
    findUnique: MockFn;
  };
};

function makeService(): { service: PostsService; prisma: MockPrisma } {
  const prisma = {
    post: {
      create: mockResolvedValue(jest.fn(), post),
      update: mockResolvedValue(jest.fn(), post),
      delete: mockResolvedValue(jest.fn(), post),
      findMany: mockResolvedValue(jest.fn(), [post]),
      count: mockResolvedValue(jest.fn(), 1),
      findUnique: mockResolvedValue(jest.fn(), null),
    },
  } satisfies MockPrisma;

  return {
    service: new PostsService(prisma as unknown as PrismaService),
    prisma,
  };
}

describe("PostsService", () => {
  it("creates a post with a slug derived from the title", async () => {
    const { service, prisma } = makeService();

    const result = await service.create({
      title: "the myth of clean code",
      number: "003",
      paragraphs: ["para one"],
      authorId: "user_1",
    });

    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "the-myth-of-clean-code" }),
      }),
    );
    expect(result.slug).toBe("the-myth-of-clean-code");
    expect(result).not.toHaveProperty("authorId");
  });

  it("appends a numeric suffix when the slug already exists", async () => {
    const { service, prisma } = makeService();
    prisma.post.findUnique
      .mockResolvedValueOnce(post)
      .mockResolvedValueOnce(null);

    await service.create({
      title: "the myth of clean code",
      number: "003",
      paragraphs: ["para one"],
      authorId: "user_1",
    });

    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "the-myth-of-clean-code-2" }),
      }),
    );
  });

  it("returns paginated published posts, excluding archived ones", async () => {
    const { service, prisma } = makeService();

    const result = await service.findAllPublished({ page: 1, limit: 20 });

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { archived: false },
        skip: 0,
        take: 20,
      }),
    );
    expect(prisma.post.count).toHaveBeenCalledWith({
      where: { archived: false },
    });
    expect(result.items).toHaveLength(1);
    expect(result.pagination).toMatchObject({ page: 1, total: 1 });
  });

  it("returns paginated posts including archived ones for admin", async () => {
    const { service, prisma } = makeService();

    const result = await service.findAllForAdmin({ page: 1, limit: 20 });

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 20 }),
    );
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({ where: expect.anything() }),
    );
    expect(result.items).toHaveLength(1);
  });

  it("archives a post via update", async () => {
    const { service, prisma } = makeService();

    await service.update("post_1", { archived: true });

    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "post_1" },
        data: expect.objectContaining({ archived: true }),
      }),
    );
  });

  it("returns null when a post is not found by slug", async () => {
    const { service } = makeService();

    await expect(service.findBySlug("missing")).resolves.toBeNull();
  });

  it("deletes a post by id", async () => {
    const { service, prisma } = makeService();

    await service.delete("post_1");

    expect(prisma.post.delete).toHaveBeenCalledWith({
      where: { id: "post_1" },
    });
  });
});
