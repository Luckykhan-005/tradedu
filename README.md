# TradeEd

A trading-education platform: structured video courses, a paid book library, live
mentor sessions, a risk/position calculator, a trading journal and AI trading
tools — with plan-gated content enforced on the server.

> **Payment model (important):** TradeEd deliberately uses **no online payment
> gateway** and holds **no card data**. Students transfer the plan fee directly
> to the owner's **JazzCash / Easypaisa** account, upload a screenshot of the
> transfer in the subscribe form, and the owner manually verifies the transfer
> and activates the plan from the admin panel.

---

## Table of contents

- [Feature overview](#feature-overview)
- [Subscription plans](#subscription-plans)
- [Payment and activation flow](#payment-and-activation-flow)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Routing](#routing)
- [Data model](#data-model)
- [API surface](#api-surface)
- [Access control](#access-control)
- [Authentication and sessions](#authentication-and-sessions)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Maintenance tasks](#maintenance-tasks)
- [Security notes](#security-notes)

---

## Feature overview

| Feature | Description |
| --- | --- |
| Courses | Video courses (YouTube or direct video URLs) organised into modules and lessons, with per-lesson access flags |
| Book library | 13 books with chapter navigation; content is released only after a server-side plan check |
| Live sessions | Scheduled sessions with join links that are hidden until the caller's plan is verified |
| Progress tracking | Per-lesson completion stored in the database; a course flips to `completed` only when every lesson is done |
| Risk calculator | Position sizing, risk/reward and liquidation estimation |
| Trading journal | Private per-user trade journal with win/loss statistics |
| Certificates | Printable certificates for courses marked complete |
| Glossary | Searchable trading-terms reference |
| AI tools hub | Curated index of external AI trading tools, embedded in read-only mode; tools without a working URL are shown as "Coming Soon" rather than being linked to a placeholder |
| Policies & disclaimer | Terms, refund position, privacy notice and the trading-risk disclaimer, linked from every page |

---

## Subscription plans

Plans are ranked so that a higher plan always includes a lower one:

| Plan | Rank | Access |
| --- | --- | --- |
| `FREE` | 0 | Free courses, the three free books, risk calculator, journal, glossary |
| `STARTER` | 1 | All courses and books, live sessions |
| `PREMIUM` | 2 | Everything in Starter, plus premium-only sessions and tools |

An expired paid plan automatically degrades to `FREE`. The check is performed by
`effectivePlan(plan, expiresAt)` on every request, so an expiry never needs a
background job.

Display prices live in exactly one place — [`src/lib/payment.ts`](src/lib/payment.ts:39) —
so the pricing page and the subscribe page can never quote different amounts.

---

## Payment and activation flow

1. A student picks a plan on the pricing page and opens the subscribe form.
2. The form shows the **JazzCash** and **Easypaisa** account numbers (with a
   copy-to-clipboard button) and the exact amount to send.
3. The student transfers the fee from their own app and takes a screenshot
   showing the amount, date and transaction ID.
4. The student submits the form with that screenshot. A row is written to
   `subscription_requests` with status `inactive`.
5. The owner opens **Admin → Subscriptions**, compares the screenshot against the
   actual account statement, then approves or rejects the request.
6. Approving sets the request to `active` **and** writes the plan (plus a 30-day
   expiry) onto the user record. Deactivating downgrades the user back to `FREE`.

There is **no** client- or student-reachable route that grants a plan. Plan
activation is admin-only, and it is the admin session that is verified — not a
value sent by the browser.

### Changing the payment details

All student-facing payment information is centralised in
[`src/lib/payment.ts`](src/lib/payment.ts:1):

- `PAYMENT_CONTACT` — WhatsApp number and support email
- `PAYMENT_ACCOUNTS` — the JazzCash and Easypaisa account holder and number
- `PLAN_PRICES` — the displayed price of each plan
- `PAYMENT_STEPS` — the numbered instructions shown above the form

Replace the placeholder values there and nothing else in the codebase needs to
change.

---

## Architecture

TradeEd runs on two parallel backends that must be kept in sync:

```
Browser (React SPA)
        │
        ▼
Vercel:  /api/*  ──►  api/index.ts        (serverless handler, @libsql/client → Turso)
                             │
                             └─ unmatched routes are proxied to the platform backend

Local:   Bun + Hono  ──►  custom-routes.ts (Prisma 7 → SQLite dev.db)
```

| Concern | Production | Local dev |
| --- | --- | --- |
| Entry point | [`api/index.ts`](api/index.ts:341) | [`custom-routes.ts`](custom-routes.ts:1) via [`server.tsx`](server.tsx:1) |
| Database | Turso (libSQL), raw SQL | SQLite via Prisma |
| Routing | One handler with explicit path matching | Hono route registration |

**Every API change must be made in both files.** The route sets are intended to
be identical; a route that exists only in production will appear to work in
deployment while breaking local development.

Requests that match no explicit route in `api/index.ts` are forwarded to the
platform backend with `PASS_HEADERS`, a small allow-list (content-type,
authorization, x-admin-token, origin, accept, accept-language). Those routes are
legacy and are being replaced by Turso-backed handlers.

`x-user-email` is deliberately **not** in the allow-list. It was the old identity
mechanism, and keeping it out means a request carrying that header is dropped at
the edge and can never reach a handler that might still trust it — even if the
legacy backend is replaced later.

---

## Project structure

```
api/index.ts                 Serverless API handler (auth, admin, content, books, proxy)
custom-routes.ts             Hono routes for local development (dev parity)
server.tsx                   Local dev server entry point
src/App.tsx                  SPA shell: router, session, enrollments, progress
src/lib/routes.ts            Page ↔ URL ↔ title/description table (single source of truth)
src/components/              UI components (Landing, CourseCatalog, AdminPanel, …)
src/lib/payment.ts           Payment contact details, account numbers, prices, steps
src/lib/api.ts               API base-URL helper
prisma/schema.prisma         Data model (SQLite / libSQL)
src/generated/               Generated Prisma client and typed route hooks
scripts/embed-books.mjs      Embeds paid book HTML into server/book-content.ts (runs on prebuild)
books/                       Paid book HTML — outside the static root, served only via the API
public/                      Static assets, including the three free books
vercel.json                  Rewrites: /api/(.*) → /api, plus the SPA fallback for deep links
```

`server/book-content.ts` is a **generated** artifact produced by
`scripts/embed-books.mjs` during `prebuild`. Do not edit it by hand.

---

## Routing

Pages are real URLs, not a string held in React state. Before this, every page
shared one address, so a refresh always dropped the student back on the landing
page, a course could not be linked to, and back/forward did nothing useful.

[`src/lib/routes.ts`](src/lib/routes.ts:1) is the **single source of truth**. It
exports one `Page` union and one table per concern:

| Export | Purpose |
| --- | --- |
| `Page` | The union of page identifiers used by the router and the nav bar |
| `PAGE_PATHS` | The URL pattern for each page |
| `PAGE_META` | Per-page `title` and meta `description` |
| `MATCHERS` | Ordered `path → page` list; `/courses/:courseId` is matched before `/courses` |
| `pageFromPath()` | Resolves `window.location.pathname` to `{ page, courseId, matched }` |
| `pathForPage()` | Builds a link target (nav bar, redirects) |
| `detectBasename()` | Returns the sub-path the app is served from, or `/` |

To add a page: add it to the `Page` union, then to `PAGE_PATHS`, `PAGE_META` and
`MATCHERS`, and finally render it in the `<Routes>` block in
[`src/App.tsx`](src/App.tsx:1). Nothing else needs to know about it.

### URLs

| Path | Page |
| --- | --- |
| `/` | Landing |
| `/courses` | Course catalog |
| `/courses/:courseId` | Course detail (deep-linkable) |
| `/dashboard` | Student dashboard |
| `/live-sessions` | Live sessions |
| `/ai-tools` | AI tools hub |
| `/books` | Book library |
| `/calculator` | Risk calculator |
| `/glossary` | Glossary |
| `/journal` | Trading journal |
| `/certificates` | Certificates |
| `/pricing` | Plans |
| `/subscribe?plan=STARTER` | Subscribe form, with the plan preselected |
| `/subscribe?plan=STARTER` | Subscribe form, with the plan preselected |
| `/legal` | Policies, refund terms and the trading-risk disclaimer |
| `/admin` | Admin panel |

Unknown paths redirect to `/`.

### Where the router is mounted

`BrowserRouter` is mounted in [`src/App.tsx`](src/App.tsx:1), **not** in
`src/main.tsx`. `src/main.tsx` is a platform-managed file: writes to it are
rejected, and the platform rewrites it on deploy, so a router placed there would
be silently reverted.

### Sub-path installs

`detectBasename()` inspects the first path segment. If it is a known page root
(`courses`, `pricing`, …) the app is being served from the domain root and the
basename is `/`. Otherwise the first segment is treated as the basename, which
keeps links correct when the app is served under a prefix such as a preview URL.

### Server configuration

`vercel.json` needs **both** rewrites, in this order:

1. `/api/(.*)` → `/api`, so the serverless handler receives the full original
   path in `req.url` and its route matching works.
2. `/((?!api/).*)` → `/index.html`, the SPA fallback. Without it, refreshing on
   `/courses/<id>` asks Vercel for a file that does not exist and returns 404.
   The negative lookahead keeps `/api/…` out of the fallback.

---

## Data model

Models in [`prisma/schema.prisma`](prisma/schema.prisma:1):

| Model | Purpose | Key constraints |
| --- | --- | --- |
| `User` | Students and admins, `plan`, `planExpiresAt`, hashed password | unique `email` |
| `StudentSession` | Server-issued student login sessions (hashed token, expiry, revocation) | indexed on `userId` |
| `AdminSession` | Server-issued admin sessions (hashed token, 12 h expiry, revocation) | unique `tokenHash` |
| `Course` | A course with `price`, `level`, `isPublished` | — |
| `Module` | Ordered grouping inside a course | belongs to `Course` |
| `Lesson` | A lesson with `videoUrl`, `content`, `isFree` | belongs to `Module` |
| `Enrollment` | Which user is enrolled in which course, plus `status` | unique `(userId, courseId)` |
| `Progress` | Per-user lesson completion | unique `(userId, lessonId)` |
| `LiveSession` | Scheduled session with `meetLink` | belongs to `Course` |
| `JournalEntry` | Private trade journal entry | belongs to `User` |
| `QuizResult` | Stored quiz scores | belongs to `User` |
| `PasswordResetToken` | Single-use reset tokens | belongs to `User` |
| `SubscriptionRequest` | Manual payment requests and receipts | belongs to `User` |

`Enrollment` and `Progress` both carry a composite unique key, which is what
makes the write endpoints idempotent (`ON CONFLICT … DO NOTHING` /
`DO UPDATE`).

---

## API surface

All routes are relative to `/api`. Writes that act on a student's own data are
scoped to the caller identified by the **server-issued session cookie**, never by
a value the browser can set. See [Authentication and sessions](#authentication-and-sessions).

### Authentication

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/auth/signup` | Creates a student account and issues a session cookie; passwords hashed with PBKDF2-SHA256 |
| `POST` | `/auth/login` | Verifies password, issues a session cookie, transparently rehashes legacy SHA-256 hashes |
| `GET` | `/auth/me` | Returns the caller resolved from their session cookie, or 401 |
| `POST` | `/auth/logout` | Revokes the current session row and clears the cookie |
| `POST` | `/auth/forgot-password` | Issues a single-use reset token and replies with a **generic** message either way |
| `POST` | `/auth/reset-password` | Consumes the token, sets the new password, then revokes every session for that identity |

Legacy unsalted SHA-256 hashes are still verifiable so existing students are not
locked out; they are upgraded to PBKDF2 on the next successful login.

### Content

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/courses` | Returns `{ items }`; published courses only |
| `GET` | `/courses/:id/detail` | Lessons passed through `gateLesson()`; returns `callerPlan`, `hasFullAccess`, `lessonCount`, `lockedLessonCount` |
| `GET` | `/dashboard` | Sessions with `meetLink` withheld unless the caller's plan qualifies |
| `GET` | `/books` | Book manifest with a `requiredPlan` per book |
| `GET` | `/books/:id/:file?` | Serves book HTML after a plan check; 403 lock page otherwise |

### Student data

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/enrollments` | The caller's own enrollments |
| `POST` | `/enrollments` | Enrolls the caller; idempotent; 403 for priced courses without a paid plan |
| `GET` | `/progress` | The caller's completion state, including the parent `courseId` |
| `POST` | `/progress` | Marks one lesson complete/incomplete, then recomputes the course status |
| `GET`/`POST`/`PATCH`/`DELETE` | `/journal` | Private journal entries |

Passing a plan **does not** unlock a paid course: `POST /enrollments` checks the
caller's plan from their own database record, so a tampered request is refused.

### Admin

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/admin/auth` | Creates a DB-backed admin session (12 h TTL) |
| `POST` | `/admin/logout` | Revokes the current session |
| `GET`/`POST`/`PATCH`/`DELETE` | `/admin/courses`, `/admin/modules/*`, `/admin/lessons/*` | Content CRUD |
| `GET`/`POST`/`PATCH`/`DELETE` | `/admin/sessions` | Live session CRUD |
| `PATCH` | `/admin/subscriptions/:id` | Approve or deactivate a plan |
| `GET` | `/admin/stats` | Overview counters |

Admin sessions are 32 random bytes stored only as a SHA-256 hash, with a 12-hour
expiry, and are revocable by deleting the row.

---

## Access control

Content gating is enforced in three layers, and the client is never trusted:

1. **Plan resolution.** `getCallerPlan()` resolves the caller from their session
   cookie, loads that user's own record, and applies `effectivePlan()` so
   expired plans are treated as `FREE`.
2. **Lesson gating.** `gateLesson()` strips `videoUrl` and `content` from
   lessons the caller may not access, but keeps the lesson object so the UI can
   render it as locked rather than hiding it.
3. **Book paywall.** Paid book HTML lives in [`books/`](books/) — outside the
   static root — and is embedded into the server bundle. It is served only
   through `/api/books/:id/:file`, after the plan check. A 30-minute signed
   cookie backs in-iframe chapter navigation, since chapter requests carry no
   custom headers.

The manifest is keyed by book ID, so a crafted path cannot be used for directory
traversal.

---

## Local development

Requires **Bun** (the dev server runs on Bash — see `package.json` scripts) and
Node.js for the build tooling.

```bash
bun install

# Start the Hono API server and the Vite client together
bun run dev:full

# Or run them separately
bun run dev:server   # API  (custom-routes.ts)
bun run dev:client   # SPA  (Vite)
```

Other useful scripts:

| Command | Purpose |
| --- | --- |
| `npm run build` | Production build (runs the book embed as `prebuild`) |
| `npm run books:embed` | Re-embed paid book HTML into `server/book-content.ts` |
| `npm run db:push` | Push the Prisma schema to the local SQLite database |
| `npm run db:studio` | Inspect the local database |
| `npm run db:generate` | Regenerate the Prisma client |

Because the API is split across two files, verify both after any route change:

```bash
npx tsc --noEmit --skipLibCheck --target es2022 --module esnext \
  --moduleResolution bundler --strict false api/index.ts custom-routes.ts

npm run build
```

Vite does not type-check `api/index.ts` or `custom-routes.ts`, so the explicit
`tsc` invocation is the only thing that catches errors in them.

---

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes (production) | Turso database URL; falls back to `file:./dev.db` locally |
| `DATABASE_AUTH_TOKEN` | Yes (production) | Turso auth token |
| `ADMIN_EMAIL` | Yes | The single admin account |
| `ADMIN_PASSWORD` | Yes | Admin password; also mixed into the default book-token secret |
| `BOOK_TOKEN_SECRET` | Recommended | Independent secret for the 30-minute book cookie |
| `EMAIL_PROVIDER` | Optional | `resend`, `postmark`, `sendgrid` or `smtp2go`. Auto-detected from the API-key variables when unset |
| `RESEND_API_KEY` *(`POSTMARK_SERVER_TOKEN`, `SENDGRID_API_KEY`, `SMTP2GO_API_KEY`)* | Optional | API key for the chosen provider; any one of these enables email |
| `EMAIL_API_KEY` | Optional | Generic key, used when the provider-specific variable is not set |
| `EMAIL_FROM` | Required for email | Verified sender, e.g. `TradeEd <no-reply@tradedu.pk>`. Email is skipped if this is missing |
| `EMAIL_REPLY_TO` | Optional | Reply-to address shown to the recipient |
| `APP_BASE_URL` | Recommended with email | Public site origin, e.g. `https://tradedu.pk`. Used to build the link inside the reset email |
| `ALLOW_TOKEN_IN_RESPONSE` | Dev only | `true` returns the password-reset token in the JSON body |

Set `BOOK_TOKEN_SECRET` explicitly in production. If it is unset, the book cookie
secret is derived from `ADMIN_PASSWORD`, which couples two unrelated concerns —
rotating the admin password would also invalidate every open book session.

### Email delivery

Password-reset codes are emailed by [`server/email.ts`](server/email.ts:1), which is
shared by both backends — [`api/index.ts`](api/index.ts:507) (Vercel) and
[`custom-routes.ts`](custom-routes.ts:698) (Bun). It talks to the provider over plain
HTTPS with `fetch`, so **no SDK or new dependency is required** in either runtime.

Pick one provider and set its key plus `EMAIL_FROM`:

| Provider | Set this | Get a key at |
| --- | --- | --- |
| Resend | `RESEND_API_KEY` | <https://resend.com/api-keys> |
| Postmark | `POSTMARK_SERVER_TOKEN` | <https://postmarkapp.com> → Server → API Tokens |
| SendGrid | `SENDGRID_API_KEY` | <https://app.sendgrid.com/settings/api_keys> |
| SMTP2GO | `SMTP2GO_API_KEY` | <https://app.smtp2go.com> → Settings → API Keys |

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM="TradeEd <no-reply@tradedu.pk>"
APP_BASE_URL=https://tradedu.pk
```

Behaviour, by design:

- **Opt-in.** With no key configured, `sendEmail()` returns `skipped` and the
  endpoint behaves exactly as before. Nothing breaks on a machine with no mail
  setup, and a warning is logged so the gap is visible in the deployment logs.
- **Never throws.** A provider outage or a bad key is logged and swallowed. The
  HTTP response is still the byte-identical generic message, so the endpoint
  cannot be used to enumerate registered accounts.
- **Sender verification.** `EMAIL_FROM` must be an address the provider has
  verified for your domain, or sends will be rejected. On Resend, verify the
  domain first and start with their sandbox sender while testing.
- **The email contains both a link and the code.** The link points at
  `/signin?email=…&resetToken=…`; [`Auth.tsx`](src/components/Auth.tsx:39) reads the
  code and immediately strips it from the URL with `replaceState`, so a single-use
  token does not sit in browser history or in a referrer header. The link does not
  auto-submit a new password — mail scanners follow links, and a URL that changed
  state on `GET` would burn the token before the student opened it.
- **Codes stay single-use and expire in one hour**, and every existing session for
  that identity is revoked on a successful reset.

### `ALLOW_TOKEN_IN_RESPONSE` — leave this unset in production

Earlier builds had no email provider wired up, so `/auth/forgot-password` returned
the reset token in its JSON response and the UI displayed it for the student to
copy. That is acceptable on a laptop and **not** acceptable in production: anyone
could request a reset for another person's address and read the token straight off
the response, taking over the account.

The route returns a **byte-identical generic response** whether or not the account
exists, and the token is included **only** when `ALLOW_TOKEN_IN_RESPONSE=true`.
That flag now exists purely so a developer can exercise the reset screen locally
without configuring a provider. Production must leave it unset — with a provider
configured, there is no reason to switch it on.

---

## Deployment

1. Push to the connected GitHub repository — Vercel builds on push.
2. `vercel.json` rewrites `/api/(.*)` to `/api`, so the handler receives the full
   original path in `req.url`. Keep this rewrite in place; without it the route
   matching in `api/index.ts` breaks.
3. `vercel.json` also contains the SPA fallback `/((?!api/).*)` → `/index.html`.
   Keep it in place as well; without it a direct visit or refresh on a client
   route such as `/courses/<id>` returns a 404. The lookahead ensures API calls
   are never swallowed by the fallback.
4. The `prebuild` script embeds all paid books, so `books/` and
   `server/book-content.ts` must both be committed.
5. Set every variable from the table above in the Vercel project settings.

---

## Maintenance tasks

**Adding or pricing a book**

1. Add the chapter HTML under `books/<book-id>/`.
2. Add the book ID to `BOOK_PLAN` in both [`api/index.ts`](api/index.ts:255) and
   [`custom-routes.ts`](custom-routes.ts:1168).
3. Books that should be free stay in `public/` and are listed in
   `STATIC_BOOK_DIRS`.
4. Re-run `npm run books:embed`.

**Adding a course or lesson** — use the admin panel. Modules and lessons are
created through the admin API, which is why the content pipeline no longer
requires direct database edits.

**Changing prices or account numbers** — edit
[`src/lib/payment.ts`](src/lib/payment.ts:1) only. `PLAN_CATALOG` is the single
source of truth: the pricing table, the locked-feature screens and the subscribe
form all read from it, so a price can no longer be correct on one page and wrong
on another. Changing an entry there updates every surface.

**Changing the policies** — edit [`src/components/Legal.tsx`](src/components/Legal.tsx:1).
The contact address shown there is imported from `src/lib/payment.ts`, so it
tracks the payment details automatically and cannot drift out of date.

**Resetting a password (owner)** — a password reset must be done from the server,
never by writing a password hash directly into the database. The reset flow marks
tokens single-use, expires them after an hour and revokes all sessions for the
account. If a student is locked out and email delivery is not yet configured, set
their temporary password through the admin flow rather than hand-editing a row.

---

## Authentication and sessions

Student identity is established by the **server**, not the browser.

1. `POST /auth/login` (or `/auth/signup`) verifies the password and creates a row
   in `student_sessions` — the token is 32 random bytes, and only its SHA-256
   hash is stored, so a database leak does not yield usable tokens.
2. The raw token is returned in an **HttpOnly** cookie (`SameSite=Lax`, `Secure`
   in production). Because it is HttpOnly, page scripts cannot read it, and
   because it is server-issued and signed into a hashed row, it cannot be forged
   by setting a header.
3. Every student-scoped route calls `getAuthenticatedUser()` to resolve the
   caller from that cookie. The resolved row — not anything from the request
   body or query string — decides which enrollments, progress records and journal
   entries the caller may touch.

Earlier revisions used an `x-user-email` request header for identity. Any visitor
could set that header to another student's address and read or write their data,
so the header was removed entirely; there is no longer any code path that trusts
a client-supplied identity.

`POST /auth/reset-password` also revokes every session for that identity, so
changing a password logs out any device that was already signed in — including an
attacker who had stolen a session.

---

## Security notes

- Passwords: PBKDF2-SHA256, 100,000 iterations, per-user salt
  (`pbkdf2$<iterations>$<salt>$<hash>`).
- Credential and token comparisons use a constant-time comparison.
- Student and admin sessions are server-issued random tokens stored only as
  SHA-256 hashes, delivered in HttpOnly cookies, with expiry and revocation.
  Passwords changed via the reset flow revoke all existing sessions.
- Password resets are single-use with a 1-hour expiry and return a generic
  response, so the endpoint cannot be used to discover which addresses are
  registered. Tokens are never returned in the response unless
  `ALLOW_TOKEN_IN_RESPONSE=true` (development only — see
  [Environment variables](#environment-variables)).
- Admin credentials are compared with a constant-time comparison; admin sessions
  live in the database, expire after 12 hours, and are revocable.
- The plan on a user record is the single source of truth; no client-supplied
  plan value is ever trusted.
- Book content is not present in the static bundle, so it cannot be fetched by
  guessing a URL.
- No payment gateway, no card data, and no third-party payment credentials are
  stored anywhere in this codebase.
