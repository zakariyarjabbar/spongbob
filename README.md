# Sponge World

A responsive SpongeBob-inspired merchandise storefront built with React, TypeScript, Vite, React Router and Lucide icons. The supplied seven-screen reference guides the cartoon lettering, underwater illustrations, yellow actions and shared commerce layouts.

## Run locally

Use Node.js 22 or newer with npm. The installed Vite version also supports Node.js 18 and 20.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check TypeScript and produce a static production build:

```sh
npm run build
npm run preview
```

The deployable files are in `dist/`. Routing uses URL hashes, so static hosting does not need a server-side route fallback.

## Experiences

| Route | Experience |
| --- | --- |
| `/#/` | Illustrated homepage, category and character links, featured collections |
| `/#/shop` | 22-product catalog with search, category/character/price filters, sorting and mobile filter drawer |
| `/#/product/:id` | Gallery, photographed color variants, size guide, quantity and wishlist |
| `/#/cart` | Persistent variant-aware cart, quantity controls and calculated totals |
| `/#/checkout` | Validated customer form, shipping choices and explicitly labeled demo order |
| `/#/order/:id` | Actual local order summary and shipping address |
| `/#/collections` | Themed collection browsing |
| `/#/characters` | Character collections |
| `/#/account` | This browser’s demo order history and favorites |
| `/#/about` | Store context, demo limitations and help information |

All product data lives in `src/data/products.ts`; shared state lives in `src/state/Store.tsx`. Product prices are USD values, with calculations performed in integer cents. Standard demo shipping costs $5, or $0 for subtotals of $75 or more; express costs $12.

Cart, wishlist and up to 30 demo orders persist in versioned local storage under `sponge-world-store`. Invalid or outdated saved values are discarded. Order contact/address information stays in that browser’s local storage; use sample information for testing. Clear the site’s browser storage to reset the demo. Newsletter signup only acknowledges the current visit and does not send or store a subscription.

## Production boundaries

This is a complete frontend demo. Account history is local browser state; there is no authentication, backend, live inventory, payment processing, fulfillment, shipping/tracking integration or email delivery. No raw card details are requested and placing an order does not move money or dispatch goods. A public store needs server-authoritative pricing, stock and order storage, secure payment-provider integration and real policies/services.

Product photography and character artwork are replaceable demonstration assets. The project is unaffiliated with Nickelodeon or Paramount. Review `ASSETS.md`, obtain appropriate rights and replace or license imagery before commercial use. `DESIGN.md` and `.impeccable/design.json` record the implemented visual system.

## Social link preview

Sharing uses static Open Graph and Twitter large-image-card metadata in `index.html`, so crawlers do not need JavaScript. The preview is `public/social/sponge-world-preview-v1.jpg`: a 1200 × 630 JPEG, around 178 KB. The editable branded artwork is in `scripts/social-card.html`; while Vite runs, open `/scripts/social-card.html` at 1200 × 630 and export a JPEG at that exact size to regenerate it. It reuses the site's existing typography and artwork.

Share the deployed HTTPS URL, not `localhost`. Social crawlers need unauthenticated public access to both the page and image. `robots.txt` allows crawling. Page fragments (`#/shop`, `#/product/...`) are not sent to the server, so all routes share this website-wide card. Product-specific previews would need real server paths or prerendered pages.

Platforms choose whether and where to show previews. Open Graph and Twitter tags cover common link-card formats, but cannot force every Instagram surface or override Discord/user preview settings. Platforms may cache older cards; use the platform's re-scrape/debug tool when available. For future artwork changes, use a new image filename and update all matching metadata URLs together.
