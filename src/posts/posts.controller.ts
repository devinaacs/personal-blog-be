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
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { AuthUser } from "@/common/types/auth-user";
import { PaginatedResult } from "@/common/types/pagination";

import { CreatePostDto } from "./dto/create-post.dto";
import {
  PaginatedPostsResponseDto,
  PostResponseDto,
} from "./dto/post-response.dto";
import { PostsQueryDto } from "./dto/posts-query.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostsService } from "./posts.service";
import { ContentBlock } from "./types/content-block";
import { PublicPost } from "./types/post-record";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @ApiOkResponse({
    description: "Paginated published posts",
    type: PaginatedPostsResponseDto,
  })
  async findAll(
    @Query() query: PostsQueryDto,
  ): Promise<PaginatedResult<PublicPost>> {
    return this.posts.findAllPublished({
      page: query.page,
      limit: query.limit,
      categorySlug: query.category,
      tagSlug: query.tag,
    });
  }

  @Get("id/:id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Post by id. Admin only.",
    type: PostResponseDto,
  })
  async findOneById(@Param("id") id: string): Promise<PublicPost> {
    const post = await this.posts.findById(id);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  @Get("admin")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Paginated posts, including archived. Admin only.",
    type: PaginatedPostsResponseDto,
  })
  async findAllForAdmin(
    @Query() query: PostsQueryDto,
  ): Promise<PaginatedResult<PublicPost>> {
    return this.posts.findAllForAdmin({
      page: query.page,
      limit: query.limit,
      categorySlug: query.category,
      tagSlug: query.tag,
    });
  }

  @Get(":slug")
  @ApiOkResponse({ description: "Post by slug", type: PostResponseDto })
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
  @ApiCreatedResponse({
    description: "Post created. Admin only.",
    type: PostResponseDto,
  })
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: AuthUser,
  ): Promise<PublicPost> {
    return this.posts.create({
      ...dto,
      content: dto.content as unknown as ContentBlock[],
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      authorId: user.sub,
    });
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Post updated. Admin only.",
    type: PostResponseDto,
  })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PublicPost> {
    return this.posts.update(id, {
      ...dto,
      content: dto.content as unknown as ContentBlock[] | undefined,
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
