import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";

import { MAX_CLAPS_PER_READER } from "./constants";
import {
  ClapResult,
  PostEngagement,
  ShareResult,
} from "./types/engagement-record";

@Injectable()
export class EngagementService {
  constructor(private readonly prisma: PrismaService) {}

  async clap(
    slug: string,
    readerId: string,
    increment: number,
    userAgent?: string,
  ): Promise<ClapResult> {
    const post = await this.prisma.post.findUnique({ where: { slug } });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.clap.findUnique({
        where: { postId_readerId: { postId: post.id, readerId } },
      });
      const currentCount = existing?.count ?? 0;
      const newCount = Math.min(
        currentCount + increment,
        MAX_CLAPS_PER_READER,
      );
      const delta = newCount - currentCount;

      if (delta <= 0) {
        return { readerClapCount: currentCount, postClapCount: post.clapCount };
      }

      await tx.clap.upsert({
        where: { postId_readerId: { postId: post.id, readerId } },
        create: { postId: post.id, readerId, count: delta, userAgent },
        update: { count: newCount, userAgent },
      });

      const updatedPost = await tx.post.update({
        where: { id: post.id },
        data: { clapCount: { increment: delta } },
      });

      return {
        readerClapCount: newCount,
        postClapCount: updatedPost.clapCount,
      };
    });
  }

  async getReaderClapCount(
    slug: string,
    readerId?: string,
  ): Promise<ClapResult> {
    const post = await this.prisma.post.findUnique({ where: { slug } });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (!readerId) {
      return { readerClapCount: 0, postClapCount: post.clapCount };
    }

    const clap = await this.prisma.clap.findUnique({
      where: { postId_readerId: { postId: post.id, readerId } },
    });

    return {
      readerClapCount: clap?.count ?? 0,
      postClapCount: post.clapCount,
    };
  }

  async share(
    slug: string,
    readerId: string,
    platform: string,
    userAgent?: string,
  ): Promise<ShareResult> {
    const post = await this.prisma.post.findUnique({ where: { slug } });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const [, updatedPost] = await this.prisma.$transaction([
      this.prisma.share.create({
        data: { postId: post.id, readerId, platform, userAgent },
      }),
      this.prisma.post.update({
        where: { id: post.id },
        data: { shareCount: { increment: 1 } },
      }),
    ]);

    return { postShareCount: updatedPost.shareCount };
  }

  async getEngagementForPost(postId: string): Promise<PostEngagement> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const [clappers, sharers] = await Promise.all([
      this.prisma.clap.findMany({
        where: { postId },
        orderBy: { count: "desc" },
      }),
      this.prisma.share.findMany({
        where: { postId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      clapCount: post.clapCount,
      shareCount: post.shareCount,
      clappers,
      sharers,
    };
  }
}
