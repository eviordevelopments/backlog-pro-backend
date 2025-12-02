Welcome to the Backlog Pro Backend repository — the AI assistant should follow these project-specific guidelines to be immediately productive.

Overview

- Architecture: Clean Architecture + CQRS (commands and queries live under application/commands and application/queries). Use resolvers to call Command/Query handlers rather than executing business logic directly.
- API: GraphQL (Apollo Server v5) with code-first approach. Schema auto-generated to `src/schema.gql`.
- ORM: TypeORM (0.3.x). TypeORM entities follow a `*.typeorm-entity.ts` suffix and live under each module's `repository/entities` folder. Mappers convert between TypeORM entities and Domain entities.

Key files & conventions (do this first when exploring):

- `README.md`, `docs/SETUP.md`, `docs/CONFIGURATION.md` — global workflows and dev commands.
- `src/app.module.ts` — entry module that wires GraphQL, TypeORM and ConfigModule.
- `src/shared/config/envs.config.ts` & `src/shared/config/database.config.ts` — environment and database config. Note: package.json migration commands refer to `src/shared/config/typeorm.config.ts` which does not exist — use `database.config.ts` when running typeorm CLI or update the scripts.
- `src/*/application/commands` & `src/*/application/queries` — CQRS handlers. Commands/queries are plain classes (e.g., `SigninCommand`) handled by `*CommandHandler`.
- `src/*/resolvers` — GraphQL resolvers. Resolvers should create the command or query and call the handler.
- `src/*/repository` — Repositories, TypeORM entities (`*.typeorm-entity.ts`), and mappers (`*mapper.ts`). Repositories return domain entities.
- DTOs: `src/*/dto/request` and `src/*/dto/response` — use DTOs to express GraphQL inputs and outputs.

Common tasks and commands

- Development (local): `npm install && npm run env:local && npm run start:dev`
- Docker (recommended): `npm run env:docker && npm run docker:up` (use `npm run docker:logs` to follow logs)
- Build production: `npm run build && npm run start:prod` or `npm run docker:prod:build`
- Tests: `npm run test` (unit), `npm run test:e2e` (integration), `npm run test:cov` (coverage)
- Formatting & lint: `npm run format && npm run lint`
- Migraciones TypeORM (use Docker or run with DataSource file):
  - With Docker: `npm run docker:migration:generate` / `docker:migration:run`
  - Local (explicit): `npm run typeorm -- migration:generate -d src/shared/config/database.config.ts src/database/migrations/MyMigration` (note the CLI needs a DataSource file — use `database.config.ts`)

Patterns & Implementation Guidance

- CQRS: keep business logic in `application` or `domain`. Resolvers only map inputs → commands/queries and return response DTOs.
  Example (Auth flow): `src/auth/resolvers/auth.resolver.ts` → `SignupCommand`, handled by `SignupCommandHandler`.
- Repositories & Mappers: Keep domain entities in `/domain/entities` and TypeORM entities with `*.typeorm-entity.ts` under `repository/entities`. Implement mapper classes in `repository/mappers/` to translate back and forth.
  Example: `src/users/repository/user-profile.typeorm-entity.ts` + `src/users/repository/mappers/user-profile.mapper.ts` → Domain `UserProfile`.
- Naming & File Suffixes: Entities end with `.typeorm-entity.ts`; DTOs under `dto/request|response`; mappers end with `.mapper.ts`.
- Exceptions: Domain errors extend `BaseDomainException` (`src/shared/exceptions/base-domain.exception.ts`) and will be formatted by `GlobalExceptionFilter` for HTTP responses (no stack traces exposed).
- Logging: Prefer `new Logger(CurrentClass.name)` and include relevant IDs (e.g., userId, email) for traceability.
- GraphQL Subscriptions use `graphql-ws` and are configured in `src/shared/config/graphql.config.ts`.

Developer workflows (notes for the AI):

- When adding/altering DB schema, create a TypeORM entity (`*.typeorm-entity.ts`) first, then generate migration, review it in `src/database/migrations/`, and run it. Prefer `docker:migration:generate` when using Docker to use proper DB host.
- When modifying services or domain logic, add/extend tests (`*.spec.ts`). Unit tests follow Jest patterns. Property-based tests with `fast-check` exist for some modules — when present, follow the testing pattern used in `test` files.
- Running migrations: The project has a `databaseConfig` default export (DataSource). The CLI `-d` file must point to a DataSource file. If you see errors, run CLI with `-d src/shared/config/database.config.ts`.
- The project uses SWC (`nest-cli.json`)—fast incremental build. `start:dev` uses NestJS watch & SWC.

Integration points & external dependencies

- Postgres DB: Provided via Docker (`postgres` service in `docker-compose.yml`), and env variable `DB_HOST` switches between `postgres` (Docker) and `localhost` (local).
- External services & secrets: JWT secret in `.env` (`JWT_SECRET`). Production images are built in GitHub Actions and pushed to DockerHub.

Important Gotchas for AI edits

- Avoid changing `src/shared/config/envs.config.ts` behavior unless necessary — it centralizes env variables. Use it as the source of truth.
- Watch for the `typeorm` CLI path referenced in `package.json`—scripts expect `src/shared/config/typeorm.config.ts` but the file is `database.config.ts`. Prefer using `database.config.ts` when running CLI commands.
- Keep `synchronize: false` for production (it’s already set in `database.config.ts`) — migrations are the canonical way to evolve schema.

Where to start when implementing a new feature

1. Add DTOs for GraphQL under `dto/request` and `dto/response`.
2. Add Domain entity under `domain/entities` and Business logic in `domain`.
3. Add repository TypeORM entity under `repository/entities` and mapper to domain under `repository/mappers`.
4. Add repository methods in `repository/*.repository.ts`.
5. Add commands/queries + handlers in `application/commands` or `application/queries`.
6. Wire resolver under `resolvers` to instantiate command/query and call handler.
7. Add tests: unit + property if appropriate.

Finish: Please review and give feedback (missing sections, examples or additional patterns you want added). For bigger edits (script fixes, rename `typeorm.config.ts`) ask before applying changes.
