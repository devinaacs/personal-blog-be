import { Injectable } from "@nestjs/common";

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
      },
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
      },
    });

    return this.toPublicPost(post);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }

  async findAllPublished({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<PublicPost>> {
    const where = { archived: false };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
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
  }: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<PublicPost>> {
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.post.count(),
    ]);

    return {
      items: posts.map((post) => this.toPublicPost(post)),
      pagination: createPaginationMeta({ page, limit, total }),
    };
  }

  async findBySlug(slug: string): Promise<PublicPost | null> {
    const post = await this.prisma.post.findUnique({ where: { slug } });

    return post ? this.toPublicPost(post) : null;
  }

  async findById(id: string): Promise<PublicPost | null> {
    const post = await this.prisma.post.findUnique({ where: { id } });

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
