import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags as ApiSwaggerTags,
} from "@nestjs/swagger";

import { Role } from "@/common/constants/roles";
import { Roles } from "@/common/decorators/roles.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";

import { CreateTagDto } from "./dto/create-tag.dto";
import { TagResponseDto } from "./dto/tag-response.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { TagsService } from "./tags.service";
import { TagRecord } from "./types/tag-record";

@ApiSwaggerTags("tags")
@Controller("tags")
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @Get()
  @ApiOkResponse({ description: "All tags", type: [TagResponseDto] })
  async findAll(): Promise<TagRecord[]> {
    return this.tags.findAll();
  }

  @Get(":slug")
  @ApiOkResponse({ description: "Tag by slug", type: TagResponseDto })
  async findOne(@Param("slug") slug: string): Promise<TagRecord> {
    const tag = await this.tags.findBySlug(slug);

    if (!tag) {
      throw new NotFoundException("Tag not found");
    }

    return tag;
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Tag created. Admin only.",
    type: TagResponseDto,
  })
  async create(@Body() dto: CreateTagDto): Promise<TagRecord> {
    return this.tags.create(dto);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Tag updated. Admin only.",
    type: TagResponseDto,
  })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateTagDto,
  ): Promise<TagRecord> {
    return this.tags.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: "Tag deleted. Admin only." })
  async remove(@Param("id") id: string): Promise<void> {
    await this.tags.delete(id);
  }
}
