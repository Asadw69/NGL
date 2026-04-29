-- Create the messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  sender_name text,
  sender_token text not null,
  recipient_username text not null
);

-- Set up Row Level Security (RLS)
alter table messages enable row level security;

-- Allow anonymous inserts
create policy "Allow anonymous inserts"
on messages for insert
to anon
with check (true);

-- Allow users to read their own messages (if you add auth later)
-- For now, this is a public write-only table for recipients to read from their own dashboard
create policy "Allow public inserts" 
on messages for insert 
to public 
with check (true);
