-- Homy Organic - order tracking for customers
-- Run this once in the Supabase SQL editor, after schema.sql.
--
-- Customers cannot SELECT from `orders`/`order_items` directly (see schema.sql),
-- so this SECURITY DEFINER function is the only way the public site can look up
-- an order - and only when the caller already knows both the order code AND the
-- phone number used at checkout, which prevents anyone from browsing other
-- customers' orders.

create or replace function track_order(p_order_code text, p_phone text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'order_code', o.order_code,
    'status', o.status,
    'customer_name', o.customer_name,
    'city', o.city,
    'subtotal', o.subtotal,
    'delivery', o.delivery,
    'total', o.total,
    'payment_method', o.payment_method,
    'created_at', o.created_at,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', oi.name,
        'variant_name', oi.variant_name,
        'price', oi.price,
        'quantity', oi.quantity,
        'image', oi.image
      ))
      from order_items oi
      where oi.order_code = o.order_code
    ), '[]'::jsonb)
  )
  into result
  from orders o
  where upper(o.order_code) = upper(trim(p_order_code))
    and regexp_replace(o.phone, '\D', '', 'g') = regexp_replace(p_phone, '\D', '', 'g')
  limit 1;

  return result;
end;
$$;

grant execute on function track_order(text, text) to anon, authenticated;
