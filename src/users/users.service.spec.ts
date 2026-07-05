import { describe, expect, it, jest } from "@jest/globals";

import { Role } from "@/common/constants/roles";
import { PrismaService } from "@/prisma/prisma.service";

import { UserRecord } from "./types/user-record";
import { UsersService } from "./users.service";

type MockFn = ReturnType<typeof jest.fn>;

function mockResolvedValue(mock: MockFn, value: unknown): MockFn {
  return mock.mockResolvedValue(value);
}

const now = new Date("2026-01-03T00:00:00.000Z");

const user: UserRecord = {
  id: "user_1",
  email: "devc@example.com",
  name: "Devc",
  passwordHash: "hashed",
  role: Role.USER,
  refreshTokenHash: null,
  createdAt: now,
  updatedAt: now,
};

type MockPrisma = {
  user: {
    create: MockFn;
    findUnique: MockFn;
    findMany: MockFn;
    count: MockFn;
    update: MockFn;
  };
};

function makeService(): { service: UsersService; prisma: MockPrisma } {
  const prisma = {
    user: {
      create: mockResolvedValue(jest.fn(), user),
      findUnique: mockResolvedValue(jest.fn(), user),
      findMany: mockResolvedValue(jest.fn(), [user]),
      count: mockResolvedValue(jest.fn(), 1),
      update: mockResolvedValue(jest.fn(), user),
    },
  } satisfies MockPrisma;

  return {
    service: new UsersService(prisma as unknown as PrismaService),
    prisma,
  };
}

describe("UsersService", () => {
  it("strips sensitive fields when converting to a public user", () => {
    const { service } = makeService();

    expect(service.toPublicUser(user)).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  it("returns paginated public users", async () => {
    const { service, prisma } = makeService();

    const result = await service.findAllPublic({ page: 1, limit: 20 });

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 20 }),
    );
    expect(result.items).toEqual([service.toPublicUser(user)]);
    expect(result.pagination).toMatchObject({ page: 1, total: 1 });
  });

  it("returns null when a user is not found by id", async () => {
    const { service, prisma } = makeService();
    prisma.user.findUnique.mockResolvedValueOnce(null);

    await expect(service.findPublicById("missing")).resolves.toBeNull();
  });

  it("clears the refresh token hash on logout", async () => {
    const { service, prisma } = makeService();

    await service.updateRefreshTokenHash("user_1", null);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user_1" },
      data: { refreshTokenHash: null },
    });
  });
});
