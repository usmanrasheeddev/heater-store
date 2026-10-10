# Portable heater storefront

Source for a mobile-first single-page COD shop. Built with React/Vinext and a Cloudflare D1 order database.

## Confirmed catalog
- 12 inch RB dish heater: PKR 1,199 (previous PKR 1,399), white RB image, 300W / 600W.
- Panasonic pedestal: PKR 6,500 (previous PKR 8,000), tall pedestal image, light panel and moving function.
- Delivery across Pakistan: PKR 250 per order.
- Cash on Delivery; 3-month money-back guarantee.
- WhatsApp / call: +92 304 4993095.

The separate black tabletop photograph is intentionally not associated with either product. Optimized copies are retained but not loaded by the page. No energy-saving, safety-switch or 200-square-metre coverage claim is made. Panasonic wattage, precise dimensions, delivery estimates and detailed return conditions remain unconfirmed.

## Editing
`app/catalog.ts` is the authoritative server/client catalog. Monetary values use integer paisa. `app/page.tsx` contains store copy and interactions. `app/globals.css` contains responsive styling. `app/api/orders/route.ts` validates orders and calculates totals on the server, then saves to D1. It never accepts prices sent by the browser.

`db/schema.ts` and generated `drizzle/` migrations define durable orders. Production deployment provisions DB and applies migrations. Local and hosted order data are separate. Customer details are not exposed by a public read endpoint. The order table stores status `received`; fulfillment, courier booking and outbound notifications are not automated. The owner can retrieve order records through authorized database administration.

## Running
Node 22.13+ required. Install with `npm run install:ci`, start with `npm run dev`, build with `npm run build`. On Windows, if the npm shell wrapper fails, use the installed npm JavaScript entrypoint with Node. Generate migrations with `npm run db:generate`.

## Before advertising
The first Sites deployment is owner-private. Public audience access must be enabled before sending ad traffic. Verify the production order path with a clearly labeled test order. Confirm estimated delivery time, return eligibility, return shipping charges and refund timing; the page currently asks customers to contact the seller for these details. Confirm the business/store name if a brand beyond the generic “room / heaters” label is desired.

## Images and performance
Supplied images have 480px and 960px WebP variants. The hero is prioritized; other images load lazily. Fonts are local system fonts. No ad pixels, trackers, external font files, animation packages or UI library imports are used by the page.
