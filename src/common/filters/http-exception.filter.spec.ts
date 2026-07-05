import {
  ArgumentsHost,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { describe, expect, it, jest } from "@jest/globals";

import { HttpExceptionFilter } from "./http-exception.filter";

function makeHost(path = "/api/v1/posts/missing") {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getRequest: () => ({ path, requestId: "req-1" }),
      getResponse: () => ({ status }),
    }),
  } as unknown as ArgumentsHost;

  return { host, status, json };
}

describe("HttpExceptionFilter", () => {
  it("formats a NotFoundException as a normalized error body", () => {
    const filter = new HttpExceptionFilter();
    const { host, status, json } = makeHost();

    filter.catch(new NotFoundException("Post not found"), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "Not Found",
        message: "Post not found",
        details: expect.objectContaining({ message: "Post not found" }),
      },
      meta: {
        requestId: "req-1",
        timestamp: expect.any(String),
        path: "/api/v1/posts/missing",
      },
    });
  });

  it("includes validation error arrays from BadRequestException", () => {
    const filter = new HttpExceptionFilter();
    const { host, json } = makeHost();

    filter.catch(
      new BadRequestException({
        message: ["email must be an email"],
        error: "Bad Request",
      }),
      host,
    );

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "Bad Request",
          message: ["email must be an email"],
        }),
      }),
    );
  });

  it("falls back to a generic 500 error for unknown exceptions", () => {
    const filter = new HttpExceptionFilter();
    const { host, status, json } = makeHost();

    filter.catch(new Error("boom"), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        },
      }),
    );
  });
});
