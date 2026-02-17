-- 🏗️ SAAS MULTI-TENANT ARCHITECTURE FOR WHATSAPP
-- Run this in your Supabase SQL Editor

-- 1. Clients Table (The businesses paying you)
create table public.saas_clients (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    company_name text not null,
    owner_phone text, -- The admin's WhatsApp
    instance_id text unique, -- Evolution API instance ID
    api_key text, -- Evolution API token for this instance
    plan_type text default 'free', -- free, pro, enterprise
    status text default 'active', -- active, paused, disconnected
    settings jsonb default '{"human_delay": 2000, "bot_name": "Alex"}'::jsonb
);

-- 2. Chats Table (The end users talking to your clients)
create table public.saas_chats (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    client_id uuid references public.saas_clients(id) on delete cascade not null,
    user_phone text not null, -- The customer's phone number
    mode text default 'bot', -- 'bot' or 'human' (Takeover logic)
    last_message_at timestamp with time zone,
    metadata jsonb default '{}'::jsonb, -- Store temporary context here
    unique(client_id, user_phone)
);

-- 3. Messages Log (Optional, for analytics/history)
create table public.saas_messages (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    chat_id uuid references public.saas_chats(id) on delete cascade,
    direction text not null, -- 'in' (from user) or 'out' (from bot/agent)
    content text,
    type text default 'text' -- text, image, audio
);

-- Indexes for performance
create index idx_saas_clients_instance on public.saas_clients(instance_id);
create index idx_saas_chats_client_phone on public.saas_chats(client_id, user_phone);
