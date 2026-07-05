import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";

import { DEFAULT_SETTINGS, SETTINGS_ID } from "./settings.constants";
import { SettingsRecord, UpdateSettingsInput } from "./types/settings-record";

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<SettingsRecord> {
    return this.prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {},
      create: { id: SETTINGS_ID, ...DEFAULT_SETTINGS },
    });
  }

  async update(input: UpdateSettingsInput): Promise<SettingsRecord> {
    const changes = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    );

    return this.prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: changes,
      create: { id: SETTINGS_ID, ...DEFAULT_SETTINGS, ...changes },
    });
  }
}
