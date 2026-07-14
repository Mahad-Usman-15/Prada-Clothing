# Revision 1 — Post-Launch Feature Additions

- [ ] API response pattern reviewed — `NextResponse.json` confirmed correct for Next 16, no change needed
- [ ] WooCommerce taxonomy filtered to 5 categories (boy-clothing, clothing, girl-clothing, men-clothing, women-clothing) and 4 tags (Trendy Wear, Best Seller, Shop Now, Fashion For All)
- [ ] Contact page email display updated to prada@clothing.com
- [ ] Search bar: debounced product-card suggestions dropdown with skeleton loading (new `/api/products/search` route)
- [ ] Promo popup: 5-second delayed 50%-off banner linking to /shop
- [ ] Explanation delivered: Stripe webhook purpose and idempotency
- [ ] Recommendations delivered: rate-limiting, caching, and Clerk route-protection gap
- [x] Storefront restricted site-wide to only the "clothing" category's 11 products (shop, home, search, product pages, checkout)
