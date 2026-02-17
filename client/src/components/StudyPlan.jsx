import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Play, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudyPlan = () => {
    const navigate = useNavigate();
    const targetLanguage = localStorage.getItem('targetLanguage') || 'es';
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedLevel, setExpandedLevel] = useState('a1'); // Default expand A1

    useEffect(() => {
        // Hardcoded production URL to ensure stability for MVP
        const API_URL = 'https://mvp-idiomas-server.onrender.com/api';

        fetch(`${API_URL}/scenarios`)
            .then(res => {
                if (!res.ok) throw new Error('Error al conectar con el servidor');
                return res.json();
            })
            .then(data => {
                console.log('Datos recibidos:', data);
                if (data.length === 0) setError('No se encontraron lecciones cargadas.');
                setCurriculum(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load study plan", err);
                setError(`Error de conexión: ${err.message}`);
                setLoading(false);
            });
    }, []);

    const handleStartScenario = (scenarioId) => {
        navigate('/dashboard', { state: { scenarioId } });
    };

    const toggleLevel = (levelId) => {
        setExpandedLevel(expandedLevel === levelId ? null : levelId);
    };

    if (error) return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-red-400 p-6 text-center">
            <span className="text-3xl mb-4">⚠️</span>
            <p className="text-xl font-bold">{error}</p>
            <p className="text-sm mt-2 text-slate-500">Por favor, recarga la página.</p>
        </div>
    );

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Cargando tu plan personalizado...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6 pb-20">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                        Tu Ruta de Aprendizaje
                    </h1>
                    <p className="text-slate-400">
                        Objetivo: <span className="uppercase font-bold text-white">{targetLanguage} para el Trabajo y la Vida</span>
                    </p>
                </header>

                <div className="space-y-4">
                    {curriculum.map((level) => (
                        <div key={level.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                            {/* Level Header (Clickable) */}
                            <button
                                onClick={() => toggleLevel(level.id)}
                                className={`w-full flex items-center justify-between p-5 transition-colors ${level.locked ? 'opacity-70' : 'hover:bg-slate-700'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-inner ${level.locked ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 text-white'}`}>
                                        {level.id.toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-xl font-bold text-white">{level.title}</h2>
                                        <p className="text-sm text-slate-400">{level.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {level.locked ? <Lock className="text-slate-500" /> : <div className="text-green-400 font-bold text-sm">EN PROGRESO</div>}
                                    {expandedLevel === level.id ? <ChevronDown className="text-slate-400" /> : <ChevronRight className="text-slate-400" />}
                                </div>
                            </button>

                            {/* Level Modules (Expanded) */}
                            {expandedLevel === level.id && !level.locked && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="border-t border-slate-700 bg-slate-900/30 p-4 space-y-4"
                                >
                                    {level.modules && level.modules.map((module) => (
                                        <div key={module.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                            <h3 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                                                <Star size={14} className="fill-blue-300" /> {module.title}
                                            </h3>
                                            <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                                                {module.lessons.map(lesson => (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => handleStartScenario(lesson.id)}
                                                        className="flex items-center justify-between bg-slate-700 p-3 rounded hover:bg-blue-600 hover:text-white transition-all group text-left"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="p-1.5 bg-slate-600 rounded-full group-hover:bg-blue-500 transition-colors">
                                                                <Play size={10} className="fill-white" />
                                                            </span>
                                                            <span className="text-sm font-medium">{lesson.title}</span>
                                                        </div>
                                                        {lesson.type === 'project' && <span className="text-[10px] uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Proyecto</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Locked Message */}
                            {expandedLevel === level.id && level.locked && (
                                <div className="p-8 text-center text-slate-500 italic">
                                    Completa el nivel anterior para desbloquear este contenido profesional.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudyPlan;
