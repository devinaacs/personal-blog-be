import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { slugify } from "@/common/utils/slugify";
import {
  PaginatedResult,
  createPaginationMeta,
} from "@/common/types/pagination";
import { PrismaService } from "@/prisma/prisma.service";

import {
  CreatePostInput,
  PostRecord,
  PublicPost,
  UpdatePostInput,
} from "./types/post-record";

const postInclude = { category: true, tags: true } satisfies Prisma.PostInclude;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePostInput): Promise<PublicPost> {
    const slug = await this.generateUniqueSlug(input.title);

    const post = await this.prisma.post.create({
      data: {
        slug,
        title: input.title,
        number: input.number,
        publishedAt: input.publishedAt ?? new Date(),
        subheading: input.subheading,
        quote: input.quote,
        quoteAuthor: input.quoteAuthor,
        paragraphs: input.paragraphs,
        list: input.list ?? [],
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
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        title: input.title,
        number: input.number,
        publishedAt: input.publishedAt,
        subheading: input.subheading,
        quote: input.quote,
        quoteAuthor: input.quoteAuthor,
        paragraphs: input.paragraphs,
        list: input.list,
        archived: input.archived,
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
        orderBy: { publishedAt: "desc" },
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
        orderBy: { publishedAt: "desc" },
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
      subheading: post.subheading,
      quote: post.quote,
      quoteAuthor: post.quoteAuthor,
      paragraphs: post.paragraphs,
      list: post.list,
      archived: post.archived,
      category: post.category,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title);
    let candidate = base;
    let suffix = 2;

    while (
      (await this.prisma.post.findUnique({ where: { slug: candidate } })) !==
      null
    ) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    return candidate;
  }
}
