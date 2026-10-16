# Verification record

Verified locally in Chromium on 16 October 2026 using the running Vite application.

- TypeScript and the production Vite build pass.
- Completed product → variant selection → cart → validated demo checkout → confirmation → account history.
- Cart quantity changes, removal, reload persistence, purchased-cart clearing, and empty-checkout guard passed.
- Required options blocked add-to-cart; Oatmeal / M / quantity 2 selected the corresponding actual hoodie photograph and persisted correctly.
- Category, character and price filters, empty-result recovery, search, ascending/descending sort and wishlist passed.
- Native mobile filter dialog trapped focus and restored it on Escape; the size guide also restored focus on close.
- Checkout required fields, malformed email and US ZIP validation blocked submission and focused the first error.
- Two $24.99 tees plus one $22.99 cap produced $72.97 subtotal; $77.97 standard and $84.97 express totals. Free standard shipping at $75+ passed.
- Double-clicking order submission created one demo order. Confirmation, variants, quantities and order history survived reload.
- Header search, mobile menu, scroll lock and Escape closing, and newsletter demo acknowledgment passed.
- Homepage and auxiliary routes had no horizontal overflow at 320, 768 and 1440 pixels. Catalog/product/commerce layouts were inspected at 390 and 1440 pixels.
- All page images loaded in the final screenshot captures. Final settled desktop/mobile captures cover home, shop, product, cart, checkout and confirmation.
- Independent visual review found and corrected an incomplete Apparel link, low-contrast small text, and a hat color label that contradicted its image. Earlier browser checks corrected product-wishlist and mobile-trash CSS specificity conflicts.

This verifies a browser-local frontend demo, not real payment processing, fulfillment, external emails, authentication, live inventory, server security or assistive-technology compatibility. Those services are not connected. Screenshots from this build are in the ignored `output/playwright/` directory.
