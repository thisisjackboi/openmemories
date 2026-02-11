-- Fix permissions for PROFILE updates and avatars

alter table profiles enable row level security;

-- 1. UPDATE Policy (Critical for Anniversary/Avatars)
drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile" 
  on profiles for update 
  using ( auth.uid() = id )
  with check ( auth.uid() = id );

-- 2. INSERT Policy
drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile" 
  on profiles for insert 
  with check ( auth.uid() = id );

-- 3. SELECT Policy
drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile" 
  on profiles for select 
  using ( auth.uid() = id );
