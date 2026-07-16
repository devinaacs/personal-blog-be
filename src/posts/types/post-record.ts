import { CategoryRecord } from "@/categories/types/category-record";
import { TagRecord } from "@/tags/types/tag-record";

export type PostRecord = {
  id: string;
  slug: string;
  title: string;
  number: string;
  publishedAt: Date;
  excerpt: string | null;
  subheading: string | null;
  quote: string | null;
  quoteAuthor: string | null;
  paragraphs: string[];
  list: string[];
  archived: boolean;
  pinned: boolean;
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
  subheading?: string;
  quote?: string;
  quoteAuthor?: string;
  paragraphs: string[];
  list?: string[];
  authorId: string;
  categoryId: string;
  tagIds?: string[];
};

export type UpdatePostInput = Partial<
  Omit<CreatePostInput, "authorId" | "paragraphs"> & {
    paragraphs: string[];
    archived: boolean;
    pinned: boolean;
  }
>;

export type PublicPost = Omit<PostRecord, "authorId" | "categoryId">;
