# Sweet Nothing 🧁

A full-stack e-commerce storefront for a small-batch bakery, with AI-assisted product copywriting.

![CI](https://github.com/ouardaq/sweet-nothing/actions/workflows/ci.yml/badge.svg)

**Live demo:** https://sweet-nothing-tawny.vercel.app

<!-- TODO: add a screenshot or GIF of the storefront here -->

---

## Tech stack & why

| Layer     | Choice                                   | Reasoning                                                                               |
| --------- | ---------------------------------------- | --------------------------------------------------------------------------------------- |
| Language  | **TypeScript** (strict)                  | End-to-end type safety, one language across client and server                           |
| Framework | **Next.js 16** (App Router)              | Server Components query the database directly — no separate API layer to maintain       |
| Database  | **PostgreSQL** + **Prisma**              | Relational integrity for orders/inventory; Prisma generates types that match the schema |
| AI        | **Google Gemini** (`@google/genai`)      | Generates product descriptions from a name and keywords                                 |
| Styling   | **Tailwind CSS v4**                      | Utility-first, no context-switching between files                                       |
| Testing   | **Vitest** (unit) + **Playwright** (E2E) | Fast feedback on pure logic, real-browser confidence on user flows                      |
| CI        | **GitHub Actions**                       | Lint, typecheck, and tests run on every push                                            |
| Deploy    | **Vercel** + **Neon**                    | Containerized with Docker; hosted serverless                                            |

**Why Node over Python for the backend:** the project was already committed to TypeScript and Next.js. A separate Python service would mean two codebases, two type systems, and an HTTP boundary to maintain — with no offsetting benefit, since the AI work is a single API call rather than local model inference.

## Features

- Server-rendered product catalog with detail pages and proper 404 handling
- AI description generator at `/admin` — Gemini drafts boutique-style copy from a product name and keywords
- Prices stored as integer cents to avoid floating-point rounding errors

## Architecture

```
Browser
   │
   ├── Server Components ──► Prisma ──► PostgreSQL
   │   (catalog pages, rendered per request)
   │
   └── /admin form ──► /api/generate-description ──► Gemini API
                       (validates with Zod, holds the API key)
```

The browser never talks to Gemini directly. The API key lives only on the server, so it is never exposed in the client bundle.

## Running locally

**Prerequisites:** Node 24 (see `.nvmrc`), Docker, a [Gemini API key](https://aistudio.google.com/apikey).

```bash
git clone https://github.com/ouardaq/sweet-nothing.git
cd sweet-nothing
npm install
cp .env.example .env        # then fill in your GEMINI_API_KEY
docker compose up -d        # starts PostgreSQL
npx prisma migrate dev      # creates the schema
npx tsx prisma/seed.ts      # adds sample products
npm run dev
```

Open http://localhost:3000.

## Testing

```bash
npm test          # unit tests (Vitest)
npm run test:e2e  # end-to-end tests (Playwright) — requires the database running
```

## Docker

A multi-stage production build (~314MB) that runs as a non-root user:

```bash
docker build -t sweet-nothing:latest .
docker run --rm -p 3001:3000 --env-file .env \
  -e DATABASE_URL="postgresql://shop:shop@host.docker.internal:5432/shop" \
  sweet-nothing:latest
```

## Engineering practices

- **Conventional Commits** with Husky + lint-staged running ESLint and Prettier pre-commit
- **Versioned migrations** via Prisma Migrate — no ad-hoc schema edits
- **Secrets** in `.env` (git-ignored) locally and in the platform's encrypted store in production; `.env.example` documents what is required
- **One source of truth for the toolchain** — `.nvmrc` is read by both local `nvm` and CI

## Roadmap

- Cart and checkout (Stripe)
- Authentication and order history
- Product image uploads
