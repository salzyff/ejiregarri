# Ejire Onigarri

A responsive, dependency-free brand website with a forest-green, cream and terracotta visual direction. Illustrated packaging, bowl, basket and Nigerian-roots placeholders reuse the original Blaykik website’s CSS artwork, adapted for Ejire at the user's request. No generated raster imagery is included.

## Run locally

Open `dist/index.html` directly, or run `npm run dev` with Python 3 installed, then visit http://localhost:5173. No npm installation is needed. `npm run check` checks the JavaScript; `npm run build` verifies the deployable static output.

## Included

- Responsive desktop and mobile layout, collection, founder story, serving-idea tabs, souvenir section, FAQ and direct contacts.
- Persistent enquiry bag, adjustable quantities and removal, customer/location/preferences inputs, WhatsApp compose and email compose links. The site does not send messages automatically.
- Souvenir form collecting occasion, pack count, date and ideas; transfers the details into the order enquiry.
- Keyboard-accessible native dialogs, mobile navigation, tab controls, skip link and reduced-motion support.
- Vercel and Netlify deployment configuration. Deploy the `dist` folder with any static host.

## Before the business publicly launches this

This is a proposed website design, not a verified live inventory. Ask the owner to approve wording, contact information and enquiry routing. The listed phone comes from a public business directory; its WhatsApp availability has not been confirmed. Prices, specific varieties and pack sizes are deliberately requested through enquiries rather than invented. Bulk quantities remain a quote request. There is no payment processor, backend or order database.

Publicly sourced details:

- Founder and origin story: https://sheleadsafrica.org/fcmb-spotlight-on-taiwooludairo-founder-of-ejireonigarri/
- Phone, email and Ajah location: https://www.finelib.com/listing/Ejire-Onigarri/101360/
- Social profile and souvenir offering: https://www.instagram.com/ejireonigari/

`dist/config.js` contains the product enquiry catalogue and WhatsApp/email destinations. Phone, email and social links also appear in the visible HTML contact section, so update those in `dist/index.html` if the owner supplies new details. Copy is a new proposal; the wordmark is a proposed typographic treatment, not a supplied official logo.

## Placeholder artwork and real photographs

`dist/artwork.css` adapts the original CSS illustrations from `salzyff/blaykik-store/src/styles.css` and `src/main.jsx` (initial Blaykik website). These are reusable code illustrations, not AI-generated raster images or actual Ejire product photographs. The pouch and gift-pack wording uses Ejire’s brand. No Blaykik certifications or product claims were carried across.

The `.ejire-art` blocks in `dist/index.html` mark the placeholder positions. Replace the chosen block with a local `<img>` and meaningful `alt` text when approved photographs are available. Keep the surrounding layout classes. The serving tabs switch the three `[data-serving-art]` scenes in `dist/app.js`; update that handler when adding real photos. Add an approved social sharing image to the metadata before public launch.

## Repository

Source repository: https://github.com/salzyff/ejiregarri

Deploy the `dist/` directory. Vercel and Netlify configurations are included.
