# Homy Organic - Static Organic Store Website

This is a static HTML/CSS/JavaScript e-commerce website for organic skin-care and hair-care products, backed by a free [Supabase](https://supabase.com) project for products, value packs and orders, plus a built-in admin panel.

## Features

- MANA-inspired ivory, charcoal, botanical green, champagne-gold, soft rose, aqua and wooden organic theme
- Responsive modern design
- Product listing with search, category filter and sorting
- Product detail page
- Add to cart using localStorage
- Cart quantity update/remove
- Checkout form that opens WhatsApp **and** saves the order to Supabase
- Cash on Delivery, manual Easypaisa and manual JazzCash options
- Charming admin dashboard (`/admin`) to manage products, value packs, images and incoming orders
- No server/build step required - Supabase is used purely from client-side JS
- Ready for Cloudflare Pages, GitHub Pages, Netlify or any static hosting

## Admin panel & backend setup

Products, value packs and orders live in Supabase (free tier) instead of hardcoded files. One-time setup (create a Supabase project, run the schema/seed SQL, create your admin login, fill in your API keys) is documented in [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

Once configured, log in at `admin/login.html` to:
- Add/edit/delete products and value packs, including image uploads
- Toggle products active/inactive without deleting them
- View incoming orders and update their status (new / confirmed / shipped / delivered / cancelled)

## Important edits before launch

### 1. Change WhatsApp number

Open:

```text
js/main.js
```

Find:

```js
whatsappNumber: "923001234567",
```

Replace it with your WhatsApp number in international format.

Example:

```js
whatsappNumber: "923001112233",
```

Do not use `+` or spaces.

### 2. Change Easypaisa/JazzCash numbers

Open:

```text
js/main.js
```

Find:

```js
easypaisaNumber: "03XX-XXXXXXX",
jazzcashNumber: "03XX-XXXXXXX",
```

Replace them with your real payment numbers.

### 3. Edit products

Complete [SUPABASE_SETUP.md](SUPABASE_SETUP.md) once, then manage product names, prices, descriptions, categories and images from `admin/products.html` (no code edits needed).

### 4. Change brand name/logo

Open:

```text
assets/brand/homy-organic-logo.svg
```

or replace it with your own logo file.

## Run locally

Just open:

```text
index.html
```

in your browser.

For best results, use VS Code Live Server extension.

## Deploy free

Recommended:

- Cloudflare Pages
- GitHub Pages
- Netlify

Upload the full folder and set `index.html` as the homepage.

## Note

Products, value packs and orders are stored in Supabase (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)). Orders are also still sent to WhatsApp on checkout.

