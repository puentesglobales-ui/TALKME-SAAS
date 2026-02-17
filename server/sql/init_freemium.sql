-- 1. Create Profiles Table (if not exists)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  usage_count int default 0,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable RLS (Security)
alter table public.profiles enable row level security;

-- 3. Policies (Who can see/edit?)
-- Servers (Service Role) can do everything.
-- Users can see their own profile.
create policy "Users can view own profile" 
  on profiles for select 
  using ( auth.uid() = id );

-- 4. Trigger: Auto-create profile on SignUp
-- This ensures every new user gets a row with usage_count = 0
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, usage_count, is_premium)
  values (new.id, new.email, 0, false);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. RPC Function: Increment Usage (Server calls this safely)
create or replace function increment_usage(user_id uuid)
returns void as $$
begin
  update public.profiles
  set usage_count = usage_count + 1
  where id = user_id;
end;
$$ language plpgsql security definer;
