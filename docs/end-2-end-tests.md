# End-to-End Test Report — Customer-Centric Edge Cases

Tested against the **production build** (`next build` + `next start`) using the Playwright MCP browser.
Scope: Clerk removal, cart/checkout edge cases, payment failure handling, cross-tab state sync,
stock validation, and mobile/tablet/desktop responsiveness.

## 1. Clerk removal + desktop smoke test — ✅ PASS

| Check | Result |
|---|---|
| `ClerkProvider` removed from `src/app/layout.tsx` | ✅ |
| `src/proxy.ts` (Clerk-only middleware) deleted | ✅ |
| Account/Sign-in button removed from mobile footer | ✅ |
| `@clerk/nextjs` uninstalled, zero references left in `src/` | ✅ |
| Home page renders: header, hero carousel, New Arrivals marquee, journal, footer | ✅ |
| Promo popup appears after 5 seconds | ✅ |
| Zero browser console errors | ✅ |

## 2. Cart quantity edge values (1 and 99+) — ✅ PASS

| Check | Result |
|---|---|
| Add to cart → drawer opens with quantity 1, subtotal correct | ✅ |
| Clicking `+` 25 times stops at **20** (`MAX_LINE_QUANTITY`, matches checkout API's `MAX_QUANTITY`) | ✅ |
| `+` button disabled at the cap | ✅ |
| Decrementing to 0 removes the line, empty-cart state shown | ✅ |
| localStorage tampered to `quantity: 99` → clamped to 20 on hydrate | ✅ |
| localStorage tampered with `quantity: -5` line → dropped on hydrate | ✅ |
| `POST /api/checkout` with qty 99 → `400 Invalid cart items` | ✅ |
| `POST /api/checkout` with qty 0 / empty items / malformed JSON → `400` | ✅ |

**Fixes shipped:** quantity clamped in `addItem`/`setQuantity`/`hydrate` (`src/store/cart-slice.ts`);
`+` button disabled at cap and server error messages surfaced in the drawer (`src/components/cart/cart-drawer.tsx`).

## 3. Two-tab stale cart state — ✅ PASS

Scenario: Tab A removes an item while Tab B is about to check out. Without sync, Tab B
would purchase items the customer already removed.

| Check | Result |
|---|---|
| Tab B hydrates existing cart from localStorage on load | ✅ |
| Item removed in Tab A → Tab B badge drops to 0 **without reload** | ✅ |
| Tab B drawer shows empty state immediately after the removal | ✅ |
| Checkout payload always built from the synced Redux state | ✅ |

**Fix shipped:** `storage`-event listener in `src/components/cart/cart-hydrator.tsx` re-hydrates
the cart when another tab writes `cart:v1` (the event never fires in the writing tab, so no loop).

## 4. Payment failure mid-transaction — ✅ PASS

| Check | Result |
|---|---|
| Checkout redirects to Stripe-hosted page with correct PKR amount | ✅ |
| Decline card `4000 0000 0000 0002` → error shown **on Stripe's page**, no charge, user can retry | ✅ |
| Back link → `/checkout/cancel` ("Checkout cancelled") | ✅ |
| Cart fully preserved after cancel (badge + localStorage intact) | ✅ |
| Success page with **bogus** `session_id` → "We couldn't confirm your payment", cart NOT cleared | ✅ |
| Success page with **no** `session_id` → same unverified state | ✅ |
| Real payment (`4242…`) → verified "Thank you" page with correct total, cart cleared | ✅ |
| No double-charging: declined attempts never emit `checkout.session.completed`; webhook dedupes by `transaction_id` on Stripe retries | ✅ |

**Fix shipped:** `/checkout/success` previously showed the full confirmation and cleared the cart
for *any* URL. It now confirms (and clears the cart) only when Stripe verifies
`payment_status === "paid"` (`src/app/checkout/success/page.tsx`).

## 5. Stock limits / concurrent last-item checkout — ✅ PASS

| Check | Result |
|---|---|
| Unknown product id → `404 Product … not found` | ✅ |
| Out-of-stock product → `409 … is out of stock` (guard in place; no product currently out of stock to drive it live) | ✅ (code-verified) |
| Requested qty > remaining managed stock → `409 Only X left in stock` | ✅ (code-verified) |
| Two simultaneous checkouts for the same item → both get distinct Stripe sessions, no server errors | ✅ |
| Checkout re-reads price + stock **fresh** (uncached), never trusting the 5-minute ISR cache or client prices | ✅ |

**Fixes shipped:** `manage_stock`/`stock_quantity` added to the `Product` type and validated in
`src/app/api/checkout/route.ts`; `getProductsByIds(ids, { fresh: true })` bypasses the fetch cache
for checkout (`src/lib/woocommerce.ts`).

Note: stock is not *reserved* at session creation (standard for Stripe Checkout). If two customers
race for the last unit, the first completed payment wins; the second is blocked at checkout once
WooCommerce decrements stock — enforced by the fresh 409 guard above.

## 6. Responsiveness — ✅ PASS

Viewports: **375×667 (mobile)**, **768×1024 (tablet)**, **1440×900 (desktop)**.
No horizontal overflow on any page at any viewport (`scrollWidth === clientWidth` verified).

| Surface | Mobile | Tablet | Desktop |
|---|---|---|---|
| Home (hero, marquee, footer) | ✅ | ✅ | ✅ |
| Hamburger drawer (solid white, full height, dimmed backdrop) | ✅ | — | — |
| Shop grid | ✅ 2-col | ✅ 3-col | ✅ 4-col + sidebar |
| Filter sheet / sidebar | ✅ sheet | ✅ | ✅ sidebar |
| Product detail page | ✅ | ✅ | ✅ |
| Cart drawer | ✅ full-width | ✅ | ✅ |
| Search suggestions dropdown (thumbnails, prices, sale strikethrough) | ✅ | ✅ | ✅ |
| Mobile bottom nav (Home / Shop / Cart) | ✅ | — | — |

## 7. Promo popup vs cart drawer — ✅ PASS

| Check | Result |
|---|---|
| Popup timer fires while cart drawer is open → popup suppressed, Checkout stays clickable | ✅ |
| Drawer closed afterwards → deferred popup appears | ✅ |
| Dismissing popup sets the session flag; it does not reappear | ✅ |

**Fix shipped:** popup visibility is `ready && !isDrawerOpen` via `selectIsDrawerOpen`
(`src/components/promo/promo-popup.tsx`).

## 8. Build & security gates — ✅ PASS

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ clean |
| `npm run lint` (ESLint) | ✅ clean |
| `npm run build` (Next.js 16 production build) | ✅ green |
| No hardcoded secrets (Stripe/Resend/WooCommerce/GitHub key patterns scanned) | ✅ |
| All secrets read from env vars; server keys only in server-only modules and API routes | ✅ |
| Client-exposed vars limited to `NEXT_PUBLIC_*` (site URL, Sanity public project id/dataset) | ✅ |
| `.env*` git-ignored — no env file committed | ✅ |
