# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

pnpm workspace monorepo (`pnpm-workspace.yaml` → `apps/*`) with two independent apps that do not share code yet:

- `apps/api` — NestJS 12 backend (Express platform), TypeScript, tested with Vitest.
- `apps/web` — React 19 + Vite 8 frontend, TypeScript.

Both apps are still close to their framework starter templates. There is no shared package, no Vite proxy to the API, and no CORS config yet — wiring web ↔ api is not done.

## Commands

Run from the repo root (pnpm only; `packageManager` is pinned in the root `package.json`):

```bash
pnpm install
pnpm dev              # web (Vite) + api (nest --watch) in parallel
pnpm dev:web          # Vite dev server only
pnpm dev:api          # Nest in watch mode only (default port 3000, override with PORT)
pnpm build            # build all apps (web: tsc -b && vite build; api: nest build → dist/)
pnpm lint             # oxlint in every app
pnpm test             # runs `test` in every app (Vitest in api and web)
pnpm web test:a11y    # Playwright + axe WCAG 2 AA checks on real pages (needs browser deps: `sudo pnpm --filter web exec playwright install-deps chromium`)
```

Run any script of a single app with the filter aliases: `pnpm api <script>` / `pnpm web <script>`, e.g.:

```bash
pnpm api test:e2e                                  # e2e tests (test/**/*.e2e-spec.ts, supertest)
pnpm api test:cov                                  # coverage (v8)
pnpm api test:watch
pnpm api format                                    # prettier on src/ and test/
pnpm api exec vitest run src/app.controller.spec.ts   # single test file
pnpm api exec vitest run -t "name of test"            # single test by name
```

## Conventions that bite

- **API is native ESM** (`"type": "module"`, `module`/`moduleResolution: nodenext`). Relative imports in `apps/api` must use the `.js` extension (`import { AppModule } from './app.module.js'`), even from `.ts` files. `main.ts` uses top-level `await`.
- **Linting is oxlint, not ESLint.** The API runs it type-aware (`oxlint --type-aware`, via `oxlint-tsgolint`) with `typescript/no-floating-promises` as an error — every promise must be awaited/handled. `no-explicit-any` is off. Web enforces `react/rules-of-hooks` and warns on `react/only-export-components`.
- **API tests use Vitest with globals** (`describe`/`it`/`expect` without imports; `vitest/globals` is in tsconfig `types`). Unit tests are `*.spec.ts` next to source in `src/`; e2e tests are `*.e2e-spec.ts` in `test/` with a separate config (`vitest.config.e2e.ts`). Path aliases from tsconfig are resolved via `vite-tsconfig-paths`.
- **API formatting**: Prettier with single quotes and trailing commas (`apps/api/.prettierrc`). Web has no Prettier config and uses no semicolons/single quotes in the template files — follow the surrounding style.
- Decorators rely on `emitDecoratorMetadata`/`experimentalDecorators`; `strictPropertyInitialization` is off for DI-injected fields.

## Frontend rules (`apps/web`)

- **Atomic Design.** Organize components under `src/components/` as `atoms/`, `molecules/`, `organisms/`, `templates/` and `pages/`. A level may only compose components from lower levels (atoms import nothing from other levels; molecules use atoms; organisms use molecules/atoms; and so on).
- **Tailwind CSS** (v4, via `@tailwindcss/vite`) for all styling. Use utility classes instead of per-component CSS files.
- **Colors come from the theme.** Never put hex/rgb values in classes (`bg-[#171d1f]`) or in `style`. Every color is a token in the `@theme` block of `src/index.css` (`--color-surface` → `bg-surface`, `text-surface`, …); add a new token there when a design needs a new color. SVGs use `currentColor` and get their color from a `text-*` token.
- **Sizes use the default scale, no arbitrary values.** Font sizes use the built-in tokens (`text-sm`, `text-xl`, `text-3xl`, …) and spacing/dimensions use the numeric scale (`p-19`, `h-120`, `w-102`, where 1 = 0.25rem) or fractions (`left-1/12`). When a design value (e.g. `77px`, `15px` font) is not on the scale, round to the nearest token instead of writing `p-[77px]`/`text-[15px]`.
- **Accessibility target is WCAG 2.2 level AA.** Text needs ≥ 4.5:1 contrast against its background (≥ 3:1 for large text and for UI borders/icons); check this when adding or changing a color token.
- **Every component needs a test** that covers its essential use: it renders, and its main props/interactions behave as expected. Put the test next to the component (`Button.tsx` → `Button.test.tsx`). Tests use Vitest + React Testing Library (jsdom, globals).
- **Every component test includes an axe check**: `it('has no WCAG 2 AA violations', ...)` calling `expectNoA11yViolations(container)` from `src/test/axe.ts`. jsdom has no CSS, so contrast is only checked by the Playwright suite in `e2e/` (`pnpm web test:a11y`, real browser; add new pages to its `pages` list).

## Backend rules (`apps/api`) — REST

The API must follow REST principles:

- **Resources, not actions, in URLs:** plural nouns, kebab-case, nested only for real ownership (`/posts`, `/posts/:id/comments`). No verbs (`/getPosts`, `/posts/create`).
- **HTTP methods by meaning:** `GET` reads (safe, no side effects), `POST` creates, `PUT` replaces, `PATCH` partially updates, `DELETE` removes. `PUT`/`DELETE` must be idempotent.
- **Correct status codes:** `200` OK, `201 Created` (with a `Location` header pointing to the new resource) for creations, `204 No Content` for deletes or updates with no body, `400` invalid input, `401`/`403` auth, `404` missing resource, `409` conflict, `422` validation failure. Never return `200` with an error in the body.
- **Stateless:** each request carries everything it needs (e.g. auth token). No server-side session state.
- **JSON in and out**, with a consistent error shape (Nest's default exception filter format) across all endpoints.
- **Collections** support filtering, sorting and pagination through query parameters (`?page=&limit=&sort=`), not through custom routes.
- Validate input with DTOs at the controller boundary; keep business logic in services, not controllers.

## Git — Conventional Commits

Both apps use [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <description>`.

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Scope is the app: `web` or `api` (omit it for root/workspace changes). Examples: `feat(web): add Button atom`, `fix(api): return 404 for missing post`.
- Breaking changes: add `!` after the type/scope (`feat(api)!: ...`) and a `BREAKING CHANGE:` footer.
