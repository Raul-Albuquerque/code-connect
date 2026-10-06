# Backend: cadastro, login (JWT) e usuário logado — `apps/api`

Status: **executado** (lint, build, 14 testes unitários e 8 e2e passando).

## Contexto
O `apps/api` era só o template do Nest. Foram implementados 3 endpoints (cadastro, login com JWT, dados do usuário logado), documentados com Swagger (inputs e outputs), com persistência **apenas em memória** (sem ORM/banco). Segue as regras REST do CLAUDE.md e as convenções ESM (`.js` nos imports relativos).

## Endpoints
| Método | Rota | Auth | Sucesso | Erros |
|---|---|---|---|---|
| POST | `/users` | pública | `201` + header `Location: /users/{id}` | `400` input inválido, `409` email já cadastrado |
| POST | `/sessions` | pública | `201` `{ accessToken }` | `400`, `401` credenciais inválidas |
| GET | `/users/me` | Bearer JWT | `200` `{ id, name, email, createdAt }` | `401` |

- Login em `/sessions` (e não `/auth/login`) para respeitar "sem verbos nas URLs"; é stateless, nada fica no servidor.
- O `Location` aponta para `/users/{id}`, rota de leitura que ainda não existe (pendência).
- Login apenas por email (o formulário do web fala em "Email ou usuário").
- Respostas nunca incluem senha/hash.

## Dependências adicionadas
`@nestjs/jwt`, `@nestjs/swagger`, `@nestjs/config`, `class-validator`, `class-transformer`. Hash de senha com `scrypt` do `node:crypto` (sem dependência nativa).

## Estrutura (`apps/api/src`)
- `users/` — `users.module.ts`, `users.controller.ts` (`POST /users`, `GET /users/me` com `AuthGuard`), `users.service.ts` (`Map` em memória, email normalizado em minúsculas, `ConflictException`), `user.entity.ts`, `dto/create-user.dto.ts`, `dto/user-response.dto.ts`.
- `auth/` — `auth.module.ts` (`JwtModule.registerAsync`), `auth.controller.ts` (`POST /sessions`), `auth.service.ts` (valida credenciais, assina JWT `{ sub, email }`), `auth.guard.ts` (padrão da doc do Nest), `dto/login.dto.ts`, `dto/token-response.dto.ts`.
- `common/password.ts` — `hashPassword`/`verifyPassword` (scrypt + salt, formato `salt:hash`, `timingSafeEqual`).
- `app.setup.ts` — `configureApp(app)` com `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`), compartilhado por `main.ts` e pelos e2e.
- `main.ts` — Swagger (`DocumentBuilder` com `addBearerAuth()`), UI em `/docs`.
- `app.module.ts` — `ConfigModule.forRoot({ isGlobal: true })`, `UsersModule`, `AuthModule`.
- `.env.example` — `JWT_SECRET`, `JWT_EXPIRES_IN=1h`. Em dev há secret padrão; em produção a variável é obrigatória.
- Removidos: `AppController`, `AppService`, `app.controller.spec.ts`, `test/app.e2e-spec.ts` (template).

## Testes
- Unit: `password.spec.ts`, `users.service.spec.ts`, `auth.service.spec.ts`, `auth.guard.spec.ts`.
- E2E: `test/auth.e2e-spec.ts` (cadastro 201/409/400, login 201/401/400, `/users/me` 200/401).

## Verificação
1. `pnpm api lint`, `pnpm api build`
2. `pnpm api test`, `pnpm api test:e2e`
3. `pnpm dev:api`; `POST /users` → `POST /sessions` → `GET /users/me` com `Authorization: Bearer <token>`; conferir `http://localhost:3000/docs`.

## Fora de escopo
Banco/ORM, refresh token, logout/blacklist, CORS, `GET /users/:id` e integração do `apps/web` com a API.
