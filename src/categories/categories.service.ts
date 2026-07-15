import { Injectable } from "@nestjs/common";

import { slugify } from "@/common/utils/slugify";
import { PrismaService } from "@/prisma/prisma.service";

import {
  CategoryRecord,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./types/category-record";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCategoryInput): Promise<CategoryRecord> {
    const slug = await this.generateUniqueSlug(input.name);

    return this.prisma.category.create({
      data: { name: input.name, slug },
    });
  }

  async update(id: string, input: UpdateCategoryInput): Promise<CategoryRecord> {
    return this.prisma.category.update({
      where: { id },
      data: { name: input.name },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  async findAll(): Promise<CategoryRecord[]> {
    return this.prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  async findById(id: string): Promise<CategoryRecord | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<CategoryRecord | null> {
    return this.prisma.category.findUnique({ where: { slug } });
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let candidate = base;
    let suffix = 2;

    while (
      (await this.prisma.category.findUnique({
        where: { slug: candidate },
      })) !== null
    ) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    return candidate;
  }
}
