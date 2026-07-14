-- Homy Organic - Supabase schema
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).

-- ============ PRODUCTS ============
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  category text not null,
  price numeric not null,
  old_price numeric,
  tag text,
  trademark boolean default false,
  size text,
  rating numeric default 5,
  review_count integer default 0,
  image text,
  description text,
  key_benefits jsonb default '[]'::jsonb,
  ingredients text,
  usage text,
  precautions jsonb default '[]'::jsonb,
  shelf_life text,
  quality jsonb default '[]'::jsonb,
  variants jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "Public can read active products"
  on products for select
  to anon
  using (is_active = true);

create policy "Authenticated can read all products"
  on products for select
  to authenticated
  using (true);

create policy "Authenticated can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Authenticated can update products"
  on products for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete products"
  on products for delete
  to authenticated
  using (true);

-- ============ BUNDLES ============
create table if not exists bundles (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  tag text,
  items jsonb default '[]'::jsonb,
  original_price numeric,
  price numeric not null,
  savings numeric,
  rating numeric default 5,
  review_count integer default 0,
  image text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table bundles enable row level security;

create policy "Public can read active bundles"
  on bundles for select
  to anon
  using (is_active = true);

create policy "Authenticated can read all bundles"
  on bundles for select
  to authenticated
  using (true);

create policy "Authenticated can insert bundles"
  on bundles for insert
  to authenticated
  with check (true);

create policy "Authenticated can update bundles"
  on bundles for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete bundles"
  on bundles for delete
  to authenticated
  using (true);

-- ============ ORDERS ============
create table if not exists orders (
  id bigint generated always as identity primary key,
  order_code text not null unique,
  customer_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  note text,
  payment_method text,
  subtotal numeric not null default 0,
  delivery numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

-- Customers can create an order at checkout, but cannot read/update/delete any order (including their own).
create policy "Public can create orders"
  on orders for insert
  to anon, authenticated
  with check (status = 'new');

create policy "Authenticated can read orders"
  on orders for select
  to authenticated
  using (true);

create policy "Authenticated can update orders"
  on orders for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete orders"
  on orders for delete
  to authenticated
  using (true);

-- ============ ORDER ITEMS ============
-- Linked to orders by order_code (not a DB foreign key) so the checkout page
-- can insert an order and its items in one round trip without needing to
-- read back the generated order id (the anon key has no SELECT access to orders).
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_code text not null references orders(order_code) on delete cascade,
  item_type text not null default 'product',
  item_id bigint,
  name text not null,
  variant_name text,
  price numeric not null default 0,
  quantity integer not null default 1,
  image text
);

create index if not exists order_items_order_code_idx on order_items(order_code);

alter table order_items enable row level security;

create policy "Public can create order items"
  on order_items for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated can read order items"
  on order_items for select
  to authenticated
  using (true);

create policy "Authenticated can update order items"
  on order_items for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete order items"
  on order_items for delete
  to authenticated
  using (true);

-- ============ STORAGE (product images) ============
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "Authenticated can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
