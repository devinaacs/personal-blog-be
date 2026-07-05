import { describe, expect, it } from "@jest/globals";

import { createPaginationMeta } from "./pagination";

describe("createPaginationMeta", () => {
  it("computes total pages and next/previous flags for a middle page", () => {
    expect(createPaginationMeta({ page: 2, limit: 20, total: 42 })).toEqual({
      page: 2,
      limit: 20,
      total: 42,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it("marks the first page as having no previous page", () => {
    const meta = createPaginationMeta({ page: 1, limit: 20, total: 42 });

    expect(meta.hasPreviousPage).toBe(false);
    expect(meta.hasNextPage).toBe(true);
  });

  it("marks the last page as having no next page", () => {
    const meta = createPaginationMeta({ page: 3, limit: 20, total: 42 });

    expect(meta.hasNextPage).toBe(false);
    expect(meta.hasPreviousPage).toBe(true);
  });

  it("handles an empty result set", () => {
    expect(createPaginationMeta({ page: 1, limit: 20, total: 0 })).toEqual({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });
});
