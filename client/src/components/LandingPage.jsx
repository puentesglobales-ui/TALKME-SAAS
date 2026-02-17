import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Mic, Globe, ArrowRight, Star, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10">
                {/* Navigation */}
                <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <MessageCircle size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Puentes Globales
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all text-sm font-medium backdrop-blur-sm"
                    >
                        Iniciar Sesión
                    </button>
                </nav>

                {/* Hero Section */}
                <main className="container mx-auto px-6 pt-20 pb-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                            <Star size={14} fill="currentColor" />
                            <span>Nueva Tecnología AI de Voz</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                            Habla Inglés con <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Confianza Total
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Tu tutor personal de IA disponible 24/7. Practica situaciones reales,
                            recibe feedback instantáneo y pierde el miedo a hablar.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-600/25"
                            >
                                Comenzar Gratis
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full font-semibold text-lg transition-all text-slate-300">
                                Ver Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-32">
                        <FeatureCard
                            icon={<Mic className="text-blue-400" />}
                            title="Conversación Natural"
                            desc="Habla como si fuera una persona real. Nuestra IA entiende acentos y contexto."
                        />
                        <FeatureCard
                            icon={<Shield className="text-purple-400" />}
                            title="Ambiente Seguro"
                            desc="Practica sin miedo a equivocarte. Un espacio libre de juicios para aprender."
                        />
                        <FeatureCard
                            icon={<Globe className="text-emerald-400" />}
                            title="Escenarios Reales"
                            desc="Prepárate para entrevistas, viajes o negocios con roles específicos."
                        />
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
                    <p>© 2024 Puentes Globales. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-8 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors"
    >
        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-6 text-2xl">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {desc}
        </p>
    </motion.div>
);

export default LandingPage;
