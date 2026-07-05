# dev — Personal Blog API

The NestJS REST API behind [dev](https://devjustpost.vercel.app), a personal blog about software, writing, and the occasional 2am realization. It serves published posts, site settings, and admin auth/content management for the [frontend](https://github.com/devinaacs/personal-blog-web).

Live API: <https://devjustpost-api.vercel.app>
API docs: <https://devjustpost-api.vercel.app/docs>

## Stack

- NestJS
- TypeScript strict mode
- Prisma + PostgreSQL (Supabase)
- JWT authentication with refresh token rotation and logout invalidation
- Role-based authorization (`USER` / `ADMIN`)
- `class-validator` and a global `ValidationPipe`
- `ConfigModule` with Zod environment validation
- Pino request logging
- Helmet security headers and request throttling
- Swagger / OpenAPI with typed response schemas
- Jest unit tests
- Deployed as a Vercel serverless function

## Getting Started

```bash
git clone https://github.com/devinaacs/personal-blog-be.git
cd personal-blog-be
cp .env.example .env
npm install
docker compose up -d
npm run db:migrate
npm run dev
```

Open <http://localhost:3001/api/v1/health>.

Readiness check: <http://localhost:3001/api/v1/health/ready>.

Swagger is available at <http://localhost:3001/docs>.

## Scripts

```bash
npm run dev            # Start local development
npm run build          # Create a production build
npm run start          # Start the production server from dist
npm run lint           # Run ESLint
npm run typecheck      # Run TypeScript without emitting files
npm run format         # Format the project
npm run format:check   # Check formatting
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run e2e tests against the configured database
npm run check          # Run the full local quality gate
npm run db:generate    # Generate Prisma Client
npm run db:migrate     # Create and apply a local Prisma migration
npm run db:deploy      # Apply migrations in deployed environments
npm run db:studio      # Open Prisma Studio
npm run db:reset       # Reset local database and replay migrations
npm run db:seed        # Seed the admin user
```

## Project Structure

```txt
src/
  auth/                JWT auth module: register, login, refresh, logout
  common/              Shared decorators, DTOs, filters, guards, interceptors, types
  config/              Environment schema and validation
  health/              Health and readiness checks (used by uptime + build checks)
  posts/               Blog post CRUD, slug generation, Swagger response DTOs
  prisma/              Prisma module and service lifecycle
  settings/            Singleton site settings (bio, links, footer, etc.)
  users/               User lookup and profile endpoints
  vercel.ts            Serverless bootstrap (no app.listen, used by api/index.js)
api/
  index.js             Vercel serverless function entry point
prisma/
  schema.prisma        Database schema
```

## Environment

Create a local environment file from the example:

```bash
cp .env.example .env
```

Required values:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:15432/devc_api?schema=public"
JWT_SECRET="replace-with-at-least-32-characters-secret"
JWT_REFRESH_SECRET="replace-with-a-different-32-characters-refresh-secret"
```

Environment values are validated in `src/config/env.validation.ts`. The app fails fast during boot when required values are missing or malformed.

In production this API runs against a Supabase Postgres instance through its connection pooler. Use the **transaction-mode** pooler (port `6543`) with `?pgbouncer=true&connection_limit=1` in `DATABASE_URL` — serverless invocations each open a fresh Prisma client, and the session-mode pooler (port `5432`) exhausts under concurrent cold starts.

## Database

Start PostgreSQL locally:

```bash
docker compose up -d
```

Create and apply a migration:

```bash
npm run db:migrate
```

Generate Prisma Client after changing `prisma/schema.prisma`:

```bash
npm run db:generate
```

Seed an admin account:

```bash
npm run db:seed
```

## API

The default API prefix is `api/v1`.

```txt
GET    /api/v1/health
GET    /api/v1/health/live
GET    /api/v1/health/ready
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/posts?page=1&limit=20        Published posts
GET    /api/v1/posts/:slug                  Post by slug
GET    /api/v1/posts/id/:id                 Post by id (admin)
POST   /api/v1/posts                        Create post (admin)
PATCH  /api/v1/posts/:id                    Update post (admin)
DELETE /api/v1/posts/:id                    Delete post (admin)
GET    /api/v1/settings                     Site settings
PATCH  /api/v1/settings                     Update site settings (admin)
GET    /api/v1/users?page=1&limit=20        Paginated users (admin)
GET    /api/v1/users/me                     Authenticated user profile
```

Full request/response schemas are documented in Swagger at `/docs`.

Use the JWT returned from register or login as a bearer token:

```bash
Authorization: Bearer <accessToken>
```

Responses use a consistent envelope:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "7bc17f9c-7f57-44d0-a4f2-53b3f1bb7952",
    "timestamp": "2026-04-20T00:00:00.000Z"
  }
}
```

Errors use the same shape with `success: false`, an `error` object, and request metadata.

Paginated endpoints return:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

The global response interceptor wraps this object in the standard `success/data/meta` envelope.

## Testing

Unit tests cover the business logic layer: services (`posts`, `users`, `settings`, `auth`), guards, the exception filter, the response interceptor, and shared utilities. Controllers stay thin (delegate to services) so they're exercised through the e2e suite instead.

```bash
npm run test        # Unit tests
npm run test:cov     # With coverage
npm run test:e2e     # End-to-end, against a real database
```

## Conventions

- Use Node.js 22. The repo includes `.nvmrc` for Node version managers.
- Use `@/` imports for files inside `src`.
- Keep reusable cross-cutting pieces in `src/common`.
- Keep validated configuration in `src/config/env.validation.ts`.
- Keep database access behind module services instead of querying Prisma directly from controllers.
- Use refresh token rotation for session renewal and `POST /auth/logout` to invalidate sessions.
- Use `@Roles(...)` plus `RolesGuard` for role-protected endpoints.
- Document new endpoints with `@ApiOkResponse`/`@ApiCreatedResponse` and a typed response DTO, not just a description string.
- Run `npm run check` before merging or deploying.

## Docker

Build the API image:

```bash
docker build -t devc-api .
```

Run it against the local Compose database:

```bash
docker run --env-file .env -p 3001:3001 devc-api
```

## Deployment

This API is deployed to **Vercel** as a serverless function, alongside Docker/Railway/Render presets for a traditional long-running deployment:

```txt
api/index.js       Serverless entry point (caches the Nest app across invocations)
src/vercel.ts      Bootstrap that skips app.listen()
vercel.json        Build command + rewrite-everything-to-/api routing
Dockerfile
railway.json
render.yaml
```

Vercel deployment notes:

1. `vercel.json` runs `npm run build` (`nest build`, which resolves `@/` path aliases to relative imports) and rewrites all paths to the `api/index.js` function.
2. `postinstall` runs `prisma generate` so the Prisma Client is available at build time.
3. Set `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, and the rest of `.env.example` as environment variables on the Vercel project (Production + Preview).
4. Use the transaction-mode Supabase pooler connection string (see [Environment](#environment)) — this is the fix for intermittent 500s under concurrent cold starts.

For a traditional always-on deployment instead:

1. Provision managed PostgreSQL.
2. Set `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `CORS_ORIGIN`.
3. Run migrations before starting the app with `npm run db:deploy`.
4. Seed an admin user once with `npm run db:seed`.

Railway can use the included `railway.json`. It builds from the Dockerfile, runs `npm run db:deploy` before deploy, and checks `/api/v1/health/ready`.

Render can use the included `render.yaml` as a starting point for a Docker web service and managed PostgreSQL database.

## CI

GitHub Actions runs `npm ci` and `npm run check` on pushes to `main` and pull requests.
