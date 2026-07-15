import { describe, expect, it, jest } from "@jest/globals";

import { PrismaService } from "@/prisma/prisma.service";

import { TagsService } from "./tags.service";
import { TagRecord } from "./types/tag-record";

type MockFn = ReturnType<typeof jest.fn>;

function mockResolvedValue(mock: MockFn, value: unknown): MockFn {
  return mock.mockResolvedValue(value);
}

const now = new Date("2026-01-03T00:00:00.000Z");

const tag: TagRecord = {
  id: "tag_1",
  name: "NestJS",
  slug: "nestjs",
  createdAt: now,
  updatedAt: now,
};

type MockPrisma = {
  tag: {
    create: MockFn;
    update: MockFn;
    delete: MockFn;
    findMany: MockFn;
    findUnique: MockFn;
  };
};

function makeService(): { service: TagsService; prisma: MockPrisma } {
  const prisma = {
    tag: {
      create: mockResolvedValue(jest.fn(), tag),
      update: mockResolvedValue(jest.fn(), tag),
      delete: mockResolvedValue(jest.fn(), tag),
      findMany: mockResolvedValue(jest.fn(), [tag]),
      findUnique: mockResolvedValue(jest.fn(), null),
    },
  } satisfies MockPrisma;

  return {
    service: new TagsService(prisma as unknown as PrismaService),
    prisma,
  };
}

describe("TagsService", () => {
  it("creates a tag with a slug derived from the name", async () => {
    const { service, prisma } = makeService();

    const result = await service.create({ name: "NestJS" });

    expect(prisma.tag.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { name: "NestJS", slug: "nestjs" } }),
    );
    expect(result.slug).toBe("nestjs");
  });

  it("appends a numeric suffix when the slug already exists", async () => {
    const { service, prisma } = makeService();
    prisma.tag.findUnique
      .mockResolvedValueOnce(tag)
      .mockResolvedValueOnce(null);

    await service.create({ name: "NestJS" });

    expect(prisma.tag.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "nestjs-2" }),
      }),
    );
  });

  it("deletes a tag by id", async () => {
    const { service, prisma } = makeService();

    await service.delete("tag_1");

    expect(prisma.tag.delete).toHaveBeenCalledWith({
      where: { id: "tag_1" },
    });
  });

  it("returns null when a tag is not found by slug", async () => {
    const { service } = makeService();

    await expect(service.findBySlug("missing")).resolves.toBeNull();
  });
});
