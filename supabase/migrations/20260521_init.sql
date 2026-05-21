create extension if not exists "pgcrypto";

create table if not exists inventory_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_date date,
  created_at timestamptz not null default now()
);

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  current_stock integer not null default 0,
  minimum_stock integer not null default 0,
  category_id uuid references inventory_categories(id) on delete set null,
  memo text,
  image_path text,
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table if not exists event_inventory_relations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  item_id uuid not null references inventory_items(id) on delete cascade,
  planned_qty integer not null default 1,
  created_at timestamptz not null default now(),
  unique (event_id, item_id)
);

create or replace view inventory_items_view as
select
  i.id,
  i.name,
  i.current_stock,
  i.minimum_stock,
  coalesce(c.name, '未分類') as category_name,
  count(r.id)::int as used_events_count,
  i.updated_at,
  i.memo,
  i.image_path as image_url
from inventory_items i
left join inventory_categories c on c.id = i.category_id
left join event_inventory_relations r on r.item_id = i.id
group by i.id, c.name;

alter table inventory_items enable row level security;
alter table inventory_categories enable row level security;
alter table events enable row level security;
alter table event_inventory_relations enable row level security;

create policy "authenticated can read/write categories" on inventory_categories for all to authenticated using (true) with check (true);
create policy "authenticated can read/write events" on events for all to authenticated using (true) with check (true);
create policy "authenticated can read/write items" on inventory_items for all to authenticated using (true) with check (true);
create policy "authenticated can read/write relations" on event_inventory_relations for all to authenticated using (true) with check (true);
