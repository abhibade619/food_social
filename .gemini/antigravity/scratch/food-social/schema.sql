-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for logs
create table logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  restaurant_name text not null,
  location text,
  cuisine text,
  visit_type text,
  rating_food text,
  rating_service text,
  rating_ambience text,
  rating_value text,
  rating_packaging text,
  rating_store_service text,
  return_intent text,
  content text,
  image_url text,
  visit_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table logs enable row level security;

create policy "Logs are viewable by everyone."
  on logs for select
  using ( true );

create policy "Users can insert their own logs."
  on logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own logs."
  on logs for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own logs."
  on logs for delete
  using ( auth.uid() = user_id );

-- Create a table for tagged friends
create table tagged_users (
  id uuid default uuid_generate_v4() primary key,
  log_id uuid references logs(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table tagged_users enable row level security;

create policy "Tagged users are viewable by everyone."
  on tagged_users for select
  using ( true );

create policy "Users can tag others in their logs."
  on tagged_users for insert
  with check ( exists ( select 1 from logs where id = log_id and user_id = auth.uid() ) );

-- Create a table for follows
create table follows (
  follower_id uuid references profiles(id) not null,
  following_id uuid references profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

alter table follows enable row level security;

create policy "Follows are viewable by everyone."
  on follows for select
  using ( true );

create policy "Users can follow others."
  on follows for insert
  with check ( auth.uid() = follower_id );

create policy "Users can unfollow others."
  on follows for delete
  using ( auth.uid() = follower_id );
