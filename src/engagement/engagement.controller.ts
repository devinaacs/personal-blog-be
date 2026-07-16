import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { Role } from "@/common/constants/roles";
import { Roles } from "@/common/decorators/roles.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";

import { ClapPostDto } from "./dto/clap-post.dto";
import { ClapResponseDto } from "./dto/clap-response.dto";
import { EngagementResponseDto } from "./dto/engagement-response.dto";
import { SharePostDto } from "./dto/share-post.dto";
import { ShareResponseDto } from "./dto/share-response.dto";
import { EngagementService } from "./engagement.service";
import { ClapResult, PostEngagement, ShareResult } from "./types/engagement-record";

@ApiTags("engagement")
@Controller("posts")
export class EngagementController {
  constructor(private readonly engagement: EngagementService) {}

  @Get(":slug/claps")
  @ApiOkResponse({
    description: "The current reader's clap count for a post",
    type: ClapResponseDto,
  })
  async getClaps(
    @Param("slug") slug: string,
    @Query("readerId") readerId?: string,
  ): Promise<ClapResult> {
    return this.engagement.getReaderClapCount(slug, readerId);
  }

  @Post(":slug/claps")
  @ApiOkResponse({
    description: "Add claps for a post from a reader",
    type: ClapResponseDto,
  })
  async clap(
    @Param("slug") slug: string,
    @Body() dto: ClapPostDto,
    @Headers("user-agent") userAgent?: string,
  ): Promise<ClapResult> {
    return this.engagement.clap(slug, dto.readerId, dto.increment, userAgent);
  }

  @Post(":slug/shares")
  @ApiOkResponse({
    description: "Record a share of a post by a reader",
    type: ShareResponseDto,
  })
  async share(
    @Param("slug") slug: string,
    @Body() dto: SharePostDto,
    @Headers("user-agent") userAgent?: string,
  ): Promise<ShareResult> {
    return this.engagement.share(slug, dto.readerId, dto.platform, userAgent);
  }

  @Get("id/:id/engagement")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Clap and share detail for a post. Admin only.",
    type: EngagementResponseDto,
  })
  async getEngagement(@Param("id") id: string): Promise<PostEngagement> {
    return this.engagement.getEngagementForPost(id);
  }
}
