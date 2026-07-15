-- Homy Organic - promotional offers (rotating top-bar banner)
-- Run this once in the Supabase SQL editor, after schema.sql.

create table if not exists offers (
  id bigint generated always as identity primary key,
  message text not null,
  product_id bigint references products(id) on delete set null,
  bundle_id bigint references bundles(id) on delete set null,
  discount_percent numeric,
  custom_link text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table offers enable row level security;

create policy "Public can read active offers"
  on offers for select
  to anon
  using (is_active = true);

create policy "Authenticated can read all offers"
  on offers for select
  to authenticated
  using (true);

create policy "Authenticated can insert offers"
  on offers for insert
  to authenticated
  with check (true);

create policy "Authenticated can update offers"
  on offers for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete offers"
  on offers for delete
  to authenticated
  using (true);
