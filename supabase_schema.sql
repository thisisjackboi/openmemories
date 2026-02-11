-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create a table for user profiles (stores couple details)
create table profiles (
  id uuid references auth.users not null primary key,
  partner1_name text,
  partner2_name text,
  start_date date default current_date
);

-- Create a table for memories
create table memories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  date date not null,
  location_name text,
  location_x float,
  location_y float,
  category text,
  note text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- Enable RLS
alter table profiles enable row level security;
alter table memories enable row level security;

-- Policies for profiles
create policy "Users can view their own profile" 
  on profiles for select 
  using ( auth.uid() = id );

create policy "Users can update their own profile" 
  on profiles for update 
  using ( auth.uid() = id );

create policy "Users can insert their own profile" 
  on profiles for insert 
  with check ( auth.uid() = id );

-- Policies for memories
create policy "Users can view their own memories" 
  on memories for select 
  using ( auth.uid() = user_id );

create policy "Users can insert their own memories" 
  on memories for insert 
  with check ( auth.uid() = user_id );

create policy "Users can update their own memories" 
  on memories for update 
  using ( auth.uid() = user_id );

create policy "Users can delete their own memories" 
  on memories for delete 
  using ( auth.uid() = user_id );
