# Página de Login — Code Connect (apps/web)

## Context
`apps/web` ainda é o template do Vite (App.tsx/App.css de exemplo, sem Tailwind, sem test runner). Vamos criar a página de Login conforme o layout anexado, seguindo Atomic Design + Tailwind + teste por componente (regras do CLAUDE.md). A página de Cadastro virá depois com o **mesmo layout base** (card + banner à esquerda + formulário à direita), banner diferente e campos diferentes — então o layout vira um *template* parametrizável e as peças do formulário viram átomos/moléculas reutilizáveis.

Assets já em `public/`: `banner.png` (407×636, já contém o logo), `github.png` e `gmail.png` (já incluem o rótulo "Github"/"Gmail" na imagem → renderizar só a imagem, com `alt`).

## 1. Setup (infra)
- **Tailwind v4**: `pnpm web add -D tailwindcss @tailwindcss/vite`; plugin `tailwindcss()` em `vite.config.ts`.
- `src/index.css` substituído por: `@import "tailwindcss";` + `@theme` com tokens do design:
  - `--color-page: #01080E` (fundo), `--color-surface: #171D1F` (card), `--color-primary: #81FE88` (verde), `--color-input: #888888`, `--color-offwhite: #E1E1E1`, `--color-muted: #BCBCBC`, `--color-shape: #07161C` (formas decorativas)
  - `--font-sans: "Prompt", sans-serif` (fonte do Code Connect) carregada via Google Fonts em `index.html`; `lang="pt-BR"`, `<title>Code Connect</title>`.
- **Testes**: `pnpm web add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`; bloco `test` no `vite.config.ts` (`environment: 'jsdom'`, `globals: true`, `setupFiles: './src/test/setup.ts'` importando `@testing-library/jest-dom/vitest`); `"vitest/globals"` e `"@testing-library/jest-dom"` em `types` do `tsconfig.app.json`; scripts `test` (`vitest run`) e `test:watch`.
- Remover `App.css`, `src/assets/*` e o conteúdo de exemplo; `App.tsx` passa a renderizar `<LoginPage />`. Sem router por ora (link de cadastro é `<a href="/cadastro">`; router entra junto com a página de cadastro).

## 2. Componentes (`src/components/`, cada um com `X.tsx` + `X.test.tsx`)

**atoms/**
- `Button` — botão primário verde, `fullWidth`, aceita `children` (texto + ícone) e props nativas de `<button>`.
- `Input` — input cinza (`bg-input`), repassa props nativas (`forwardRef`/`ref` prop do React 19).
- `Label` — rótulo de campo (`htmlFor`).
- `Checkbox` — checkbox estilizado + texto ("Lembrar-me"), props nativas.
- `TextLink` — link sublinhado (`variant`: `default` | `primary` para o verde do "Crie seu cadastro!").
- `Heading` — título "Login" (`as` h1/h2).
- `Divider` — linha horizontal com texto central opcional ("ou entre com outras contas").
- `SocialButton` — botão que mostra a imagem do provedor (`src`, `alt`/`label`, `onClick`).
- `Icon` — `ArrowRightIcon` e `ClipboardIcon` como SVGs inline (`aria-hidden`).
- `ChainShape` — SVG decorativo do elo do logo, usado no fundo (`aria-hidden`).

**molecules/**
- `FormField` — `Label` + `Input` ligados por `id` (`label`, `name`, `type`, `placeholder`, ...). Reuso direto no cadastro (nome, email, senha).
- `SocialLogin` — `Divider` + lista de `SocialButton` (GitHub, Gmail); prop `onSelect(provider)`.
- `AuthSwitchPrompt` — pergunta + `TextLink` com ícone (`question`, `linkLabel`, `href`, `icon`). Login: "Ainda não tem conta? / Crie seu cadastro!"; cadastro: "Já tem conta? / Faça seu login!".

**organisms/**
- `LoginForm` — `Heading` "Login", subtítulo "Boas-vindas! Faça seu login.", `FormField` email/usuário e senha, linha `Checkbox` "Lembrar-me" + `TextLink` "Esqueci a senha", `Button` "Login →", `SocialLogin`, `AuthSwitchPrompt`. Form não-controlado; no submit lê `FormData` e chama `onSubmit({ login, password, remember })`. Props `onSubmit`, `onSocialLogin`. (Sem integração com API — CORS/proxy ainda não existem.)

**templates/**
- `AuthTemplate` — fundo `bg-page` com dois `ChainShape` posicionados (topo-esquerda, baixo-direita), card `bg-surface rounded-3xl` centralizado, à esquerda `<img src={bannerSrc} alt={bannerAlt}>` e à direita `children`. Props: `bannerSrc`, `bannerAlt`, `children`. Responsivo: em telas < `md` o banner fica oculto e o card ocupa a largura com padding. **É o ponto de reuso do cadastro** (`<AuthTemplate bannerSrc="/banner-cadastro.png"><RegisterForm/></AuthTemplate>`).

**pages/**
- `LoginPage` — `<AuthTemplate bannerSrc="/banner.png" bannerAlt="..."><LoginForm onSubmit=... onSocialLogin=... /></AuthTemplate>` (handlers por ora só `console.log`/placeholder).

## 3. Testes (essenciais por componente)
- Atoms: renderiza; `Button` dispara `onClick`; `Input`/`Checkbox` repassam props e mudam valor; `TextLink` tem `href`; `SocialButton` tem nome acessível e chama `onClick`; `Divider` mostra texto.
- Molecules: `FormField` — `getByLabelText` encontra o input; `SocialLogin` chama `onSelect('github'|'google')`; `AuthSwitchPrompt` mostra pergunta e link com `href`.
- `LoginForm`: preencher campos + marcar "Lembrar-me" + clicar Login → `onSubmit` recebe os valores.
- `AuthTemplate`: renderiza banner com `alt` e os `children`.
- `LoginPage`: renderiza heading "Login" e o banner.

## Verificação
- `pnpm web test` (todos verdes), `pnpm lint`, `pnpm build:web` (tsc + vite).
- `pnpm dev:web` e comparar visualmente com o layout anexado (desktop ~1920px e mobile).
- Commits no padrão Conventional Commits (ex.: `build(web): set up tailwind and vitest`, `feat(web): add login page`) — só se solicitado.
