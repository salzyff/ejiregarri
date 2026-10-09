# Ejire Onigarri

A responsive, dependency-free brand website with a forest-green, cream and terracotta visual direction. All photography areas use neutral placeholders at the user's request. No generated raster imagery is included.

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

## Add real photographs

The five `.photo-placeholder` blocks in `dist/index.html` mark the intended photo positions. Replace them with local `<img>` assets and meaningful `alt` text. Preserve the existing layout classes. For the serving-idea tabs, update the placeholder handling in `dist/app.js` to swap the corresponding real images. Add an approved social sharing image to the metadata before a public launch.

## Repository

Source repository: https://github.com/salzyff/ejiregarri

Deploy the `dist/` directory. Vercel and Netlify configurations are included.
