-- ============================================================================
-- 🚀 STARTUP SAAS - CARACTERÍSTICAS AVANZADAS
-- ============================================================================
-- Este schema complementa saas_multi_cliente.sql
-- Agrega: Pagos, Gamificación, Marketplace, Certificados, Webhooks
-- ============================================================================

-- ============================================================================
-- 1. AUTH Y USUARIOS (Extiende el sistema)
-- ============================================================================

-- Tabla de usuarios del sistema (además de auth.users)
create table if not exists public.system_users (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    -- Relación con cliente (puede ser null si es super admin)
    client_id uuid references public.clients(id) on delete set null,
    
    -- Tipo de usuario
    role text not null default 'student',  -- super_admin, owner, teacher, student
    email text not null unique,
    name text not null,
    avatar_url text,
    
    -- Estado
    is_active boolean default true,
    last_login_at timestamptz,
    email_verified boolean default false,
    
    metadata jsonb default '{}'
);

create index idx_system_users_client on public.system_users(client_id);
create index idx_system_users_email on public.system_users(email);

-- ============================================================================
-- 2. PAGOS Y SUSCRIPCIONES (STRIPE)
-- ============================================================================

create table if not exists public.payments (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    client_id uuid references public.clients(id) on delete cascade not null,
    subscription_id uuid references public.subscriptions(id) on delete set null,
    
    -- Payment details
    stripe_payment_intent_id text unique,
    stripe_customer_id text,
    stripe_subscription_id text,
    
    amount integer not null,  -- En centavos
    currency text default 'usd',
    status text not null,  -- pending, succeeded, failed, refunded
    
    payment_method text,  -- card, paypal
    receipt_url text,
    
    invoice_pdf_url text,
    invoice_number text,
    
    metadata jsonb default '{}'
);

create index idx_payments_client on public.payments(client_id);
create index idx_payments_stripe on public.payments(stripe_payment_intent_id);

-- ============================================================================
-- 3. GAMIFICACIÓN
-- ============================================================================

-- Logros/Badges
create table if not public.achievements (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    code text unique not null,  -- 'first_session', 'streak_7', 'level_b1'
    name_es text not null,
    name_en text not null,
    description_es text,
    description_en text,
    
    icon text,  -- emoji o URL
    category text,  -- streak, progress, conversation, mastery
    
    points integer default 0,
    rarity text default 'common',  -- common, rare, epic, legendary
    
    requirement_type text,  -- sessions_count, streak_days, level, messages_count
    requirement_value integer,
    
    is_active boolean default true
);

-- Insertar logros por defecto
insert into achievements (code, name_es, name_en, description_es, description_en, icon, category, points, rarity, requirement_type, requirement_value) values
('first_session', 'Primera Clase', 'First Class', 'Completaste tu primera sesión', 'You completed your first session', '🎉', 'streak', 10, 'common', 'sessions_count', 1),
('streak_3', 'Racha de 3 días', '3 Day Streak', '3 días seguidos aprendiendo', '3 days in a row learning', '🔥', 'streak', 25, 'common', 'streak_days', 3),
('streak_7', 'Racha de 7 días', '7 Day Streak', 'Una semana completa', 'A full week', '💪', 'streak', 50, 'rare', 'streak_days', 7),
('streak_30', 'Racha de 30 días', '30 Day Streak', 'Un mes completo', 'A full month', '🏆', 'streak', 200, 'epic', 'streak_days', 30),
('messages_100', 'Conversador', 'Chatterbox', '100 mensajes enviados', '100 messages sent', '💬', 'conversation', 30, 'common', 'messages_count', 100),
('messages_500', 'Conversador Elite', 'Elite Chatterbox', '500 mensajes enviados', '500 messages sent', '🗣️', 'conversation', 100, 'rare', 'messages_count', 500),
('level_a2', 'Nivel A2', 'Level A2', 'Alcanzaste el nivel A2', 'You reached A2 level', '⭐', 'progress', 75, 'common', 'level', 2),
('level_b1', 'Nivel B1', 'Level B1', 'Alcanzaste el nivel B1', 'You reached B1 level', '🌟', 'progress', 150, 'rare', 'level', 3),
('level_c1', 'Nivel C1', 'Level C1', '¡Nivel avanzado!', 'Advanced level!', '👑', 'progress', 500, 'legendary', 'level', 5),
('perfect_score', 'Perfecto', 'Perfect Score', 'Sin errores en una sesión', 'No errors in a session', '💯', 'mastery', 40, 'rare', 'perfect_session', 1)
on conflict (code) do nothing;

-- Progreso del estudiante en logros
create table if not exists public.student_achievements (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    student_id uuid references public.client_students(id) on delete cascade not null,
    achievement_id uuid references public.achievements(id) on delete cascade not null,
    
    unlocked_at timestamptz default now(),
    progress integer default 0,  -- 0-100
    
    unique(student_id, achievement_id)
);

-- XP y Levels
alter table public.client_students add column if not exists xp integer default 0;
alter table public.client_students add column if not exists xp_level integer default 1;
alter table public.client_students add column if not exists streak_best integer default 0;

-- Tabla de XP por día (para estadísticas)
create table if not exists public.daily_xp (
    id uuid default gen_random_uuid() primary key,
    created_at date default current_date,
    
    student_id uuid references public.client_students(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete cascade not null,
    
    xp_earned integer default 0,
    sessions_completed integer default 0,
    messages_sent integer default 0,
    time_spent_seconds integer default 0,
    
    unique(student_id, created_at)
);

-- ============================================================================
-- 4. MARKETPLACE (Búsqueda de Academias)
-- ============================================================================

create table if not exists public.marketplace_listings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    client_id uuid references public.clients(id) on delete cascade not null unique,
    
    -- Listing details
    headline text not null,
    description text,
    short_description text,  -- 100 chars para cards
    
    -- Ubicación
    country text,
    city text,
    is_online boolean default true,
    
    -- Metadata
    languages text[],  -- Idiomas que enseñan
    price_range text,  -- '$', '$$', '$$$', '$$$$'
    
    -- Ratings
    rating_avg numeric(3,2) default 0,
    review_count integer default 0,
    
    -- Visibilidad
    is_published boolean default false,
    is_featured boolean default false,
    views_count integer default 0,
    
    -- SEO
    meta_title text,
    meta_description text
);

create index idx_marketplace_country on public.marketplace_listings(country);
create index idx_marketplace_languages on public.marketplace_listings using gin(languages);

-- Reseñas de academias
create table if not exists public.marketplace_reviews (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    listing_id uuid references public.marketplace_listings(id) on delete cascade not null,
    student_email text not null,  -- Anónimo
    
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    
    is_verified boolean default false,  -- Verificado si contrató
    is_published boolean default true
);

create index idx_reviews_listing on public.marketplace_reviews(listing_id);

-- ============================================================================
-- 5. CERTIFICADOS
-- ============================================================================

create table if not exists public.certificates (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    student_id uuid references public.client_students(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete cascade not null,
    
    -- Certificate details
    certificate_number text unique not null,
    course_name text not null,
    language text not null,
    level text not null,  -- A1, A2, B1, B2, C1, C2
    
    -- Fechas
    issued_at timestamptz default now(),
    valid_until timestamptz,  -- Null = perpetuo
    
    -- Evaluación
    total_hours integer,
    final_score numeric(5,2),
    evaluation text,  -- excellent, good, satisfactory
    
    -- Template
    template_id text default 'default',
    pdf_url text,
    
    metadata jsonb default '{}'
);

create index idx_certificates_student on public.certificates(student_id);
create index idx_certificates_number on public.certificates(certificate_number);

-- ============================================================================
-- 6. WEBHOOKS (Integraciones)
-- ============================================================================

create table if not exists public.webhooks (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    client_id uuid references public.clients(id) on delete cascade not null,
    
    name text not null,
    url text not null,
    events text[] not null,  -- ['student.created', 'session.completed', 'payment.succeeded']
    
    secret text not null,  -- Para verificar payloads
    is_active boolean default true,
    
    last_triggered_at timestamptz,
    last_status integer,  -- HTTP status del último webhook
    
    failure_count integer default 0,
    metadata jsonb default '{}'
);

create index idx_webhooks_client on public.webhooks(client_id);

-- Tipos de eventos disponibles
create table if not exists public.webhook_events (
    event text primary key,
    description_es text,
    description_en text,
    payload_schema jsonb
);

insert into webhook_events (event, description_es, description_en) values
('student.created', 'Nuevo estudiante registrado', 'New student registered'),
('student.updated', 'Estudiante actualizado', 'Student updated'),
('session.started', 'Sesión iniciada', 'Session started'),
('session.completed', 'Sesión completada', 'Session completed'),
('message.sent', 'Mensaje enviado', 'Message sent'),
('payment.succeeded', 'Pago exitoso', 'Payment succeeded'),
('payment.failed', 'Pago fallido', 'Payment failed'),
('subscription.created', 'Suscripción creada', 'Subscription created'),
('subscription.cancelled', 'Suscripción cancelada', 'Subscription cancelled'),
('achievement.unlocked', 'Logro desbloqueado', 'Achievement unlocked'),
('certificate.issued', 'Certificado emitido', 'Certificate issued')
on conflict (event) do nothing;

-- Log de webhooks enviados
create table if not exists public.webhook_logs (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    webhook_id uuid references public.webhooks(id) on delete cascade not null,
    event text not null,
    
    payload jsonb not null,
    response_status integer,
    response_body text,
    
    success boolean default false,
    retry_count integer default 0
);

-- ============================================================================
-- 7. ANALYTICS AVANZADO
-- ============================================================================

-- Funnel de conversión
create table if not exists public.analytics_funnel (
    id uuid default gen_random_uuid() primary key,
    created_at date default current_date,
    
    client_id uuid references public.clients(id) on delete cascade not null,
    
    stage text not null,  -- signup, first_session, return_1, return_3, subscription
    users_count integer default 0,
    
    unique(client_id, stage, created_at)
);

-- Retención diaria
create table if not exists public.analytics_retention (
    id uuid default gen_random_uuid() primary key,
    created_at date default current_date,
    
    client_id uuid references public.clients(id) on delete cascade not null,
    
    cohort_date date not null,  -- Fecha de registro
    day_number integer not null,  -- D0, D1, D2, D7, D30
    retained_count integer default 0,
    churned_count integer default 0,
    
    unique(client_id, cohort_date, day_number)
);

-- ============================================================================
-- 8. REPORTES PROGRAMADOS
-- ============================================================================

create table if not exists public.scheduled_reports (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    client_id uuid references public.clients(id) on delete cascade not null,
    
    name text not null,
    schedule text not null,  -- 'daily', 'weekly', 'monthly'
    format text default 'pdf',  -- pdf, csv, excel
    
    recipients text[],  -- Emails que reciben el reporte
    
    report_type text not null,  -- usage, students, financial, engagement
    metrics jsonb,  -- Qué métricas incluir
    
    is_active boolean default true,
    last_sent_at timestamptz,
    next_send_at timestamptz
);

-- ============================================================================
-- 9. NOTIFICACIONES
-- ============================================================================

create table if not exists public.notifications (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    user_id uuid references public.system_users(id) on delete cascade,
    client_id uuid references public.clients(id) on delete cascade,
    
    type text not null,  -- email, push, sms, in_app
    title text not null,
    message text not null,
    
    is_read boolean default false,
    sent_at timestamptz,
    
    metadata jsonb default '{}'
);

create index idx_notifications_user on public.notifications(user_id, is_read);

-- ============================================================================
-- 10. AUDIT LOG (Seguridad)
-- ============================================================================

create table if not exists public.audit_logs (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    user_id uuid,
    client_id uuid,
    
    action text not null,  -- login, logout, create, update, delete
    resource_type text,  -- student, client, payment
    resource_id uuid,
    
    ip_address text,
    user_agent text,
    
    changes jsonb,  -- Qué cambió
    metadata jsonb default '{}'
);

create index idx_audit_client on public.audit_logs(client_id, created_at desc);

-- ============================================================================
-- FUNCIONES RPC ADICIONALES
-- ============================================================================

-- Agregar XP a estudiante
create or replace function add_student_xp(
    student_uuid uuid,
    xp_amount integer
)
returns void as $$
declare
    current_xp integer;
    current_level integer;
    xp_for_next_level integer;
begin
    select xp, xp_level into current_xp, current_level
    from public.client_students where id = student_uuid;
    
    current_xp := coalesce(current_xp, 0) + xp_amount;
    xp_for_next_level := current_level * 100;  -- Formula simple: nivel * 100
    
    while current_xp >= xp_for_next_level loop
        current_xp := current_xp - xp_for_next_level;
        current_level := current_level + 1;
        xp_for_next_level := current_level * 100;
    end loop;
    
    update public.client_students
    set xp = current_xp, xp_level = current_level
    where id = student_uuid;
end;
$$ language plpgsql security definer;

-- Verificar y otorgar logros
create or replace function check_achievements(student_uuid uuid)
returns void as $$
declare
    student_record record;
    ach record;
begin
    select * into student_record from public.client_students where id = student_uuid;
    
    for ach in select * from public.achievements where is_active = true loop
        if exists (
            select 1 from public.student_achievements 
            where student_id = student_uuid and achievement_id = ach.id
        ) then
            continue;
        end if;
        
        case ach.requirement_type
            when 'sessions_count' then
                if student_record.total_sessions >= ach.requirement_value then
                    insert into public.student_achievements (student_id, achievement_id, progress, unlocked_at)
                    values (student_uuid, ach.id, 100, now())
                    on conflict do nothing;
                end if;
            when 'streak_days' then
                if student_record.streak_days >= ach.requirement_value then
                    insert into public.student_achievements (student_id, achievement_id, progress, unlocked_at)
                    values (student_uuid, ach.id, 100, now())
                    on conflict do nothing;
                end if;
            when 'messages_count' then
                if student_record.total_messages >= ach.requirement_value then
                    insert into public.student_achievements (student_id, achievement_id, progress, unlocked_at)
                    values (student_uuid, ach.id, 100, now())
                    on conflict do nothing;
                end if;
            else
                null;
        end case;
    end loop;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- RLS POLICIES ADICIONALES
-- ============================================================================

alter table public.system_users enable row level security;
alter table public.payments enable row level security;
alter table public.student_achievements enable row level security;
alter table public.certificates enable row level security;
alter table public.webhooks enable row level security;
alter table public.marketplace_listings enable row level security;

create policy "Owners can manage own users" on public.system_users
    for all using (client_id in (
        select id from public.clients where owner_email = auth.jwt()->>'email'
    ) or role = 'super_admin');

create policy "Public can view published marketplace" on public.marketplace_listings
    for select using (is_published = true);

create policy "Clients can manage own listings" on public.marketplace_listings
    for all using (client_id in (
        select id from public.clients where owner_email = auth.jwt()->>'email'
    ));

-- ============================================================================
-- FIN
-- ============================================================================
