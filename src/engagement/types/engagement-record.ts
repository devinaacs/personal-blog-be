export type ClapRecord = {
  id: string;
  postId: string;
  readerId: string;
  count: number;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ShareRecord = {
  id: string;
  postId: string;
  readerId: string;
  platform: string;
  userAgent: string | null;
  createdAt: Date;
};

export type ClapResult = {
  readerClapCount: number;
  postClapCount: number;
};

export type ShareResult = {
  postShareCount: number;
};

export type PostEngagement = {
  clapCount: number;
  shareCount: number;
  clappers: ClapRecord[];
  sharers: ShareRecord[];
};
