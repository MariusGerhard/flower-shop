# FlowerShop

Angular 22 flower shop with Firebase (Auth, Firestore, Storage) and Angular Material 3.

## Setup

1. `pnpm install` (pnpm 12, Node 26: `npm install -g pnpm` once)
2. Copy `src/environments/environment.example.ts` to `src/environments/environment.ts` and fill in the
   Firebase web config (Firebase console → Project settings → General → Your apps). This file is git-ignored.
3. `pnpm start` and open http://localhost:4200/

## Tests

Unit tests run with [Vitest](https://vitest.dev) via the Angular `unit-test` builder (jsdom, no browser needed):

```bash
pnpm test                # watch mode
pnpm ng test --watch=false
```

Firebase is never called in tests: `src/testing/firebase-mock.ts` provides a test double of
`FirebaseService` (same signals, all methods are `vi.fn()`). Tests still need `src/environments/environment.ts`
to exist (copy the example file).

## Build & deploy

```bash
pnpm build             # output: dist/flower-shop/browser
firebase deploy        # hosting serves dist/flower-shop/browser
```

## Structure

- `src/app/shared/services/firebase.service.ts`: all Firebase access (modular JS SDK), auth state as signals
- `src/app/auth`: login, register, password reset, profile, `authGuard`
- `src/app/shop`: menu, bouquets (search, details, order, extras), custom flowers, my orders
- `src/app/admin`: control page with tabs for bouquets, orders and users
- `src/styles.scss`: Material 3 theme and small layout helpers (replace the old `@angular/flex-layout`)

Components are standalone, use signals and the built-in control flow (`@if`, `@for`, `@switch`),
routes are lazy loaded and the app runs zoneless.
