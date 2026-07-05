import { describe, expect, it, jest } from "@jest/globals";

import { PrismaService } from "@/prisma/prisma.service";

import { DEFAULT_SETTINGS, SETTINGS_ID } from "./settings.constants";
import { SettingsService } from "./settings.service";
import { SettingsRecord } from "./types/settings-record";

type MockFn = ReturnType<typeof jest.fn>;

function mockResolvedValue(mock: MockFn, value: unknown): MockFn {
  return mock.mockResolvedValue(value);
}

const now = new Date("2026-01-03T00:00:00.000Z");

const settings: SettingsRecord = {
  id: SETTINGS_ID,
  ...DEFAULT_SETTINGS,
  updatedAt: now,
};

type MockPrisma = {
  siteSettings: {
    upsert: MockFn;
  };
};

function makeService(): { service: SettingsService; prisma: MockPrisma } {
  const prisma = {
    siteSettings: {
      upsert: mockResolvedValue(jest.fn(), settings),
    },
  } satisfies MockPrisma;

  return {
    service: new SettingsService(prisma as unknown as PrismaService),
    prisma,
  };
}

describe("SettingsService", () => {
  it("upserts the singleton settings row with defaults on read", async () => {
    const { service, prisma } = makeService();

    const result = await service.get();

    expect(prisma.siteSettings.upsert).toHaveBeenCalledWith({
      where: { id: SETTINGS_ID },
      update: {},
      create: { id: SETTINGS_ID, ...DEFAULT_SETTINGS },
    });
    expect(result).toEqual(settings);
  });

  it("only sends defined fields as updates", async () => {
    const { service, prisma } = makeService();

    await service.update({ siteName: "dev", tagline: undefined });

    expect(prisma.siteSettings.upsert).toHaveBeenCalledWith({
      where: { id: SETTINGS_ID },
      update: { siteName: "dev" },
      create: { id: SETTINGS_ID, ...DEFAULT_SETTINGS, siteName: "dev" },
    });
  });
});
