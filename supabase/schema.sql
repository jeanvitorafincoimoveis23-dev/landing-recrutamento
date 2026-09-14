create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  whatsapp text not null,
  email text,
  city text not null,
  age integer,
  experience_status text not null,
  start_availability text not null,
  motivation text not null,
  consent boolean not null default false,
  source text not null default 'landing-page'
);

alter table public.candidates enable row level security;

create index if not exists candidates_created_at_idx on public.candidates (created_at desc);
create index if not exists candidates_city_idx on public.candidates (city);

grant insert on table public.candidates to anon;

drop policy if exists "Anyone can submit a candidate application" on public.candidates;
create policy "Anyone can submit a candidate application"
  on public.candidates
  for insert
  to anon
  with check (true);

comment on table public.candidates is 'Candidaturas recebidas pela landing page de recrutamento.';
