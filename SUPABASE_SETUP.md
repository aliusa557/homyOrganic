# Supabase Setup Guide (one-time)

This connects your site to a free Supabase backend so you can manage products, value packs and orders from `/admin`.

## 1. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up / log in.
2. Click **New Project**. Pick any name/region and a database password (save it somewhere safe — you won't need it day-to-day).
3. Wait ~1-2 minutes for the project to finish provisioning.

## 2. Run the database schema

1. In your project, open **SQL Editor** (left sidebar) → **New query**.
2. Open [supabase/schema.sql](supabase/schema.sql) from this repo, copy its full contents, paste into the SQL editor, and click **Run**.
3. This creates the `products`, `bundles`, `orders`, `order_items` tables, turns on Row Level Security, and creates the public `product-images` storage bucket.

## 3. Load your existing products (optional but recommended)

1. Open a new query in the SQL Editor.
2. Open [supabase/seed.sql](supabase/seed.sql), copy its contents, paste, and click **Run**.
3. This inserts the 6 products and 4 value packs that used to be hardcoded in `js/products.js`, so your site keeps working immediately. You can edit/delete/replace them from the admin panel afterwards.

## 3b. Enable Settings (logo, hero, footer, theme colors)

1. Open a new query in the SQL Editor.
2. Open [supabase/site_settings.sql](supabase/site_settings.sql), copy its contents, paste, and click **Run**.
3. This creates the `site_settings` table pre-filled with your current logo, hero images/heading, footer text/contact info, and color theme, so nothing changes visually until you edit something in `admin/settings.html`.

## 3c. Enable order tracking for customers

1. Open a new query in the SQL Editor.
2. Open [supabase/track_order.sql](supabase/track_order.sql), copy its contents, paste, and click **Run**.
3. This creates a `track_order` function that lets a customer look up their order status on `track-order.html` using their Order ID + phone number (the only combination that works — this keeps other customers' orders private without needing an account/login).

## 3d. Enable promotional offers

1. Open a new query in the SQL Editor.
2. Open [supabase/offers.sql](supabase/offers.sql), copy its contents, paste, and click **Run**.
3. This creates the `offers` table used by `admin/offers.html` to run the rotating promo banner above the header. With no active offers, the banner just shows the default "Free Shipping..." text — nothing changes until you add one.

## 4. Create your admin login

1. Go to **Authentication → Users** (left sidebar).
2. Click **Add user → Create new user**.
3. Email: `rayusamajaat@gmail.com`. Set a password you'll remember. Leave "Auto Confirm User" checked.
4. Click **Create user**.

This is the only account that can log into `/admin` and make changes — Row Level Security blocks writes from everyone else.

## 5. Connect the site to your project

1. Go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.
3. Open [js/supabase-client.js](js/supabase-client.js) in this repo and replace the two placeholder values:

   ```js
   const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   ```

   The anon key is safe to publish in client-side code — Row Level Security (set up by `schema.sql`) is what actually controls access, not the secrecy of this key.

## 6. Try it out

1. Open `index.html` / `shop.html` — products should load from Supabase.
2. Add something to the cart and check out — the order should appear in Supabase's `orders`/`order_items` tables (and in `admin/orders.html`), and WhatsApp still opens as before.
3. Open `admin/login.html`, sign in with the account from step 4, and try adding/editing a product with an uploaded image.
4. Open `admin/settings.html` and try changing the hero heading or a theme color, save, then reload `index.html` to see it applied.
5. On `track-order.html`, enter the Order ID and phone number from the test order you just placed and confirm it shows the correct status.
6. Click a value pack on the homepage — it should open `bundle-detail.html` with the right details.
7. In `admin/offers.html`, add an offer linked to a product and activate it — the top bar on the site should now show it instead of the default text.

## Notes

- Everything runs on Supabase's free tier (500MB database, 1GB storage, 50k monthly active users) — more than enough for a small store.
- The `/admin` pages are static HTML with no server-side gate, but every write (and all order reads) require a valid Supabase login, so visiting the URLs without logging in doesn't expose or allow changing anything.
- To add more admin users later, repeat step 4 with a different email.
