
-- Add avatar columns to profiles table
alter table profiles 
add column if not exists partner1_avatar text,
add column if not exists partner2_avatar text;

-- Create a storage bucket for avatars if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up storage policies for avatars bucket
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update an avatar"
  on storage.objects for update
  with check ( bucket_id = 'avatars' );
