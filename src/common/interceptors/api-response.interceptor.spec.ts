import { CallHandler, ExecutionContext } from "@nestjs/common";
import { describe, expect, it } from "@jest/globals";
import { of, firstValueFrom } from "rxjs";

import { ApiResponseInterceptor } from "./api-response.interceptor";

function makeContext(path: string, requestId?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ path, requestId }),
    }),
  } as unknown as ExecutionContext;
}

function makeHandler(value: unknown): CallHandler {
  return { handle: () => of(value) };
}

describe("ApiResponseInterceptor", () => {
  it("wraps handler output in a success envelope", async () => {
    const interceptor = new ApiResponseInterceptor();
    const context = makeContext("/api/v1/posts", "req-1");

    const result = await firstValueFrom(
      interceptor.intercept(context, makeHandler({ id: "post_1" })),
    );

    expect(result).toEqual({
      success: true,
      data: { id: "post_1" },
      meta: {
        requestId: "req-1",
        timestamp: expect.any(String),
      },
    });
  });

  it("falls back to 'unknown' when no request id is present", async () => {
    const interceptor = new ApiResponseInterceptor();
    const context = makeContext("/api/v1/posts");

    const result = await firstValueFrom(
      interceptor.intercept(context, makeHandler({ id: "post_1" })),
    );

    expect(result).toMatchObject({
      meta: { requestId: "unknown" },
    });
  });

  it("passes through Swagger docs responses unwrapped", async () => {
    const interceptor = new ApiResponseInterceptor();
    const context = makeContext("/docs", "req-1");
    const swaggerHtml = "<html>docs</html>";

    const result = await firstValueFrom(
      interceptor.intercept(context, makeHandler(swaggerHtml)),
    );

    expect(result).toBe(swaggerHtml);
  });
});
