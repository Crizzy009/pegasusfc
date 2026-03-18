create table if not exists public.content (
  id text primary key,
  type text not null,
  status text not null,
  data jsonb not null,
  created_at bigint not null,
  updated_at bigint not null
);

create index if not exists idx_content_type_status on public.content (type, status);

alter table public.content enable row level security;

create policy "read published content"
on public.content
for select
using (status = 'published');
