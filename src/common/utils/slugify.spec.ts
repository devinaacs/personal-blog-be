import { describe, expect, it } from "@jest/globals";

import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("The Myth Of Clean Code")).toBe("the-myth-of-clean-code");
  });

  it("collapses non-alphanumeric runs into a single hyphen", () => {
    expect(slugify("Todo App: The Paradox!!")).toBe("todo-app-the-paradox");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --Hello World--  ")).toBe("hello-world");
  });

  it("returns an empty string for input with no alphanumeric characters", () => {
    expect(slugify("!!!")).toBe("");
  });
});
