import { BadRequestException } from "@nestjs/common";
import { describe, expect, it, jest } from "@jest/globals";

import { PrismaService } from "@/prisma/prisma.service";

import { PostsService } from "./posts.service";
import { PostRecord } from "./types/post-record";

type MockFn = ReturnType<typeof jest.fn>;

function mockResolvedValue(mock: MockFn, value: unknown): MockFn {
  return mock.mockResolvedValue(value);
}

const now = new Date("2026-01-03T00:00:00.000Z");

const category = {
  id: "category_1",
  name: "Engineering",
  slug: "engineering",
  createdAt: now,
  updatedAt: now,
};

const tag = {
  id: "tag_1",
  name: "NestJS",
  slug: "nestjs",
  createdAt: now,
  updatedAt: now,
};

const post: PostRecord = {
  id: "post_1",
  slug: "the-myth-of-clean-code",
  title: "the myth of clean code",
  number: "003",
  publishedAt: now,
  excerpt: null,
  subheading: "Good enough is often good enough",
  quote: null,
  quoteAuthor: null,
  paragraphs: ["para one"],
  list: [],
  archived: false,
  pinned: false,
  clapCount: 0,
  shareCount: 0,
  authorId: "user_1",
  categoryId: "category_1",
  category,
  tags: [tag],
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
      categoryId: "category_1",
    });

    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "the-myth-of-clean-code",
          categoryId: "category_1",
        }),
      }),
    );
    expect(result.slug).toBe("the-myth-of-clean-code");
    expect(result.category).toEqual(category);
    expect(result.tags).toEqual([tag]);
    expect(result).not.toHaveProperty("authorId");
    expect(result).not.toHaveProperty("categoryId");
  });

  it("connects tags when tagIds are provided", async () => {
    const { service, prisma } = makeService();

    await service.create({
      title: "the myth of clean code",
      number: "003",
      paragraphs: ["para one"],
      authorId: "user_1",
      categoryId: "category_1",
      tagIds: ["tag_1", "tag_2"],
    });

    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: { connect: [{ id: "tag_1" }, { id: "tag_2" }] },
        }),
      }),
    );
  });

  it("uses a custom slug and excerpt when provided", async () => {
    const { service, prisma } = makeService();

    const result = await service.create({
      title: "the myth of clean code",
      slug: "Custom Slug!",
      excerpt: "A short summary.",
      number: "003",
      paragraphs: ["para one"],
      authorId: "user_1",
      categoryId: "category_1",
    });

    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "custom-slug",
          excerpt: "A short summary.",
        }),
      }),
    );
    expect(result.excerpt).toBeNull();
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
      categoryId: "category_1",
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

  it("filters published posts by category and tag slug", async () => {
    const { service, prisma } = makeService();

    await service.findAllPublished({
      page: 1,
      limit: 20,
      categorySlug: "engineering",
      tagSlug: "nestjs",
    });

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          archived: false,
          category: { slug: "engineering" },
          tags: { some: { slug: "nestjs" } },
        },
      }),
    );
  });

  it("returns paginated posts including archived ones for admin", async () => {
    const { service, prisma } = makeService();

    const result = await service.findAllForAdmin({ page: 1, limit: 20 });

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {}, skip: 0, take: 20 }),
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

  it("pins a post via update when under the pin limit", async () => {
    const { service, prisma } = makeService();
    prisma.post.count.mockResolvedValueOnce(2);

    await service.update("post_1", { pinned: true });

    expect(prisma.post.count).toHaveBeenCalledWith({
      where: { pinned: true, NOT: { id: "post_1" } },
    });
    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ pinned: true }),
      }),
    );
  });

  it("rejects pinning a 4th post once the limit is reached", async () => {
    const { service, prisma } = makeService();
    prisma.post.count.mockResolvedValueOnce(3);

    await expect(
      service.update("post_1", { pinned: true }),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.post.update).not.toHaveBeenCalled();
  });

  it("allows unpinning without checking the pin limit", async () => {
    const { service, prisma } = makeService();

    await service.update("post_1", { pinned: false });

    expect(prisma.post.count).not.toHaveBeenCalled();
    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ pinned: false }),
      }),
    );
  });

  it("sorts pinned posts first, then by publish date", async () => {
    const { service, prisma } = makeService();

    await service.findAllPublished({ page: 1, limit: 20 });

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
      }),
    );
  });

  it("updates excerpt via update", async () => {
    const { service, prisma } = makeService();

    await service.update("post_1", { excerpt: "Updated summary." });

    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ excerpt: "Updated summary." }),
      }),
    );
  });

  it("renames a post's slug via update without colliding with itself", async () => {
    const { service, prisma } = makeService();
    prisma.post.findUnique.mockResolvedValueOnce(post);

    await service.update("post_1", { slug: "New Slug" });

    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "new-slug" }),
      }),
    );
  });

  it("does not touch the slug when omitted from an update", async () => {
    const { service, prisma } = makeService();

    await service.update("post_1", { title: "New title" });

    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: undefined }),
      }),
    );
  });

  it("replaces a post's tags via update", async () => {
    const { service, prisma } = makeService();

    await service.update("post_1", { tagIds: ["tag_2"] });

    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: { set: [{ id: "tag_2" }] },
        }),
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
