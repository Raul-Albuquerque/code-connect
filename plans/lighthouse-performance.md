# Plano — Correções do Lighthouse (página de Login, `apps/web`)

## Contexto

O relatório colado foi truncado no limite de 50k caracteres: dele só chegaram as métricas iniciais
(FCP **2,1 s** · score 0,25, LCP **3,8 s** · score 0,2, Speed Index 2,1 s · score 0,57) e o filmstrip.
Os audits de oportunidades/diagnóstico (render-blocking, LCP element, image sizing…) não vieram.
O plano abaixo vem desses números + leitura do código.

**Observação importante:** a auditoria rodou contra `http://localhost:5173`, o **dev server do Vite**
(módulos ESM não empacotados, React em modo dev, CSS injetado via JS, HMR client) e com aviso de
IndexedDB (não-anônimo). Boa parte de FCP/LCP vem daí e não existe em produção. Primeiro passo é
medir no build de produção para ter uma linha de base real.

Causas reais identificadas no código:

1. **Fonte bloqueante de terceiros** — `index.html` carrega CSS do Google Fonts (2 origens extras,
   CSS render-blocking + woff2 encadeado) com pesos 400/500/600/700, mas o app só usa 400 e
   `font-semibold` (600). O LCP no mobile é texto (o banner é `hidden md:block`), então o LCP espera a fonte.
2. **Banner pesado** — `public/banner.png` tem 327 KB (PNG RGBA 407×636) para exibir a 408 px
   (`w-102`). Sem `width`/`height`, sem `fetchpriority`. E como `display:none` não impede download,
   **o mobile baixa os 327 KB sem exibir nada**.
3. **Imagens sem dimensões** — `SocialButton` (`/github.png`, `/gmail.png`) sem `width`/`height` → risco de CLS.
4. Resíduos do template: `public/icons.svg` não é referenciado; `favicon.svg` (9,5 KB) não otimizado.

## Passos

### 0. Linha de base correta (sem mudar código)
- `pnpm web build && pnpm web preview` (porta 4173) e rodar Lighthouse em janela anônima, mobile e desktop.
- Registrar os números para comparar no fim. Se o usuário puder, colar de novo só a seção
  `audits` relevante (`render-blocking-resources`/`render-blocking-insight`, `lcp-discovery-insight`,
  `image-delivery-insight`, `unsized-images`) para confirmar.

### 1. Self-host da fonte Prompt
- Adicionar `@fontsource/prompt` (dependência em `apps/web/package.json`) e importar só
  `@fontsource/prompt/latin-400.css` e `latin-600.css` em `src/main.tsx` (antes de `./index.css`).
  Vite empacota os woff2 com hash → mesma origem, cache longo, `font-display: swap` já incluso.
- Remover de `index.html` os dois `preconnect` e o `<link>` do Google Fonts.
- Preload do woff2 fica fora por ora (o nome tem hash do Vite); reavaliar só se a medição do passo 0
  ainda mostrar a fonte na cadeia crítica.
- `--font-sans` em `src/index.css` continua `"Prompt", sans-serif` (nome da família do fontsource é `Prompt`).

### 2. Banner otimizado e não baixado no mobile
- Gerar `banner.webp` (e opcionalmente `banner.avif`) a partir de `public/banner.png`, mesma resolução
  (meta: < 50 KB). Ferramenta one-off: `npx sharp-cli`/`cwebp`/squoosh — sem nova dependência no projeto.
- `AuthTemplate.tsx`: trocar `<img>` por `<picture>`:
  - `<source media="(min-width: 48rem)" srcSet={bannerSrc} type="image/webp">` (48rem = breakpoint `md`);
  - `<img>` fallback com `src` = GIF transparente 1×1 em data URI só para viewports pequenos — assim o
    mobile não baixa o banner; manter `alt`, classes `hidden md:block`.
  - `width={407} height={636}`, `decoding="async"`, `fetchPriority="high"` (é o candidato a LCP no desktop).
  - Props: adicionar `bannerWidth`/`bannerHeight` ou fixar no template? → Adicionar props opcionais
    `bannerWidth`, `bannerHeight` em `AuthTemplate` para manter o template reutilizável.
- `LoginPage.tsx`: `bannerSrc="/banner.webp"` e passar as dimensões.
- Remover `public/banner.png` após confirmar.

### 3. Dimensões dos ícones sociais
- `SocialButton.tsx`: aceitar `width`/`height` (ou fixar via props de `SocialLogin`) e repassar ao `<img>`.
- `SocialLogin.tsx`: incluir `width`/`height` na lista de providers (github 40×55, gmail 33×51).
- Opcional: converter para WebP/SVG (ganho mínimo, 1–1,3 KB cada — não prioritário).

### 4. Limpeza
- Apagar `public/icons.svg` (não referenciado).
- Otimizar `favicon.svg` com `npx svgo` (one-off).

### 5. Testes (regra do CLAUDE.md: todo componente com teste + axe)
- `AuthTemplate.test.tsx`: verificar `<picture>` com `<source media>` apontando para `bannerSrc`,
  `width`/`height`/`fetchpriority` no `<img>`, `alt` preservado; manter o `it('has no WCAG 2 AA violations')`.
- `SocialButton.test.tsx` / `SocialLogin.test.tsx`: `img` recebe `width`/`height`.
- `LoginPage.test.tsx`: ajustar se checar `src` do banner.

### 6. (Opcional, a confirmar) Guardrail de performance
- Script `pnpm web lighthouse` via `npx lighthouse` contra `vite preview`, ou `@lhci/cli` com budget
  (LCP < 2,5 s, FCP < 1,8 s). Não incluir sem aprovação — adiciona dependência/CI.

## Arquivos críticos
- `apps/web/index.html`, `apps/web/src/main.tsx`, `apps/web/package.json`
- `apps/web/src/components/templates/AuthTemplate.tsx` (+ `.test.tsx`)
- `apps/web/src/components/pages/LoginPage.tsx`
- `apps/web/src/components/atoms/SocialButton.tsx`, `molecules/SocialLogin.tsx` (+ testes)
- `apps/web/public/` (banner, icons.svg, favicon.svg)

## Verificação
1. `pnpm web lint && pnpm web test` — tudo verde, axe incluído.
2. `pnpm web test:a11y` — Playwright/axe em desktop e mobile (fallback do `<picture>` não pode quebrar o `alt`).
3. `pnpm web build && pnpm web preview` → Lighthouse anônimo mobile + desktop. Metas: FCP < 1,8 s,
   LCP < 2,5 s, CLS 0; no DevTools Network (mobile) o banner **não** aparece; sem requisições a
   `fonts.googleapis.com`/`fonts.gstatic.com`.
4. Inspeção visual: fonte Prompt 400/600 renderiza igual ao antes; banner aparece em ≥ 768 px.

## Commits (Conventional Commits)
- `perf(web): self-host Prompt font`
- `perf(web): serve banner as WebP and skip it on mobile`
- `fix(web): set intrinsic size on social login images`
- `chore(web): remove unused template assets`
