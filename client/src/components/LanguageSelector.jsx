import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import api from '../services/api';

const languages = [
    { id: 'en', name: 'English', flag: '🇬🇧', description: 'Master global communication' },
    { id: 'fr', name: 'Français', flag: '🇫🇷', description: 'Explore romance and culture' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪', description: 'Unlock business opportunities' },
    { id: 'it', name: 'Italiano', flag: '🇮🇹', description: 'Experience art and cuisine' },
    { id: 'pt', name: 'Português', flag: '🇧🇷', description: 'Connect with vibrant cultures' },
];

const LanguageSelector = () => {
    const navigate = useNavigate();

    const handleSelect = (langId) => {
        // Save preference (mock for now, ideally to Supabase/Context)
        localStorage.setItem('targetLanguage', langId);
        navigate('/onboarding');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 z-10"
            >
                <div className="inline-block p-3 bg-slate-800/50 rounded-2xl mb-4 backdrop-blur-sm border border-slate-700/50">
                    <Globe className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Choose Your Path
                </h1>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                    Select the language you want to master today. You can change this later.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl z-10">
                {languages.map((lang, index) => (
                    <motion.button
                        key={lang.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSelect(lang.id)}
                        className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-4xl">{lang.flag}</span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {lang.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            {lang.description}
                        </p>
                    </motion.button>
                ))}
            </div>

            {/* Debug Button */}
            <button
                onClick={async () => {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        await api.post('/profile', { userId: user.id, onboarding_completed: false });
                        window.location.reload();
                    }
                }}
                className="mt-8 text-xs text-red-500 hover:text-red-400 underline z-50 cursor-pointer"
            >
                [DEBUG] Reset Onboarding & Reload
            </button>
        </div>
    );
};

export default LanguageSelector;
