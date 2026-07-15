export type TagRecord = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTagInput = {
  name: string;
};

export type UpdateTagInput = Partial<CreateTagInput>;
