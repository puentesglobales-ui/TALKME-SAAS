// multiTenantService.js - Servicio Multi-Cliente SaaS
const { createClient } = require('@supabase/supabase-js');

let supabaseAdmin = null;

const initService = (supabaseUrl, supabaseKey) => {
    if (supabaseUrl && supabaseKey) {
        supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    }
};

const getClientById = async (clientId) => {
    if (!supabaseAdmin) return null;
    const { data, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
    return error ? null : data;
};

const getClientBySlug = async (slug) => {
    if (!supabaseAdmin) return null;
    const { data, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('slug', slug)
        .single();
    return error ? null : data;
};

const getClientPlan = async (clientId) => {
    if (!supabaseAdmin) return null;
    const { data: client, error } = await supabaseAdmin
        .from('clients')
        .select('plan_id, subscription_status')
        .eq('id', clientId)
        .single();
    
    if (error || !client) return null;
    
    if (client.subscription_status !== 'active') {
        return { ...client, plan: null, error: 'subscription_inactive' };
    }
    
    const { data: plan } = await supabaseAdmin
        .from('subscription_plans')
        .select('*')
        .eq('id', client.plan_id)
        .single();
    
    return { ...client, plan };
};

const checkStudentLimit = async (clientId) => {
    if (!supabaseAdmin) return { allowed: true, current: 0, max: 5 };
    
    const { data: client } = await supabaseAdmin
        .from('clients')
        .select('plan_id')
        .eq('id', clientId)
        .single();
    
    if (!client) return { allowed: true, current: 0, max: 5 };
    
    const { data: plan } = await supabaseAdmin
        .from('subscription_plans')
        .select('max_students')
        .eq('id', client.plan_id)
        .single();
    
    const { count } = await supabaseAdmin
        .from('client_students')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .eq('is_active', true);
    
    const allowed = count < (plan?.max_students || 5);
    return { allowed, current: count || 0, max: plan?.max_students || 5 };
};

const checkSessionLimit = async (clientId) => {
    if (!supabaseAdmin) return { allowed: true, current: 0, max: 10 };
    
    const { data: client } = await supabaseAdmin
        .from('clients')
        .select('plan_id')
        .eq('id', clientId)
        .single();
    
    if (!client) return { allowed: true, current: 0, max: 10 };
    
    const { data: plan } = await supabaseAdmin
        .from('subscription_plans')
        .select('max_concurrent_sessions')
        .eq('id', client.plan_id)
        .single();
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .eq('status', 'active')
        .gte('created_at', oneHourAgo);
    
    const max = plan?.max_concurrent_sessions || 10;
    const allowed = (count || 0) < max;
    return { allowed, current: count || 0, max };
};

const getClientLanguages = async (clientId) => {
    if (!supabaseAdmin) return ['en'];
    
    const { data: client } = await supabaseAdmin
        .from('clients')
        .select('supported_languages, default_language')
        .eq('id', clientId)
        .single();
    
    if (!client) return ['en'];
    
    return {
        supported: client.supported_languages || ['en'],
        default: client.default_language || 'en'
    };
};

const getLanguagesCatalog = async () => {
    if (!supabaseAdmin) return [];
    const { data } = await supabaseAdmin
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('name_es');
    return data || [];
};

const getStudentById = async (studentId) => {
    if (!supabaseAdmin) return null;
    const { data, error } = await supabaseAdmin
        .from('client_students')
        .select('*')
        .eq('id', studentId)
        .single();
    return error ? null : data;
};

const createStudent = async (clientId, studentData) => {
    if (!supabaseAdmin) return { error: 'DB not connected' };
    
    const limitCheck = await checkStudentLimit(clientId);
    if (!limitCheck.allowed) {
        return { error: 'student_limit_reached', ...limitCheck };
    }
    
    const { data, error } = await supabaseAdmin
        .from('client_students')
        .insert([{ client_id: clientId, ...studentData }])
        .select()
        .single();
    
    return { data, error };
};

const updateStudent = async (studentId, updates) => {
    if (!supabaseAdmin) return { error: 'DB not connected' };
    
    const { data, error } = await supabaseAdmin
        .from('client_students')
        .update(updates)
        .eq('id', studentId)
        .select()
        .single();
    
    return { data, error };
};

const getClientStudents = async (clientId, options = {}) => {
    if (!supabaseAdmin) return [];
    
    let query = supabaseAdmin
        .from('client_students')
        .select('*')
        .eq('client_id', clientId);
    
    if (options.isActive !== undefined) {
        query = query.eq('is_active', options.isActive);
    }
    
    if (options.limit) {
        query = query.limit(options.limit);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data } = await query;
    return data || [];
};

const createChatSession = async (clientId, studentId, config) => {
    if (!supabaseAdmin) return { error: 'DB not connected' };
    
    const sessionLimit = await checkSessionLimit(clientId);
    if (!sessionLimit.allowed) {
        return { error: 'session_limit_reached', ...sessionLimit };
    }
    
    const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .insert([{
            client_id: clientId,
            student_id: studentId,
            language: config.language || 'en',
            level: config.level || 'A1',
            mode: config.mode || 'tutor',
            system_prompt: config.systemPrompt
        }])
        .select()
        .single();
    
    return { data, error };
};

const saveChatMessage = async (messageData) => {
    if (!supabaseAdmin) return { error: 'DB not connected' };
    
    const { data, error } = await supabaseAdmin
        .from('chat_messages')
        .insert([messageData])
        .select()
        .single();
    
    return { data, error };
};

const getClientAnalytics = async (clientId, startDate, endDate) => {
    if (!supabaseAdmin) return null;
    
    let query = supabaseAdmin
        .from('client_metrics')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: false });
    
    if (startDate) {
        query = query.gte('date', startDate);
    }
    if (endDate) {
        query = query.lte('date', endDate);
    }
    
    const { data } = await query;
    return data || [];
};

const recordDailyMetrics = async (clientId, metrics) => {
    if (!supabaseAdmin) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    await supabaseAdmin
        .from('client_metrics')
        .upsert([{
            client_id: clientId,
            date: today,
            ...metrics
        }], { onConflict: 'client_id,date' });
};

const createClient = async (clientData) => {
    if (!supabaseAdmin) return { error: 'DB not connected' };
    
    const { data, error } = await supabaseAdmin
        .from('clients')
        .insert([clientData])
        .select()
        .single();
    
    return { data, error };
};

const updateClient = async (clientId, updates) => {
    if (!supabaseAdmin) return { error: 'DB not connected' };
    
    const { data, error } = await supabaseAdmin
        .from('clients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', clientId)
        .select()
        .single();
    
    return { data, error };
};

const getAllClients = async (options = {}) => {
    if (!supabaseAdmin) return [];
    
    let query = supabaseAdmin
        .from('clients')
        .select(`
            *,
            subscription_plans (name, monthly_price_usd)
        `)
        .order('created_at', { ascending: false });
    
    if (options.status) {
        query = query.eq('subscription_status', options.status);
    }
    
    if (options.limit) {
        query = query.limit(options.limit);
    }
    
    const { data } = await query;
    return data || [];
};

const getSubscriptionPlans = async () => {
    if (!supabaseAdmin) return [];
    const { data } = await supabaseAdmin
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('monthly_price_usd');
    return data || [];
};

module.exports = {
    initService,
    getClientById,
    getClientBySlug,
    getClientPlan,
    checkStudentLimit,
    checkSessionLimit,
    getClientLanguages,
    getLanguagesCatalog,
    getStudentById,
    createStudent,
    updateStudent,
    getClientStudents,
    createChatSession,
    saveChatMessage,
    getClientAnalytics,
    recordDailyMetrics,
    createClient,
    updateClient,
    getAllClients,
    getSubscriptionPlans
};
