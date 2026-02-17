// gamificationService.js - Sistema de Gamificación
let supabaseAdmin = null;

const init = (supabaseUrl, supabaseKey) => {
    const { createClient } = require('@supabase/supabase-js');
    if (supabaseUrl && supabaseKey) {
        supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    }
};

// XP por acción
const XP_ACTIONS = {
    session_completed: 25,
    message_sent: 2,
    streak_bonus: 10,  // Por cada día de racha
    achievement_unlocked: 50,
    perfect_session: 30,
    level_up: 100,
    daily_login: 5
};

// Agregar XP y verificar level up
const addXP = async (studentId, action, customAmount = null) => {
    if (!supabaseAdmin) return null;

    const xpToAdd = customAmount || XP_ACTIONS[action] || 0;
    
    const { data: student } = await supabaseAdmin
        .from('client_students')
        .select('xp, xp_level, streak_days')
        .eq('id', studentId)
        .single();

    if (!student) return null;

    let newXP = student.xp + xpToAdd;
    let newLevel = student.xp_level;
    let leveledUp = false;

    // Calcular XP para siguiente nivel (fórmula exponencial)
    const xpForLevel = (level) => level * 100 + (level * level * 10);

    while (newXP >= xpForLevel(newLevel)) {
        newXP -= xpForLevel(newLevel);
        newLevel++;
        leveledUp = true;
    }

    // Calcular bonus de racha
    const streakBonus = student.streak_days * XP_ACTIONS.streak_bonus;
    newXP += streakBonus;

    await supabaseAdmin
        .from('client_students')
        .update({
            xp: newXP,
            xp_level: newLevel,
            xp_updated_at: new Date().toISOString()
        })
        .eq('id', studentId);

    // Registrar XP del día
    await recordDailyXP(studentId, xpToAdd);

    // Verificar logros
    await checkAndAwardAchievements(studentId);

    return {
        xp_gained: xpToAdd + streakBonus,
        total_xp: newXP,
        level: newLevel,
        leveled_up: leveledUp,
        xp_to_next_level: xpForLevel(newLevel) - newXP
    };
};

// Registrar XP diario
const recordDailyXP = async (studentId, xpAmount) => {
    const today = new Date().toISOString().split('T')[0];
    const { data: student } = await supabaseAdmin
        .from('client_students')
        .select('client_id')
        .eq('id', studentId)
        .single();

    if (!student) return;

    await supabaseAdmin
        .from('daily_xp')
        .upsert([{
            student_id: studentId,
            client_id: student.client_id,
            created_at: today,
            xp_earned: xpAmount
        }], { onConflict: 'student_id,created_at' })
        .then(async () => {
            await supabaseAdmin.rpc('add_daily_xp', {
                student_uuid: studentId,
                xp_amount: xpAmount
            });
        });
};

// Verificar y otorgar logros
const checkAndAwardAchievements = async (studentId) => {
    if (!supabaseAdmin) return [];

    const { data: student } = await supabaseAdmin
        .from('client_students')
        .select('*')
        .eq('id', studentId)
        .single();

    if (!student) return [];

    const { data: achievements } = await supabaseAdmin
        .from('achievements')
        .select('*')
        .eq('is_active', true);

    const newAchievements = [];

    for (const achievement of achievements || []) {
        const { data: existing } = await supabaseAdmin
            .from('student_achievements')
            .select('*')
            .eq('student_id', studentId)
            .eq('achievement_id', achievement.id)
            .single();

        if (existing) continue;

        let unlocked = false;
        let progress = 0;

        switch (achievement.requirement_type) {
            case 'sessions_count':
                progress = Math.min(100, (student.total_sessions / achievement.requirement_value) * 100);
                unlocked = student.total_sessions >= achievement.requirement_value;
                break;
            case 'streak_days':
                progress = Math.min(100, (student.streak_days / achievement.requirement_value) * 100);
                unlocked = student.streak_days >= achievement.requirement_value;
                break;
            case 'messages_count':
                progress = Math.min(100, (student.total_messages / achievement.requirement_value) * 100);
                unlocked = student.total_messages >= achievement.requirement_value;
                break;
            case 'level':
                const levelNum = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
                const currentLevel = levelNum[student.level] || 1;
                progress = Math.min(100, (currentLevel / achievement.requirement_value) * 100);
                unlocked = currentLevel >= achievement.requirement_value;
                break;
        }

        if (unlocked) {
            await supabaseAdmin
                .from('student_achievements')
                .insert([{
                    student_id: studentId,
                    achievement_id: achievement.id,
                    progress: 100,
                    unlocked_at: new Date().toISOString()
                }]);

            newAchievements.push(achievement);
            
            // Agregar XP por logro
            await addXP(studentId, 'achievement_unlocked', achievement.points);
        } else if (progress > 0) {
            await supabaseAdmin
                .from('student_achievements')
                .upsert([{
                    student_id: studentId,
                    achievement_id: achievement.id,
                    progress
                }], { onConflict: 'student_id,achievement_id' });
        }
    }

    return newAchievements;
};

// Obtener logros del estudiante
const getStudentAchievements = async (studentId) => {
    if (!supabaseAdmin) return [];

    const { data } = await supabaseAdmin
        .from('student_achievements')
        .select('*, achievements(*)')
        .eq('student_id', studentId)
        .order('unlocked_at', { ascending: false });

    return data || [];
};

// Obtener ranking de estudiantes
const getLeaderboard = async (clientId, limit = 10) => {
    if (!supabaseAdmin) return [];

    const { data } = await supabaseAdmin
        .from('client_students')
        .select('id, name, xp, xp_level, streak_days, level')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .order('xp', { ascending: false })
        .limit(limit);

    return data || [];
};

// Obtener progreso del estudiante
const getStudentProgress = async (studentId) => {
    if (!supabaseAdmin) return null;

    const { data: student } = await supabaseAdmin
        .from('client_students')
        .select('xp, xp_level, streak_days, total_sessions, total_messages, level')
        .eq('id', studentId)
        .single();

    if (!student) return null;

    const xpForLevel = (level) => level * 100 + (level * level * 10);
    const xpForCurrent = xpForLevel(student.xp_level);
    const xpForNext = xpForLevel(student.xp_level + 1);
    
    const levelProgress = ((student.xp - (student.xp_level * (student.xp_level - 1) * 50)) / xpForCurrent) * 100;

    return {
        xp: student.xp,
        level: student.xp_level,
        level_name: student.level,
        streak: student.streak_days,
        sessions: student.total_sessions,
        messages: student.total_messages,
        progress_to_next_level: Math.min(100, Math.max(0, ((student.xp % xpForCurrent) / xpForCurrent) * 100)),
        xp_needed: xpForNext - student.xp
    };
};

// Marcar sesión perfecta (sin errores)
const markPerfectSession = async (studentId) => {
    await addXP(studentId, 'perfect_session');
    return checkAndAwardAchievements(studentId);
};

// Actualizar racha
const updateStreak = async (studentId) => {
    if (!supabaseAdmin) return;

    const { data: student } = await supabaseAdmin
        .from('client_students')
        .select('last_session_at, streak_days, streak_best')
        .eq('id', studentId)
        .single();

    if (!student) return;

    const now = new Date();
    const lastSession = student.last_session_at ? new Date(student.last_session_at) : null;
    
    let newStreak = student.streak_days;
    let newBest = student.streak_best;

    if (lastSession) {
        const daysDiff = Math.floor((now - lastSession) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
            newStreak++;
        } else if (daysDiff > 1) {
            newStreak = 1;
        }
    } else {
        newStreak = 1;
    }

    if (newStreak > newBest) {
        newBest = newStreak;
    }

    await supabaseAdmin
        .from('client_students')
        .update({
            streak_days: newStreak,
            streak_best: newBest,
            last_session_at: now.toISOString()
        })
        .eq('id', studentId);
};

module.exports = {
    init,
    addXP,
    checkAndAwardAchievements,
    getStudentAchievements,
    getLeaderboard,
    getStudentProgress,
    markPerfectSession,
    updateStreak
};
