export type PostRecord = {
  id: string;
  slug: string;
  title: string;
  number: string;
  publishedAt: Date;
  subheading: string | null;
  quote: string | null;
  quoteAuthor: string | null;
  paragraphs: string[];
  list: string[];
  archived: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostInput = {
  title: string;
  number: string;
  publishedAt?: Date;
  subheading?: string;
  quote?: string;
  quoteAuthor?: string;
  paragraphs: string[];
  list?: string[];
  authorId: string;
};

export type UpdatePostInput = Partial<
  Omit<CreatePostInput, "authorId" | "paragraphs"> & {
    paragraphs: string[];
    archived: boolean;
  }
>;

export type PublicPost = Omit<PostRecord, "authorId">;
