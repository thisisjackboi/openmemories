-- Create a new storage bucket for memories
insert into storage.buckets (id, name, public) 
values ('memories', 'memories', true);

-- Policy: Allow authenticated users to upload files to 'memories' bucket
create policy "Authenticated users can upload memory photos"
on storage.objects for insert
with check (
  bucket_id = 'memories' and
  auth.role() = 'authenticated'
);

-- Policy: Allow public access to view memory photos (since they are in public bucket)
-- Or restrict to authenticated users if stricter privacy is needed.
-- For this app, let's keep it consistent: authenticated users can view.
create policy "Authenticated users can view memory photos"
on storage.objects for select
using (
  bucket_id = 'memories' and
  auth.role() = 'authenticated'
);
