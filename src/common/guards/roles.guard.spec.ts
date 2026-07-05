import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, expect, it, jest } from "@jest/globals";

import { Role } from "@/common/constants/roles";
import { AuthUser } from "@/common/types/auth-user";

import { RolesGuard } from "./roles.guard";

function makeContext(user?: AuthUser): ExecutionContext {
  return {
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe("RolesGuard", () => {
  it("allows access when the route has no required roles", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(makeContext())).toBe(true);
  });

  it("allows access when the user has one of the required roles", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = makeContext({
      sub: "user_1",
      email: "devc@example.com",
      role: Role.ADMIN,
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it("denies access when the user lacks the required role", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = makeContext({
      sub: "user_1",
      email: "devc@example.com",
      role: Role.USER,
    });

    expect(guard.canActivate(context)).toBe(false);
  });

  it("denies access when there is no authenticated user", () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(makeContext())).toBe(false);
  });
});
