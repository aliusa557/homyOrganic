# Homy Organic - Static Organic Store Website

This is a complete static HTML/CSS/JavaScript e-commerce website for organic skin-care and hair-care products.

## Features

- MANA-inspired ivory, charcoal, botanical green, champagne-gold, soft rose, aqua and wooden organic theme
- Responsive modern design
- 15 products included
- Product listing with search, category filter and sorting
- Product detail page
- Add to cart using localStorage
- Cart quantity update/remove
- Checkout form
- WhatsApp order message generation
- Cash on Delivery, manual Easypaisa and manual JazzCash options
- No backend required
- Ready for Cloudflare Pages, GitHub Pages, Netlify or any static hosting

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

Open:

```text
js/products.js
```

Update product names, prices, descriptions, categories and images.

### 4. Change brand name/logo

Open:

```text
assets/brand/homy-organic-logo.webp
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

This website does not use backend/database. Orders are processed through WhatsApp only.

