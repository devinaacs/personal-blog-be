import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { slugify } from "@/common/utils/slugify";
import {
  PaginatedResult,
  createPaginationMeta,
} from "@/common/types/pagination";
import { PrismaService } from "@/prisma/prisma.service";

import { ContentBlock } from "./types/content-block";
import {
  CreatePostInput,
  PostRecord,
  PublicPost,
  UpdatePostInput,
} from "./types/post-record";

const postInclude = { category: true, tags: true } satisfies Prisma.PostInclude;

const postOrderBy = [
  { pinned: "desc" },
  { publishedAt: "desc" },
] satisfies Prisma.PostOrderByWithRelationInput[];

const MAX_PINNED_POSTS = 3;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePostInput): Promise<PublicPost> {
    let slugSeed = input.title;
    const trimmedSlug = input.slug?.trim();
    if (trimmedSlug) {
      slugSeed = trimmedSlug;
    }
    const slug = await this.generateUniqueSlug(slugSeed);

    const post = await this.prisma.post.create({
      data: {
        slug,
        title: input.title,
        number: input.number,
        publishedAt: input.publishedAt ?? new Date(),
        excerpt: input.excerpt,
        content: input.content,
        authorId: input.authorId,
        categoryId: input.categoryId,
        tags: input.tagIds
          ? { connect: input.tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: postInclude,
    });

    return this.toPublicPost(post);
  }

  async update(id: string, input: UpdatePostInput): Promise<PublicPost> {
    const trimmedSlug = input.slug?.trim();
    const slug = trimmedSlug
      ? await this.generateUniqueSlug(trimmedSlug, id)
      : undefined;

    if (input.pinned) {
      const pinnedCount = await this.prisma.post.count({
        where: { pinned: true, NOT: { id } },
      });

      if (pinnedCount >= MAX_PINNED_POSTS) {
        throw new BadRequestException(
          `You can only pin up to ${MAX_PINNED_POSTS} posts. Unpin one first.`,
        );
      }
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: {
        slug,
        title: input.title,
        number: input.number,
        publishedAt: input.publishedAt,
        excerpt: input.excerpt,
        content: input.content,
        archived: input.archived,
        pinned: input.pinned,
        categoryId: input.categoryId,
        tags: input.tagIds
          ? { set: input.tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: postInclude,
    });

    return this.toPublicPost(post);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }

  async findAllPublished({
    page,
    limit,
    categorySlug,
    tagSlug,
  }: {
    page: number;
    limit: number;
    categorySlug?: string;
    tagSlug?: string;
  }): Promise<PaginatedResult<PublicPost>> {
    const where: Prisma.PostWhereInput = {
      archived: false,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(tagSlug ? { tags: { some: { slug: tagSlug } } } : {}),
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: postOrderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      items: posts.map((post) => this.toPublicPost(post)),
      pagination: createPaginationMeta({ page, limit, total }),
    };
  }

  async findAllForAdmin({
    page,
    limit,
    categorySlug,
    tagSlug,
  }: {
    page: number;
    limit: number;
    categorySlug?: string;
    tagSlug?: string;
  }): Promise<PaginatedResult<PublicPost>> {
    const where: Prisma.PostWhereInput = {
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(tagSlug ? { tags: { some: { slug: tagSlug } } } : {}),
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: postOrderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      items: posts.map((post) => this.toPublicPost(post)),
      pagination: createPaginationMeta({ page, limit, total }),
    };
  }

  async findBySlug(slug: string): Promise<PublicPost | null> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: postInclude,
    });

    return post ? this.toPublicPost(post) : null;
  }

  async findById(id: string): Promise<PublicPost | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: postInclude,
    });

    return post ? this.toPublicPost(post) : null;
  }

  toPublicPost(post: PostRecord): PublicPost {
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      number: post.number,
      publishedAt: post.publishedAt,
      excerpt: post.excerpt,
      content: (post.content ?? []) as unknown as ContentBlock[],
      archived: post.archived,
      pinned: post.pinned,
      clapCount: post.clapCount,
      shareCount: post.shareCount,
      category: post.category,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private async generateUniqueSlug(
    seed: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugify(seed);
    let candidate = base;
    let suffix = 2;
    let existing = await this.prisma.post.findUnique({
      where: { slug: candidate },
    });

    while (existing !== null && existing.id !== excludeId) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
      existing = await this.prisma.post.findUnique({
        where: { slug: candidate },
      });
    }

    return candidate;
  }
}
