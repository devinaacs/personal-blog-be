import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { Role } from "@/common/constants/roles";
import { Roles } from "@/common/decorators/roles.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";

import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { SettingsService } from "./settings.service";
import { SettingsRecord } from "./types/settings-record";

@ApiTags("settings")
@Controller("settings")
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  @ApiOkResponse({ description: "Site settings" })
  async get(): Promise<SettingsRecord> {
    return this.settings.get();
  }

  @Patch()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Site settings updated. Admin only." })
  async update(@Body() dto: UpdateSettingsDto): Promise<SettingsRecord> {
    return this.settings.update(dto);
  }
}
