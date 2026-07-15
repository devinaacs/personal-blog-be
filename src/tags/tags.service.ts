import { Injectable } from "@nestjs/common";

import { slugify } from "@/common/utils/slugify";
import { PrismaService } from "@/prisma/prisma.service";

import { CreateTagInput, TagRecord, UpdateTagInput } from "./types/tag-record";

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateTagInput): Promise<TagRecord> {
    const slug = await this.generateUniqueSlug(input.name);

    return this.prisma.tag.create({
      data: { name: input.name, slug },
    });
  }

  async update(id: string, input: UpdateTagInput): Promise<TagRecord> {
    return this.prisma.tag.update({
      where: { id },
      data: { name: input.name },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({ where: { id } });
  }

  async findAll(): Promise<TagRecord[]> {
    return this.prisma.tag.findMany({ orderBy: { name: "asc" } });
  }

  async findById(id: string): Promise<TagRecord | null> {
    return this.prisma.tag.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<TagRecord | null> {
    return this.prisma.tag.findUnique({ where: { slug } });
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let candidate = base;
    let suffix = 2;

    while (
      (await this.prisma.tag.findUnique({ where: { slug: candidate } })) !==
      null
    ) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    return candidate;
  }
}
