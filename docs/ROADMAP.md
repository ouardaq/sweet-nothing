# Sweet Nothing — Implementation Roadmap

A pixel-art bakery storefront. This document is the reference plan: what is built,
what comes next, and the engineering standards every step is held to.

- **Live:** https://sweet-nothing-tawny.vercel.app
- **Design spec:** `~/Documents/sweet treat.pdf` (read with `pdftotext -layout`)
- **Design source:** `design/` — `styles.css`, `sprites.jsx`, `layout.jsx`, `components.jsx`, `pages-*.jsx`

---

## 1. Architecture

The app is built in four layers, bottom-up. Each layer only depends on the ones below it.

```
Database (PostgreSQL)      what a product IS — price, sprite, flavor, stock
        ↓
Design tokens (globals.css) the visual language — colors, fonts, pixel frames
        ↓
Components (src/components) reusable pieces — PixelSprite, NavBar, PixelButton
        ↓
Pages (src/app)             fetch data, arrange components
```

**Stack:** TypeScript (strict) · Next.js 16 App Router · PostgreSQL + Prisma
(driver adapter, client generated to `src/generated/prisma`) · Tailwind v4 ·
Gemini (`@google/genai`) · Vitest + Playwright · GitHub Actions · Docker ·
Vercel + Neon.

**Key decisions already made**

| Decision                                            | Reason                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------ |
| Node/TypeScript backend, not Python                 | One language end-to-end; the AI work is a single API call, not model inference |
| Prices as integer cents                             | Floating-point money causes rounding bugs                                      |
| Sprites as SVG from character grids                 | No image hosting, infinitely sharp, recolor instead of redraw                  |
| `flavor` stored, wash colour derived in code        | One source of truth                                                            |
| `category` as a plain string, not a table           | ~15 products, no category admin planned; normalise later if filters grow       |
| Cart in PostgreSQL, not `localStorage`              | Survives devices, works with auth, enables stock transactions                  |
| Vercel + Neon, not AWS                              | Free; the Dockerfile still demonstrates container skills                       |
| `gemini-flash-latest` (alias, not a pinned version) | Pinned `gemini-2.5-flash` was retired and returned 404                         |

---

## 2. Engineering standards

These are non-negotiable for every step.

### Branching and commits

- One feature branch per step: `feat/design-system`, `feat/shop-page`, `feat/cart`
- [Conventional Commits](https://www.conventionalcommits.org/): `feat:` `fix:` `chore:` `test:` `docs:` `ci:`
- Open a PR per step, let CI pass, then merge. Never commit directly to `main`.
- `main` is protected: PR required, `build` status check required. A red PR must never be merged —
  CI that can be ignored is decoration. (PR #4 was merged red once; that is what prompted the rule.)
- **After any dependency change, fully regenerate the lockfile before pushing:**
  `rm -rf node_modules package-lock.json && npm install`. Incremental `npm install` on macOS leaves
  the WASM-target optional deps of Tailwind v4's `@tailwindcss/oxide-wasm32-wasi` out of the
  lockfile, and Linux `npm ci` then fails with `Missing: @emnapi/runtime@… from lock file`.
  Do **not** try to fix this by declaring `@emnapi/core` / `@emnapi/runtime` as dependencies —
  that hoists one version and prunes the nested pinned copies (`1.11.1` for `@rolldown/…`,
  `1.10.0` for `@unrs/…`), which fails the same way for the opposite reason. A full regeneration
  is the fix; CI is the only thing that catches this, since Vercel's installer is more tolerant.

### Definition of Done

A step is not finished until all five are true:

1. `npm run lint` clean
2. `npx tsc --noEmit` clean
3. `npm test` passing — new logic has a unit test
4. Verified in the browser, not just compiling
5. Committed with a conventional message and pushed with CI green

### Testing

- **Unit (Vitest)** — pure logic: price formatting, flavour→wash mapping, promo codes, cart totals
- **E2E (Playwright)** — user journeys: browse → detail, add to cart → checkout
- E2E runs locally, not in CI (CI would need a seeded database — a deliberate scope call)

### Other rules

- Secrets in `.env` (git-ignored) and Vercel's encrypted store. Never in the repo.
- Never commit generated files: `node_modules`, `.next`, `src/generated/prisma`, `test-results/`, `design/sweet-treat-standalone.html`
- Schema changes only via `prisma migrate` — never hand-edited SQL
- `prisma migrate dev` only ever touches the **local** Docker database. Production (Neon) is migrated
  by `prisma migrate deploy`, wired into the `vercel-build` script so every deploy applies pending
  migrations before building. Symptom of forgetting: the live site 500s on database-backed pages
  while non-database pages still return 200.
- After **any** schema change run both `prisma migrate dev` **and** `prisma generate`, then restart
  the dev server. `migrate` updates the database; `generate` updates the TypeScript client; the
  client is loaded at boot so hot reload will not pick it up. Symptoms of skipping it:
  `Unknown argument <field>` (client behind the DB) or `P2022 column does not exist`
  (client ahead of the DB).
- Stock changes inside a transaction so concurrent orders cannot oversell
- The seed is **declarative**: it upserts by `slug` and prunes any product whose slug is not in the
  file, so the database matches the seed exactly. Without pruning, renaming a slug leaves an orphan
  row (this happened once with `fudgy-chocolate-dorayaki`). **When `Order`/`CartItem` reference
  products (step 10), swap the hard delete for a soft delete (`discontinuedAt`)** — a product in
  someone's order history must never be removed.
- Accessible markup: real `<button>`/`<a>`, labelled inputs, visible focus states
- One primary (pink) action per view, per the design spec

---

## 3. Progress

### Complete

| Phase           | What                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Setup 1         | Next.js + TypeScript strict + Tailwind                                                                                                                                                                                                                                                                                                                                                     |
| Setup 2         | Prettier, Husky, lint-staged, eslint-config-prettier                                                                                                                                                                                                                                                                                                                                       |
| Setup 3         | PostgreSQL in Docker, Prisma, versioned migrations                                                                                                                                                                                                                                                                                                                                         |
| Setup 4         | Product list + detail pages, seed data                                                                                                                                                                                                                                                                                                                                                     |
| Setup 5         | Gemini description generator at `/admin` (Zod-validated, key server-side)                                                                                                                                                                                                                                                                                                                  |
| Setup 6         | Vitest unit tests + Playwright E2E                                                                                                                                                                                                                                                                                                                                                         |
| Setup 7         | GitHub Actions CI — green                                                                                                                                                                                                                                                                                                                                                                  |
| Setup 8         | Production Dockerfile (multi-stage, non-root, 314 MB) + deployed to Vercel/Neon                                                                                                                                                                                                                                                                                                            |
| Design A        | Fonts (Press Start 2P + Quicksand), theme tokens, pixel primitives                                                                                                                                                                                                                                                                                                                         |
| Design 1 (part) | `Product` schema extended: `spriteKey`, `spriteSwap`, `flavor`, `tag`, `category`                                                                                                                                                                                                                                                                                                          |
| Design 1        | Sprite engine — `src/lib/sprites.ts`, `PixelSprite.tsx` (Server Component, zero client JS), `src/lib/flavors.ts` + unit test, homepage on spec (1180 px container, `auto-fill` grid, `.frame`/`.treat-card`, flavour washes)                                                                                                                                                               |
| Design 1b       | Full 15-product catalog seeded with sprite keys, swap maps, flavours and categories; seed made declarative (prunes stale slugs)                                                                                                                                                                                                                                                            |
| Design 2        | Shell — sticky `NavBar` with the client boundary kept to `NavLink` alone, `Logo`, checkered `Footer`, wired into the root layout                                                                                                                                                                                                                                                           |
| Design 3a       | `tagStyle` + unit tests; `Tag`, `Price` (takes cents, delegates to `formatPrice`), `Stars` server components; ★ TOP / NEW badges on cards                                                                                                                                                                                                                                                  |
| Design 4        | Home page — three-layer cloud parallax hero (38 px h1), trust stats, category cards, bestsellers, Treat Club stamp card, fresh-batch row. `ProductCard` extracted, `PixelLink` added (navigation is a link, not a button), shared `pixelSurface` styles. Fixed the Tailwind theme block — tokens were in a plain `:root` instead of `@theme inline`, so no colour utilities were generated |
| Design 5        | `/shop` — deep-linkable category chips, sort control, result count, designed empty state. Filter and sort state live in the URL; filtering and ordering happen in the database; `searchParams` validated into known unions                                                                                                                                                                 |
| Ops             | MIT LICENSE, repo description, branch protection on `main` (PR required + `build` status check), `vercel-build` runs `prisma migrate deploy` so schema cannot reach production without its migration                                                                                                                                                                                       |

### Remaining

| Step   | Deliverable                                                                                                                                                                                                      | Done when                                             |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **6**  | Product detail — two columns, flavour-washed sprite panel, `Stars`, attribute tags, bordered buy box with `QtyStepper` + live total, related items from the same category. Builds `QtyStepper` and `PixelButton` | Browse experience complete                            |
| **7**  | Cart — `Cart`/`CartItem` models, cookie-based guest session, add/remove/quantity, `Toast`, nav badge. Builds `Toast`                                                                                             | `/cart` works and survives reload for anonymous users |
| **8**  | Auth — Auth.js login/register, `/admin` protected, guest cart merged into the user cart on login, guest checkout still allowed. Builds `Field`                                                                   | `/register` works and `/admin` is no longer public    |
| **9**  | Checkout — 3 steps, pickup/delivery (free over $25), `PIXEL15`, order confirmation, stock decrement in a transaction                                                                                             | An order can be placed end to end                     |
| **10** | Admin — create/edit products, Gemini descriptions, sprite + flavour picker                                                                                                                                       | Products can be added without touching the seed       |
| **11** | Polish — 4-theme switcher, motion, responsive, a11y pass, README screenshots                                                                                                                                     | Portfolio-ready                                       |

**Reordered from the original plan, deliberately:** cart moved ahead of admin because `/cart` is linked from the nav on every page and currently 404s, while admin CRUD matters less now that 15 products are seeded. Auth follows the cart so guest-to-user cart merging is written while that code is fresh — and because `/admin` is publicly reachable in production until then. The old standalone "primitives" step was dropped; each primitive is now built at the point it is first needed.

### Known gaps / backlog

- `/admin` is **live and unauthenticated** — anyone can burn the Gemini quota. Fix in step 9, sooner if the link is shared.
- 3 high-severity `npm audit` findings — review with `npm audit`, never `--force`
- E2E not in CI (needs a seeded Postgres service container)
- README still lacks screenshots
- `@vitejs/plugin-react` not installed — needed only if React components get unit tests

---

## 4. Design spec quick reference

### Tokens (PDF spec wins where it differs from `styles.css`)

```
--primary   #ff9ec4   candy pink, primary actions
--primary-d #e86fa2   pink border/shadow, prices
--accent    #8fd0f5   sky blue, secondary
--accent-d  #4ea7e0
--bg        #fff7e6   page wash
--bg-2      #fdeedd   alternate band, input fill
--cream     #fffdf5   card surface
--ink       #6b4a3a   text and outlines (warm brown, never black)
--ink-soft  #a98a78   secondary text
--line      #ecd6bf   hairline, soft shadow
--shadow    #e3bf9c   hard offset shadow
--yellow    #ffe17a   basket, bestseller tag
--mint      #b9e8c8   promo band, NEW tag
--good      #7ec98f   success, savings
```

### Flavour washes (tint the card's sprite area)

| Flavour              | Wash      | Flavour  | Wash      |
| -------------------- | --------- | -------- | --------- |
| strawberry / default | `#fdeaf1` | matcha   | `#eef6dc` |
| ramune               | `#e3f3fd` | lavender | `#efeafd` |
| redbean              | `#f7ecdc` | custard  | `#fdf3da` |

### Type scale

| Role               | Face    | Size                           |
| ------------------ | ------- | ------------------------------ |
| Hero h1            | pixel   | 38 px + 3 px white text-shadow |
| Page h1            | pixel   | 22–26 px                       |
| Section h2         | pixel   | 22 px                          |
| Card title         | pixel   | 11 px                          |
| Label / chip / tag | pixel   | 9 px                           |
| Body               | rounded | 15–17 px, weight 600           |
| Caption            | rounded | 12–13 px                       |

Pixel face **never** sets paragraphs. Rounded face **never** sets headings.

### Layout

- Container 1180 px (1080–1100 px on cart and product), 24 px gutter
- Product grid `auto-fill, minmax(220px, 1fr)`, 20 px gap — reflows 4→1 with no breakpoints
- 44–56 px between sections; 26 px from a section title to its content
- Radius 2 px everywhere
- Full-width sections separated by a 4 px ink border, not whitespace

### Motion

| Name         | Behaviour                         | Timing                  |
| ------------ | --------------------------------- | ----------------------- |
| `float-y`    | ±6 px vertical drift              | 3 s ease-in-out ∞       |
| `drift`      | cloud layers panning              | 40 / 52 / 64 s linear ∞ |
| `pop-in`     | rise 8 px + scale 0.98→1          | 0.32 s spring           |
| button press | translate 3 px, shadow collapses  | 0.05 s                  |
| card hover   | lift + deepen shadow, sprite bobs | 0.14 s spring           |

### Voice

Warm, brief, second-person, food-forward.

| Instead of         | Write                                 |
| ------------------ | ------------------------------------- |
| Add to cart        | `+ Add` · `Add 2 to basket`           |
| Cart is empty      | Your basket is empty — let's fix that |
| Invalid promo code | Hmm, try PIXEL15 🤫                   |
| Sign up            | Join the bakery · Create account ♡    |
| Order confirmed    | Order placed! It's in the oven        |

Emoji only as objects (🧺 basket, 🍓 strawberry, 🚲 delivery, 🔒 security) — never decoration.

### Do / Don't

| Do                                 | Don't                          |
| ---------------------------------- | ------------------------------ |
| Hard shadows, zero blur            | Soft or blurred shadows        |
| Pixel face for labels and headings | Pixel face for paragraphs      |
| Warm brown `#6b4a3a` outlines      | Pure black outlines            |
| 2 px radius                        | Pills or heavy rounding        |
| Recolour an existing sprite grid   | Photography or non-pixel icons |
| One primary action per view        | Competing pink buttons         |
| Gradients only in the sky backdrop | Gradients on cards or buttons  |

Guest-first: browsing, adding to basket, and checkout must never require an account.
