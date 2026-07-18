import { Prisma } from "@prisma/client";

import { CategoryRecord } from "@/categories/types/category-record";
import { TagRecord } from "@/tags/types/tag-record";

import { ContentBlock } from "./content-block";

export type PostRecord = {
  id: string;
  slug: string;
  title: string;
  number: string;
  publishedAt: Date;
  excerpt: string | null;
  content: Prisma.JsonValue;
  archived: boolean;
  pinned: boolean;
  clapCount: number;
  shareCount: number;
  authorId: string;
  categoryId: string | null;
  category: CategoryRecord | null;
  tags: TagRecord[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostInput = {
  title: string;
  slug?: string;
  number: string;
  publishedAt?: Date;
  excerpt?: string;
  content: ContentBlock[];
  authorId: string;
  categoryId: string;
  tagIds?: string[];
};

export type UpdatePostInput = Partial<
  Omit<CreatePostInput, "authorId"> & {
    archived: boolean;
    pinned: boolean;
  }
>;

export type PublicPost = Omit<
  PostRecord,
  "authorId" | "categoryId" | "content"
> & {
  content: ContentBlock[];
};
