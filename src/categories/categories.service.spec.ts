import { describe, expect, it, jest } from "@jest/globals";

import { PrismaService } from "@/prisma/prisma.service";

import { CategoriesService } from "./categories.service";
import { CategoryRecord } from "./types/category-record";

type MockFn = ReturnType<typeof jest.fn>;

function mockResolvedValue(mock: MockFn, value: unknown): MockFn {
  return mock.mockResolvedValue(value);
}

const now = new Date("2026-01-03T00:00:00.000Z");

const category: CategoryRecord = {
  id: "category_1",
  name: "Engineering",
  slug: "engineering",
  createdAt: now,
  updatedAt: now,
};

type MockPrisma = {
  category: {
    create: MockFn;
    update: MockFn;
    delete: MockFn;
    findMany: MockFn;
    findUnique: MockFn;
  };
};

function makeService(): { service: CategoriesService; prisma: MockPrisma } {
  const prisma = {
    category: {
      create: mockResolvedValue(jest.fn(), category),
      update: mockResolvedValue(jest.fn(), category),
      delete: mockResolvedValue(jest.fn(), category),
      findMany: mockResolvedValue(jest.fn(), [category]),
      findUnique: mockResolvedValue(jest.fn(), null),
    },
  } satisfies MockPrisma;

  return {
    service: new CategoriesService(prisma as unknown as PrismaService),
    prisma,
  };
}

describe("CategoriesService", () => {
  it("creates a category with a slug derived from the name", async () => {
    const { service, prisma } = makeService();

    const result = await service.create({ name: "Engineering" });

    expect(prisma.category.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "Engineering", slug: "engineering" },
      }),
    );
    expect(result.slug).toBe("engineering");
  });

  it("appends a numeric suffix when the slug already exists", async () => {
    const { service, prisma } = makeService();
    prisma.category.findUnique
      .mockResolvedValueOnce(category)
      .mockResolvedValueOnce(null);

    await service.create({ name: "Engineering" });

    expect(prisma.category.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "engineering-2" }),
      }),
    );
  });

  it("deletes a category by id", async () => {
    const { service, prisma } = makeService();

    await service.delete("category_1");

    expect(prisma.category.delete).toHaveBeenCalledWith({
      where: { id: "category_1" },
    });
  });

  it("returns null when a category is not found by slug", async () => {
    const { service } = makeService();

    await expect(service.findBySlug("missing")).resolves.toBeNull();
  });
});
