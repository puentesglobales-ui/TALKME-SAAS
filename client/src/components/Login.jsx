import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion'; // Added motion import

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Simple password login for MVP
    const [accessCode, setAccessCode] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [accountType, setAccountType] = useState('student'); // 'student' or 'freemium'
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                // 1. Verify Access Code if Student
                if (accountType === 'student') {
                    if (accessCode.length < 6) {
                        throw new Error('El código debe tener 6 caracteres.');
                    }
                    // Optional: Call verify-code endpoint here if needed, or rely on backend constraint
                    // const codeCheck = await api.post('/verify-code', { code: accessCode });
                    // if (!codeCheck.data.valid) throw new Error('Código inválido');
                }

                // 2. Proceed with Signup
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: 'https://www.puentesglobales.com/home/',
                        data: {
                            is_student: accountType === 'student',
                            access_code: accountType === 'student' ? accessCode : null
                        }
                    }
                });
                if (error) throw error;
                setMessage('¡Registro exitoso! Revisa tu email para confirmar.');

                // Redirect based on type
                if (accountType === 'freemium') {
                    navigate('/payment-setup');
                } else {
                    navigate('/languages');
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Navigation handled by App.jsx or explicitly:
                navigate('/languages');
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
                <div className="flex justify-center mb-6">
                    <img src="/home/logo.jpg" alt="Puentes Globales" className="h-40 w-auto object-contain" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">
                    {isSignUp ? 'Crear Cuenta' : 'Bienvenido'}
                </h1>

                {/* LOGIN / SIGNUP TOGGLE */}
                <div className="flex justify-center gap-4 mb-6 text-sm">
                    <button onClick={() => setIsSignUp(false)} className={`pb-1 border-b-2 transition-colors ${!isSignUp ? 'border-cyan-500 text-cyan-600 font-bold' : 'border-transparent text-slate-400'}`}>Iniciar Sesión</button>
                    <button onClick={() => setIsSignUp(true)} className={`pb-1 border-b-2 transition-colors ${isSignUp ? 'border-cyan-500 text-cyan-600 font-bold' : 'border-transparent text-slate-400'}`}>Registrarse</button>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                    {/* ACCOUNT TYPE SELECTOR IN SIGNUP */}
                    {isSignUp && (
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                            <button
                                type="button"
                                onClick={() => setAccountType('student')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${accountType === 'student' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Soy Alumno
                            </button>
                            <button
                                type="button"
                                onClick={() => setAccountType('freemium')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${accountType === 'freemium' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Prueba Gratis 7 Días
                            </button>
                        </div>
                    )}

                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    {isSignUp && accountType === 'student' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <label className="block text-slate-700 text-sm font-bold mb-2">Código de Alumno (6 Caracteres)</label>
                            <input
                                type="text"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
                                placeholder="Ej: 123456"
                                minLength={6}
                                required
                            />
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-xl text-sm ${message.includes('exitoso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        {isSignUp ? 'Crear Cuenta' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="ml-2 text-cyan-600 font-bold hover:text-cyan-700 transition-colors"
                    >
                        {isSignUp ? 'Ingresa aquí' : 'Regístrate gratis'}
                    </button>
                </div>
            </div>
        </div>
    );
}
