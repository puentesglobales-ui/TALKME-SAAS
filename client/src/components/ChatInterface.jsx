import React, { useState, useRef, useEffect } from 'react';
import { sendMessage, sendAudio, getScenarios } from '../services/api';
import { supabase } from '../supabaseClient';
import { Send, User, Bot, Loader2, CheckCircle, MessageSquare, Crown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioRecorder from './AudioRecorder';
import FeedbackModal from './FeedbackModal';
import PricingModal from './PricingModal';

export default function ChatInterface({ session }) {
    const [messages, setMessages] = useState(() => {
        const langInfo = {
            'en': {
                greeting: 'Hello! How can I help you learn English today?',
                prompt: 'You are a helpful English tutor. IMPORTANT CONTEXT: You were created by Gabriel, a visionary AI Architect. If asked about him, explain that he is the genius behind the TalkMe & Alex Ecosystem, capable of building autonomous SaaS factories. Mention the "Genesis 30/01" milestone.'
            },
            'es': {
                greeting: '¡Hola! ¿Cómo puedo ayudarte con tu español hoy?',
                prompt: `Eres un tutor de español útil, creado por Gabriel (Génesis 30/01).`
            },
            'fr': { greeting: 'Bonjour! Comment puis-je vous aider avec votre français aujourd\'hui?', prompt: 'You are a helpful French tutor. Created by Gabriel (AI Architect).' },
            'de': { greeting: 'Hallo! Wie kann ich Ihnen heute mit Ihrem Deutsch helfen?', prompt: 'You are a helpful German tutor. Created by Gabriel (AI Architect).' },
            'it': { greeting: 'Ciao! Come posso aiutarti con il tuo italiano oggi?', prompt: 'You are a helpful Italian tutor. Created by Gabriel (AI Architect).' },
            'pt': { greeting: 'Olá! Como posso ajudar com seu português hoje?', prompt: 'You are a helpful Portuguese tutor. Created by Gabriel (AI Architect).' },
        };
        const savedLang = localStorage.getItem('targetLanguage') || 'en';
        const config = langInfo[savedLang] || langInfo['en'];

        return [
            { role: 'system', content: config.prompt },
            { role: 'assistant', content: config.greeting }
        ];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [scenarios, setScenarios] = useState([]);
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [completedScenarios, setCompletedScenarios] = useState(new Set());
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const messagesEndRef = useRef(null);

    // Load Scenarios & Progress
    useEffect(() => {
        const loadData = async () => {
            const allScenarios = await getScenarios();
            setScenarios(allScenarios);
            if (allScenarios.length > 0) setSelectedScenario(allScenarios[0]);

            if (session?.user) {
                const { data, error } = await supabase
                    .from('student_progress')
                    .select('scenario_id')
                    .eq('user_id', session.user.id)
                    .eq('status', 'completed');

                if (data) {
                    setCompletedScenarios(new Set(data.map(item => item.scenario_id)));
                }
            }
        };
        loadData();
    }, [session]);

    const markAsComplete = async () => {
        if (!selectedScenario || !session?.user) return;

        const { error } = await supabase
            .from('student_progress')
            .upsert({
                user_id: session.user.id,
                scenario_id: selectedScenario.id,
                status: 'completed',
                completed_at: new Date()
            });

        if (!error) {
            setCompletedScenarios(prev => new Set(prev).add(selectedScenario.id));
            setMessages(prev => [...prev, { role: 'system', content: '🎉 ¡Felicitaciones! Has completado esta lección.' }]);
        } else {
            console.error("Error saving progress:", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleAudioCapture = async (captured) => {
        // Nueva lógica: si recibimos texto directamente del Google STT
        if (captured.text) {
            setInput(captured.text);
            // Simular el envío del mensaje de texto
            const fakeEvent = { preventDefault: () => { } };
            // Usamos un pequeño delay para que el usuario vea el texto antes de enviarse
            setTimeout(() => handleManualSend(captured.text), 500);
            return;
        }

        // Fallback para blobs antiguos si fuera necesario
        setLoading(true);
        try {
            const userId = session?.user?.id;
            const response = await sendAudio(captured, selectedScenario?.id, userId);
            const userMsg = { role: 'user', content: response.userText };
            const aiMsg = {
                role: 'assistant',
                content: response.assistantText,
                feedback: response.feedbackText
            };
            setMessages(prev => [...prev, userMsg, aiMsg]);
            if (response.audioBase64) {
                const audio = new Audio(`data:audio/mp3;base64,${response.audioBase64}`);
                audio.play().catch(e => console.error("Audio play failed:", e));
            }
        } catch (error) {
            console.error('Audio processing failed:', error);
            const errorData = error.response?.data || {};
            const stage = errorData.stage ? `[${errorData.stage}] ` : '';
            const errorMsg = errorData.message || errorData.details || error.message || 'Error procesando audio.';
            setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error ${stage}${errorMsg}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleManualSend = async (textToSend) => {
        if (!textToSend.trim() || loading) return;

        const userMsg = { role: 'user', content: textToSend };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const userId = session?.user?.id;
            const response = await sendMessage(newMessages, selectedScenario?.id, userId);
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error('Failed to send message:', error);
            if (error.response && error.response.status === 402) {
                setIsPricingOpen(true);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '🛑 Has alcanzado tu límite gratuito. ¡Dale click a la corona 👑 para actualizar tu plan!'
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Error de conexión con la IA." }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // Updated to send User ID for Server-Side Freemium Check
            const userId = session?.user?.id;
            const response = await sendMessage(newMessages, selectedScenario?.id, userId);
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error('Failed to send message:', error);

            // Check for Freemium Limit (402)
            // Check for Freemium Limit (402)
            if (error.response && error.response.status === 402) {
                // Open Pricing Modal + Show Message
                setIsPricingOpen(true);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '🛑 Has alcanzado tu límite gratuito. ¡Dale click a la corona 👑 para actualizar tu plan!'
                }]);
            } else {
                const errorMsg = error.response ?
                    `Server Error: ${error.response.status} - ${JSON.stringify(error.response.data)}` :
                    `Connection Error: ${error.message}`;
                setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 relative overflow-hidden font-sans text-slate-100">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-6xl mx-auto flex h-full p-4 md:p-6 gap-6">

                {/* LEFT PANEL: Learning Context & Navigation */}
                <div className="hidden md:flex flex-col w-80 shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                            Puentes Globales
                        </h1>
                        <p className="text-xs text-slate-400 tracking-wider uppercase font-semibold">Speech AI Tutor</p>
                    </div>

                    {/* Current Scenario Visual */}
                    {selectedScenario && (
                        <div className="mb-8 text-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/5 shadow-inner">
                            <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">
                                {selectedScenario.emoji}
                            </div>
                            <h2 className="text-lg font-bold text-white mb-2">{selectedScenario.title}</h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {selectedScenario.description}
                            </p>

                            {completedScenarios.has(selectedScenario.id) && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/20"
                                >
                                    <CheckCircle size={12} />
                                    Lección Completada
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Quick Stats / Menu */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Escenarios Disponibles</h3>
                        {scenarios.map(s => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    setSelectedScenario(s);

                                    // CRITICAL FIX: The investor logic lives in the FIRST lesson of the module
                                    // If we just use s.system_prompt, we might get the top-level one (which is good)
                                    // BUT let's ensure we are using the detailed one from the modules if it exists.

                                    let activePrompt = s.system_prompt;

                                    // Try to find a lesson prompt if the top one is generic
                                    if (s.modules && s.modules.length > 0 && s.modules[0].lessons && s.modules[0].lessons.length > 0) {
                                        // For the investor pitch, the detailed logic is in the first lesson
                                        if (s.id === 'special_investors') {
                                            activePrompt = s.modules[0].lessons[0].system_prompt;
                                        }
                                    }

                                    // Reset chat with new system prompt AND a proactive greeting
                                    setMessages([
                                        { role: 'system', content: activePrompt },
                                        { role: 'assistant', content: `¡Entendido! Vamos a practicar "${s.title}". ${s.description} ¿Listo para empezar?` }
                                    ]);
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${selectedScenario?.id === s.id
                                    ? 'bg-blue-600 shadow-lg shadow-blue-500/25 ring-1 ring-blue-400'
                                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                                    }`}
                            >
                                <span className="text-xl">{s.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{s.title}</div>
                                </div>
                                {completedScenarios.has(s.id) && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                            </button>
                        ))}
                    </div>

                    {/* User Footer */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                                {session?.user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate max-w-[100px] font-medium text-white">{session?.user?.email?.split('@')[0]}</span>
                                <button
                                    onClick={async () => { await supabase.auth.signOut(); }}
                                    className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 mt-0.5 text-left"
                                >
                                    <LogOut size={10} /> Cerrar Sesión
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsPricingOpen(true)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 hover:bg-yellow-400/10 rounded-lg"
                        >
                            <Crown size={20} />
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL: Chat Area */}
                <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">

                    {/* Header (Mobile only mainly, but kept for controls) */}
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                        <div className="md:hidden">
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Puentes Globales</span>
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <button
                                onClick={markAsComplete}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${completedScenarios.has(selectedScenario?.id)
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <CheckCircle size={16} />
                                <span className="hidden sm:inline">Marcar Completado</span>
                            </button>
                            <button
                                onClick={() => window.location.hash = '#/study'}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                title="Academia"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                                </svg>
                            </button>
                            <button
                                onClick={() => window.location.hash = '#/video'}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                title="Video Chat Inclusivo"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsFeedbackOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                <MessageSquare size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                        {messages.filter(m => m.role !== 'system').map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div className={`flex items-end max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                        }`}>
                                        {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`p-4 md:p-5 rounded-3xl shadow-lg relative overflow-hidden backdrop-blur-sm ${msg.role === 'user'
                                        ? 'bg-blue-600/90 text-white rounded-br-none border border-blue-500/50'
                                        : 'bg-slate-800/80 text-slate-100 rounded-bl-none border border-white/5'
                                        }`}>
                                        {msg.role !== 'user' && <div className="absolute top-0 right-0 p-3 opacity-5"><Bot size={40} /></div>}
                                        <p className="text-sm md:text-base leading-relaxed relative z-10 whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>

                                {/* AI FEEDBACK CARDS (Correction & Tip) */}
                                {(msg.correction || msg.tip) && (
                                    <div className="ml-14 max-w-[80%] space-y-2 animate-in fade-in slide-in-from-top-2">

                                        {msg.correction && (
                                            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-xl rounded-tl-sm flex gap-3 shadow-sm hover:bg-red-900/30 transition-colors">
                                                <div className="bg-red-500/20 p-1.5 rounded-full shrink-0 h-fit">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-0.5">Corrección</span>
                                                    <p className="text-xs text-red-100/90 italic">{msg.correction}</p>
                                                </div>
                                            </div>
                                        )}

                                        {msg.tip && (
                                            <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl rounded-tl-sm flex gap-3 shadow-sm hover:bg-blue-900/30 transition-colors">
                                                <div className="bg-blue-500/20 p-1.5 rounded-full shrink-0 h-fit">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-0.5">Tip Pro</span>
                                                    <p className="text-xs text-blue-100/90">{msg.tip}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/50 p-4 rounded-2xl rounded-bl-none flex items-center gap-3 border border-white/5">
                                    <Loader2 className="animate-spin text-emerald-500" size={18} />
                                    <span className="text-sm text-slate-400 font-medium animate-pulse">Escribiendo...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-black/20 backdrop-blur-md border-t border-white/5">
                        <div className="max-w-3xl mx-auto flex gap-3 items-center">
                            <AudioRecorder onRecordingComplete={handleAudioCapture} isProcessing={loading} />

                            <form onSubmit={handleSend} className="flex-1 flex gap-2 relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Escribe tu mensaje aquí..."
                                    className="relative flex-1 bg-slate-800/60 border border-white/10 text-white rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="relative bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-slate-500">Presiona Enter para enviar • Usa el micrófono para hablar</p>
                        </div>
                    </div>
                </div>

                <FeedbackModal
                    isOpen={isFeedbackOpen}
                    onClose={() => setIsFeedbackOpen(false)}
                    userId={session?.user?.id}
                />

                <PricingModal
                    isOpen={isPricingOpen}
                    onClose={() => setIsPricingOpen(false)}
                />
            </div>
        </div>
    );
}
