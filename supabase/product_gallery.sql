-- Homy Organic - multiple images per product
-- Run this once in the Supabase SQL editor, after schema.sql.
-- Adds a gallery of extra images shown on the product detail page.
-- The existing `image` column stays the "cover" image used everywhere else
-- (product cards, cart, orders, offers banner) so nothing else needs to change.

alter table products add column if not exists images jsonb default '[]'::jsonb;
