-- ============================================================================
-- 🎓 SAAS MULTI-CLIENTE - IDIOMAS AI
-- ============================================================================
-- Sistema para academies de idiomas que teach up to 40 idiomas
-- Arquitectura: Multi-tenant con clientes independientes
-- ============================================================================

-- ============================================================================
-- 1. PLANES DE SUSCRIPCIÓN
-- ============================================================================
create table if not exists public.subscription_plans (
    id text primary key,  -- 'free', 'basic', 'pro', 'enterprise'
    name text not null,
    description text,
    monthly_price_usd numeric(10,2) default 0,
    max_students integer default 10,
    max_concurrent_sessions integer default 5,
    features jsonb default '{}',
    is_active boolean default true,
    created_at timestamptz default now()
);

-- Planes por defecto
insert into subscription_plans (id, name, description, monthly_price_usd, max_students, max_concurrent_sessions, features) values
('free', 'Gratuito', 'Para pruebas y usuarios individuales', 0, 5, 2, '{"ai_tutor": true, "basic_analytics": true, "voice_mode": false}'),
('basic', 'Básico', 'Para academias pequeñas', 29, 25, 10, '{"ai_tutor": true, "basic_analytics": true, "voice_mode": true, "custom_greetings": false}'),
('pro', 'Profesional', 'Para academias medianas', 79, 100, 30, '{"ai_tutor": true, "full_analytics": true, "voice_mode": true, "custom_greetings": true, "whatsapp_integration": true}'),
('enterprise', 'Empresarial', 'Para grandes academias', 199, 500, 100, '{"ai_tutor": true, "full_analytics": true, "voice_mode": true, "custom_greetings": true, "whatsapp_integration": true, "api_access": true, "dedicated_support": true}')
on conflict (id) do nothing;

-- ============================================================================
-- 2. CLIENTES (Academias/Escuelas)
-- ============================================================================
create table if not exists public.clients (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    -- Identificación
    company_name text not null,
    slug text unique,  -- Para URLs personalizadas: miacademia.idiomasai.com
    website text,
    logo_url text,
    
    -- Contacto
    owner_name text not null,
    owner_email text not null,
    owner_phone text,
    
    -- Configuración de idiomas
    supported_languages text[] default array['en'],  -- Array de códigos: ['en', 'es', 'fr', 'de']
    default_language text default 'en',
    timezone text default 'UTC',
    
    -- Suscripción
    plan_id text references subscription_plans(id) default 'free',
    subscription_status text default 'active',  -- active, paused, cancelled, past_due
    subscription_started_at timestamptz,
    subscription_ends_at timestamptz,
    
    -- Personalización
    brand_color text default '#6366f1',
    custom_welcome_message text,
    custom_goodbye_message text,
    
    --.whatsapp (Evolution API)
    whatsapp_enabled boolean default false,
    whatsapp_instance_id text,
    whatsapp_api_key text,  -- Encriptar en producción
    
    -- AI Configuration
    ai_personality text default 'friendly',  -- friendly, formal, casual
    ai_level_preset text default 'adaptive',  -- adaptive, beginner_focused, advanced_only
    
    -- Estado
    is_active boolean default true,
    metadata jsonb default '{}'
);

-- Índice para búsquedas
create index idx_clients_slug on public.clients(slug);
create index idx_clients_owner_email on public.clients(owner_email);

-- ============================================================================
-- 3. IDIOMAS SOPORTADOS (Catálogo de 40 idiomas)
-- ============================================================================
create table if not exists public.languages (
    code text primary key,  -- 'en', 'es', 'fr', etc.
    name_es text not null,  -- Nombre en español
    name_en text not null,  -- Nombre en inglés
    name_native text not null,  -- Nombre en el propio idioma
    flag_emoji text,
    is_active boolean default true,
    is_beta boolean default false,
    voice_enabled boolean default true,
    created_at timestamptz default now()
);

-- Insertar 40 idiomas
insert into languages (code, name_es, name_en, name_native, flag_emoji, is_active, voice_enabled) values
('en', 'Inglés', 'English', 'English', '🇬🇧', true, true),
('es', 'Español', 'Spanish', 'Español', '🇪🇸', true, true),
('fr', 'Francés', 'French', 'Français', '🇫🇷', true, true),
('de', 'Alemán', 'German', 'Deutsch', '🇩🇪', true, true),
('it', 'Italiano', 'Italian', 'Italiano', '🇮🇹', true, true),
('pt', 'Portugués', 'Portuguese', 'Português', '🇵🇹', true, true),
('ru', 'Ruso', 'Russian', 'Русский', '🇷🇺', true, true),
('zh', 'Chino', 'Chinese', '中文', '🇨🇳', true, true),
('ja', 'Japonés', 'Japanese', '日本語', '🇯🇵', true, true),
('ko', 'Coreano', 'Korean', '한국어', '🇰🇷', true, true),
('ar', 'Árabe', 'Arabic', 'العربية', '🇸🇦', true, false),
('hi', 'Hindi', 'Hindi', 'हिन्दी', '🇮🇳', true, true),
('tr', 'Turco', 'Turkish', 'Türkçe', '🇹🇷', true, true),
('nl', 'Holandés', 'Dutch', 'Nederlands', '🇳🇱', true, true),
('pl', 'Polaco', 'Polish', 'Polski', '🇵🇱', true, true),
('sv', 'Sueco', 'Swedish', 'Svenska', '🇸🇪', true, true),
('da', 'Danés', 'Danish', 'Dansk', '🇩🇰', true, true),
('no', 'Noruego', 'Norwegian', 'Norsk', '🇳🇴', true, true),
('fi', 'Finlandés', 'Finnish', 'Suomi', '🇫🇮', true, true),
('el', 'Griego', 'Greek', 'Ελληνικά', '🇬🇷', true, true),
('he', 'Hebreo', 'Hebrew', 'עברית', '🇮🇱', true, false),
('th', 'Tailandés', 'Thai', 'ไทย', '🇹🇭', true, false),
('vi', 'Vietnamita', 'Vietnamese', 'Tiếng Việt', '🇻🇳', true, false),
('id', 'Indonesio', 'Indonesian', 'Bahasa Indonesia', '🇮🇩', true, false),
('ms', 'Malayo', 'Malay', 'Bahasa Melayu', '🇲🇾', true, false),
('cs', 'Checo', 'Czech', 'Čeština', '🇨🇿', true, false),
('sk', 'Eslovaco', 'Slovak', 'Slovenčina', '🇸🇰', true, false),
('hu', 'Húngaro', 'Hungarian', 'Magyar', '🇭🇺', true, false),
('ro', 'Rumano', 'Romanian', 'Română', '🇷🇴', true, false),
('uk', 'Ucraniano', 'Ukrainian', 'Українська', '🇺🇦', true, false),
('bg', 'Búlgaro', 'Bulgarian', 'Български', '🇧🇬', true, false),
('hr', 'Croata', 'Croatian', 'Hrvatski', '🇭🇷', true, false),
('sr', 'Serbio', 'Serbian', 'Српски', '🇷🇸', true, false),
('ca', 'Catalán', 'Catalan', 'Català', '🇪🇸', true, false),
('eu', 'Euskera', 'Basque', 'Euskara', '🇪🇸', true, false),
('gl', 'Gallego', 'Galician', 'Galego', '🇪🇸', true, false),
('ta', 'Tamil', 'Tamil', 'தமிழ்', '🇮🇳', true, false),
('bn', 'Bengalí', 'Bengali', 'বাংলা', '🇧🇩', true, false),
('pa', 'Punjabi', 'Punjabi', 'ਪੰਜਾਬੀ', '🇮🇳', true, false),
('fa', 'Persa', 'Persian', 'فارسی', '🇮🇷', true, false),
('ur', 'Urdu', 'Urdu', 'اردو', '🇵🇰', true, false)
on conflict (code) do nothing;

-- ============================================================================
-- 4. ESTUDIANTES POR CLIENTE
-- ============================================================================
create table if not exists public.client_students (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    client_id uuid references public.clients(id) on delete cascade not null,
    
    -- Información del estudiante
    email text,
    name text not null,
    phone text,
    
    -- Configuración de aprendizaje
    native_language text default 'es',
    target_language text not null,
    level text default 'A1',  -- A1, A2, B1, B2, C1, C2
    interests text[],
    learning_goals text,
    
    -- Progreso
    total_sessions integer default 0,
    total_messages integer default 0,
    streak_days integer default 0,
    last_session_at timestamptz,
    level_progress jsonb default '{"current": 0, "total": 100}',
    
    -- Estado
    is_active boolean default true,
    metadata jsonb default '{}',
    
    unique(client_id, email)
);

create index idx_client_students_client on public.client_students(client_id);
create index idx_client_students_email on public.client_students(email);

-- ============================================================================
-- 5. SESIONES DE CHAT
-- ============================================================================
create table if not exists public.chat_sessions (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    client_id uuid references public.clients(id) on delete cascade not null,
    student_id uuid references public.client_students(id) on delete cascade not null,
    
    -- Configuración de la sesión
    language text not null,
    level text default 'A1',
    mode text default 'tutor',  -- tutor, conversation, grammar, exam
    
    -- Contexto del AI
    system_prompt text,
    
    -- Estado
    status text default 'active',  -- active, completed, abandoned
    messages_count integer default 0,
    duration_seconds integer,
    
    metadata jsonb default '{}'
);

create index idx_chat_sessions_client on public.chat_sessions(client_id);
create index idx_chat_sessions_student on public.chat_sessions(student_id);

-- ============================================================================
-- 6. MENSAJES
-- ============================================================================
create table if not exists public.chat_messages (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    session_id uuid references public.chat_sessions(id) on delete cascade not null,
    student_id uuid references public.client_students(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete cascade not null,
    
    -- Contenido
    role text not null,  -- user, assistant
    content text not null,
    
    -- Feedback de AI
    correction text,
    tip text,
    
    -- Audio
    audio_url text,
    audio_duration_ms integer,
    
    -- Token usage
    input_tokens integer,
    output_tokens integer,
    cost_estimated numeric(10,6) default 0,
    
    metadata jsonb default '{}'
);

create index idx_messages_session on public.chat_messages(session_id);
create index idx_messages_client on public.chat_messages(client_id);
create index idx_messages_created on public.chat_messages(created_at);

-- ============================================================================
-- 7. SUSCRIPCIONES (Pagos)
-- ============================================================================
create table if not exists public.subscriptions (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    client_id uuid references public.clients(id) on delete cascade not null,
    plan_id text references subscription_plans(id) not null,
    
    -- Estado
    status text default 'active',  -- active, paused, cancelled, past_due
    current_period_start timestamptz not null,
    current_period_end timestamptz not null,
    
    -- Payment
    payment_method text,  -- stripe, paypal, manual
    payment_id text,  -- Stripe subscription ID
    
    cancel_at_period_end boolean default false,
    canceled_at timestamptz,
    
    metadata jsonb default '{}'
);

-- ============================================================================
-- 8. MÉTRICAS POR CLIENTE
-- ============================================================================
create table if not exists public.client_metrics (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    client_id uuid references public.clients(id) on delete cascade not null,
    
    -- Métricas diarias
    date date not null,
    active_students integer default 0,
    new_students integer default 0,
    total_sessions integer default 0,
    total_messages integer default 0,
    total_duration_seconds integer default 0,
    total_cost numeric(10,4) default 0,
    
    -- Detalle por idioma
    language_breakdown jsonb default '{}',
    
    unique(client_id, date)
);

create index idx_metrics_client_date on public.client_metrics(client_id, date desc);

-- ============================================================================
-- 9. CONFIGURACIÓN DE PERSONAS AI POR CLIENTE
-- ============================================================================
create table if not exists public.client_ai_personas (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    
    client_id uuid references public.clients(id) on delete cascade not null,
    
    name text not null,
    description text,
    language text not null,
    personality text default 'friendly',
    system_prompt text,
    
    is_default boolean default false,
    is_active boolean default true,
    
    metadata jsonb default '{}'
);

-- ============================================================================
-- 10. FUNCIONES ÚTILES (RPC)
-- ============================================================================

-- Obtener plan del cliente
create or replace function get_client_plan(client_uuid uuid)
returns text as $$
    select plan_id from public.clients where id = client_uuid;
$$ language sql security definer;

-- Verificar límite de estudiantes
create or replace function check_student_limit(client_uuid uuid)
returns jsonb as $$
declare
    plan_record record;
    current_students integer;
    max_allowed integer;
begin
    select sp.max_students into max_allowed
    from public.clients c
    join public.subscription_plans sp on c.plan_id = sp.id
    where c.id = client_uuid;
    
    select count(*) into current_students
    from public.client_students
    where client_id = client_uuid and is_active = true;
    
    return jsonb_build_object(
        'allowed', current_students < max_allowed,
        'current', current_students,
        'max', max_allowed
    );
end;
$$ language plpgsql security definer;

-- Obtener idiomas del cliente
create function get_client_languages(client_uuid uuid)
returns text[] as $$
    select supported_languages from public.clients where id = client_uuid;
$$ language sql security definer;

-- Incrementar contador de sesión
create or replace function increment_session_stats(
    student_uuid uuid,
    messages_count integer default 1,
    duration_secs integer default 0
)
returns void as $$
begin
    update public.client_students
    set 
        total_sessions = total_sessions + 1,
        total_messages = total_messages + messages_count,
        last_session_at = now(),
        streak_days = streak_days + 1
    where id = student_uuid;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS
alter table public.clients enable row level security;
alter table public.client_students enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.subscriptions enable row level security;
alter table public.client_metrics enable row level security;
alter table public.client_ai_personas enable row level security;

-- Políticas para clientes
create policy "Clients can view own data" on public.clients
    for select using (id in (
        select client_id from public.client_students 
        where email = auth.jwt()->>'email'
    ) or owner_email = auth.jwt()->>'email');

create policy "Service role can manage all clients" on public.clients
    for all using (auth.role() = 'service_role');

-- Políticas para estudiantes
create policy "Students can view own data" on public.client_students
    for select using (
        client_id in (
            select client_id from public.client_students 
            where email = auth.jwt()->>'email'
        )
    );

create policy "Service role can manage all students" on public.client_students
    for all using (auth.role() = 'service_role');

-- ============================================================================
-- 12. TABLA DE CONFIGURACIÓN DE NIVELES
-- ============================================================================
create table if not exists public.cefr_levels (
    level text primary key,  -- A1, A2, B1, B2, C1, C2
    name_es text not null,
    name_en text not null,
    description_es text,
    description_en text,
    min_hours integer,
    max_hours integer
);

insert into cefr_levels (level, name_es, name_en, description_es, description_en, min_hours, max_hours) values
('A1', 'Principiante', 'Beginner', 'Puedo entender y usar expresiones familiares.', 'I can understand and use familiar expressions.', 0, 60),
('A2', 'Elemental', 'Elementary', 'Puedo comunicarme en tareas rutinarias.', 'I can communicate in routine tasks.', 60, 120),
('B1', 'Intermedio', 'Intermediate', 'Puedo deal with most situations that arise while traveling.', 'I can deal with most situations that may arise while travelling.', 120, 240),
('B2', 'Intermedio Alto', 'Upper Intermediate', 'Puedo interact with a degree of fluency.', 'I can interact with a degree of fluency and spontaneity.', 240, 360),
('C1', 'Avanzado', 'Advanced', 'Puedo expresarme con fluidez y espontaneidad.', 'I can express myself fluently and spontaneously.', 360, 480),
('C2', 'Maestría', 'Proficiency', 'Puedo entender casi todo lo que escucho o leo.', 'I can understand with ease virtually everything heard or read.', 480, 999);

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================
