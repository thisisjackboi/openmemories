-- Fix permissions for MEMORIES (CRUD)
alter table memories enable row level security;

-- 1. DELETE Policy (Critical for your request)
drop policy if exists "Users can delete their own memories" on memories;
create policy "Users can delete their own memories"
  on memories for delete
  using ( auth.uid() = user_id );

-- 2. INSERT Policy
drop policy if exists "Users can insert their own memories" on memories;
create policy "Users can insert their own memories" 
  on memories for insert 
  with check ( auth.uid() = user_id );

-- 3. SELECT Policy
drop policy if exists "Users can view their own memories" on memories;
create policy "Users can view their own memories" 
  on memories for select 
  using ( auth.uid() = user_id );

-- 4. UPDATE Policy
drop policy if exists "Users can update their own memories" on memories;
create policy "Users can update their own memories" 
  on memories for update 
  using ( auth.uid() = user_id );
