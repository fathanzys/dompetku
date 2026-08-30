-- ========================================================
-- FINCOMMAND / DOMPETKU - SUPABASE POSTGRESQL SCHEMA + RLS
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ACCOUNTS TABLE
create table public.accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null default 'bank',
  institution text,
  balance numeric(15, 2) not null default 0,
  currency text not null default 'IDR',
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Accounts
alter table public.accounts enable row level security;
create policy "Users can view their own accounts" on public.accounts for select using (auth.uid() = user_id);
create policy "Users can insert their own accounts" on public.accounts for insert with check (auth.uid() = user_id);
create policy "Users can update their own accounts" on public.accounts for update using (auth.uid() = user_id);
create policy "Users can delete their own accounts" on public.accounts for delete using (auth.uid() = user_id);

-- 2. CATEGORIES TABLE
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null default 'variable',
  is_essential boolean not null default true,
  icon text,
  color text default '#059669',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;
create policy "Users manage categories" on public.categories for all using (auth.uid() = user_id);

-- 3. INCOME SOURCES TABLE
create table public.income_sources (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  expected_amount numeric(15, 2) not null default 0,
  frequency text not null default 'monthly',
  destination_account_id uuid references public.accounts(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.income_sources enable row level security;
create policy "Users manage income sources" on public.income_sources for all using (auth.uid() = user_id);

-- 4. BUDGETS TABLE
create table public.budgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  period_year integer not null,
  period_month integer not null,
  planned_amount numeric(15, 2) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.budgets enable row level security;
create policy "Users manage budgets" on public.budgets for all using (auth.uid() = user_id);

-- 5. GOALS TABLE
create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  target_price numeric(15, 2) not null default 0,
  resale_value_expected numeric(15, 2) default 0,
  current_saved_amount numeric(15, 2) not null default 0,
  target_date date not null,
  priority integer default 1,
  is_emergency_fund boolean default false,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;
create policy "Users manage goals" on public.goals for all using (auth.uid() = user_id);

-- 6. TRANSACTIONS TABLE
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  account_id uuid references public.accounts(id) on delete cascade not null,
  target_account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  goal_id uuid references public.goals(id) on delete set null,
  type text not null,
  amount numeric(15, 2) not null,
  transaction_date date not null default CURRENT_DATE,
  description text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;
create policy "Users manage transactions" on public.transactions for all using (auth.uid() = user_id);
