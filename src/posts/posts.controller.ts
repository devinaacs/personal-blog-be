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
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

import { Role } from "@/common/constants/roles";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { Roles } from "@/common/decorators/roles.decorator";
import { PaginationQueryDto } from "@/common/dto/pagination-query.dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { AuthUser } from "@/common/types/auth-user";
import { PaginatedResult } from "@/common/types/pagination";

import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostsService } from "./posts.service";
import { PublicPost } from "./types/post-record";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @ApiOkResponse({ description: "Paginated published posts" })
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<PublicPost>> {
    return this.posts.findAllPublished(query);
  }

  @Get("id/:id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Post by id. Admin only." })
  async findOneById(@Param("id") id: string): Promise<PublicPost> {
    const post = await this.posts.findById(id);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  @Get(":slug")
  @ApiOkResponse({ description: "Post by slug" })
  async findOne(@Param("slug") slug: string): Promise<PublicPost> {
    const post = await this.posts.findBySlug(slug);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "Post created. Admin only." })
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: AuthUser,
  ): Promise<PublicPost> {
    return this.posts.create({
      ...dto,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      authorId: user.sub,
    });
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Post updated. Admin only." })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PublicPost> {
    return this.posts.update(id, {
      ...dto,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    });
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: "Post deleted. Admin only." })
  async remove(@Param("id") id: string): Promise<void> {
    await this.posts.delete(id);
  }
}
