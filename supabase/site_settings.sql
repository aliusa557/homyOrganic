-- Homy Organic - site settings (branding, hero, footer, theme)
-- Run this once in the Supabase SQL editor, after schema.sql and seed.sql.

create table if not exists site_settings (
  id smallint primary key default 1,
  brand_name text,
  logo_url text,
  logo_footer_url text,
  hero_heading text,
  hero_slides jsonb default '[]'::jsonb,
  footer_tagline text,
  footer_about text,
  whatsapp_number text,
  support_email text,
  easypaisa_number text,
  jazzcash_number text,
  social_instagram text,
  social_facebook text,
  social_tiktok text,
  theme jsonb default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

alter table site_settings enable row level security;

create policy "Public can read site settings"
  on site_settings for select
  to anon, authenticated
  using (true);

create policy "Authenticated can update site settings"
  on site_settings for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can insert site settings"
  on site_settings for insert
  to authenticated
  with check (true);

insert into site_settings (
  id, brand_name, logo_url, logo_footer_url, hero_heading, hero_slides,
  footer_tagline, footer_about, whatsapp_number, support_email,
  easypaisa_number, jazzcash_number, social_instagram, social_facebook, social_tiktok,
  theme
) values (
  1,
  'Homy Organic',
  'assets/brand/homy-organic-logo.webp',
  'assets/brand/homy-organic-logo-footer.webp',
  'Where Beauty Meets Wellness',
  '[
    {"image": "assets/hero-optimized/signature-hair-oil.webp", "alt": "Homy Organic Signature Hair Oil"},
    {"image": "assets/hero-optimized/pure-glow-tea.webp", "alt": "Homy Organic Pure Glow Tea"},
    {"image": "assets/hero-optimized/organic-ubtan-powder.webp", "alt": "Homy Organic Glass Glow Face Pack"},
    {"image": "assets/hero-optimized/herbal-spice-blend.webp", "alt": "Homy Organic Digest Well Powder"},
    {"image": "assets/hero-optimized/signature-spa-soak.webp", "alt": "Homy Organic Signature Spa Soak"}
  ]',
  'Where Beauty Meets Wellness',
  'All our products are carefully hand-blended in small batches to ensure maximum freshness, quality, and effectiveness.',
  '923023735860',
  'support@homyorganic.pk',
  '03XX-XXXXXXX',
  '03XX-XXXXXXX',
  'https://www.instagram.com/homyorganicpk?igsh=MzBiamtkYXJneW14',
  'https://web.facebook.com/homyorganicpk?rdid=8prHyIPi17E7Bhng&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F18uskoNihb%2F%3F_rdc%3D1%26_rdr',
  'https://www.tiktok.com/@homyorganic',
  '{
    "--pink": "#e6d2bf",
    "--soft-pink": "#f6ede0",
    "--rose": "#c89f7a",
    "--deep-rose": "#2b1c10",
    "--wood": "#e6c39b",
    "--cream": "#fdf4e2",
    "--page-bg": "#faf5ec",
    "--footer-bg": "#f7ead3",
    "--brown": "#15120f",
    "--muted": "#625b54",
    "--gold": "#b9853a",
    "--green": "#4f7a5b",
    "--green-soft": "#eaf3ec",
    "--aqua": "#f6f2eb",
    "--white": "#fffefb"
  }'
)
on conflict (id) do nothing;
