export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCategoryInput = {
  name: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
