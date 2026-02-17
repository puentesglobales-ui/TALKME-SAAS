import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Check } from 'lucide-react';
import GoalSelection from './Steps/GoalSelection';
import LevelAssessment from './Steps/LevelAssessment';
import InterestsSelection from './Steps/InterestsSelection';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function OnboardingWizard({ session, onComplete }) {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userId: session?.user?.id,
        goal: '',
        level: '',
        interests: [],
        age: 25 // Default or ask in another step
    });

    const updateData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const steps = [
        { component: GoalSelection, field: 'goal', key: 'goal' },
        { component: LevelAssessment, field: 'level', key: 'level' },
        { component: InterestsSelection, field: 'interests', key: 'interests' }
    ];

    const CurrentStepComponent = steps[step].component;

    const handleNext = async () => {
        if (step < steps.length - 1) {
            setStep(prev => prev + 1);
        } else {
            // SUBMIT
            setLoading(true);
            try {
                console.log("Submitting Profile:", formData);
                await api.post('/profile', formData);
                if (onComplete) onComplete();
                else navigate('/dashboard');
            } catch (error) {
                console.error("Error saving profile:", error);
                alert("Error guardando perfil. Intenta de nuevo.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    // Validation: Check if current step field is filled
    const isValid = () => {
        const field = steps[step].field;
        const value = formData[field];
        if (Array.isArray(value)) return value.length > 0;
        return !!value;
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-lg relative z-10">
                {/* Progress Bar */}
                <div className="mb-8 flex gap-2">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-blue-500' : 'bg-slate-800'}`} />
                    ))}
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
                >
                    <CurrentStepComponent
                        value={formData[steps[step].field]}
                        onChange={(val) => updateData(steps[step].field, val)}
                    />

                    <div className="mt-8 flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            disabled={step === 0}
                            className={`p-3 rounded-full hover:bg-white/10 transition-colors ${step === 0 ? 'invisible' : 'text-slate-400'}`}
                        >
                            <ArrowLeft size={24} />
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!isValid() || loading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isValid() && !loading
                                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {loading ? 'Guardando...' : step === steps.length - 1 ? 'Finalizar' : 'Continuar'}
                            {!loading && (step === steps.length - 1 ? <Check size={20} /> : <ChevronRight size={20} />)}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
