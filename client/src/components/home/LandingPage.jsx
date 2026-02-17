import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, MessageCircle, Calendar, Briefcase, CheckCircle, Mic, Star } from 'lucide-react';

const LandingPage = () => {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">

            {/* 1. HERO SECTION */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/home/img/landing/uploaded_image_0_1768144162832.jpg"
                        alt="Avión en nubes"
                        className="w-full h-full object-cover opacity-40 hover:scale-105 transition-transform duration-[20s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30">
                                <Globe className="w-10 h-10 text-blue-400" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            Emigrar con <span className="text-blue-400">confianza</span> es posible
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto mb-10">
                            No es improvisar, es planificar. Tu futuro en Europa comienza hoy.
                        </p>

                        {/* HERO BUTTONS - JOB SEARCH PRIORITY */}
                        <div className="flex flex-col items-center gap-4">
                            <a
                                href="https://www.puentesglobales.com/index2.php"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-900 hover:bg-blue-50 rounded-full font-black text-xl md:text-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transform hover:scale-105"
                            >
                                <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                                <span>Empieza aquí tu búsqueda laboral</span>
                            </a>
                            <p className="text-sm text-slate-400 mb-4">Conecta con las mejores ofertas en Europa</p>

                            <Link
                                to="/login"
                                className="px-8 py-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-300 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                            >
                                <Mic size={20} /> Probar Talkme Ahora
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. SOMOS PUENTES GLOBALES */}
            <section className="py-20 bg-slate-900">
                <div className="container mx-auto px-6">
                    <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-blue-400 font-bold tracking-wider uppercase mb-2">Sobre Nosotros</h2>
                        <h3 className="text-3xl md:text-5xl font-bold">Somos Puentes Globales</h3>
                        <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                            Un equipo especializado en procesos migratorios a Europa. Priorizamos tu crecimiento personal y profesional.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Globe />, title: "Orientación Migratoria", desc: "Trámites simplificados." },
                            { icon: <Briefcase />, title: "Inserción Laboral", desc: "Conexión con empresas." },
                            { icon: <Mic />, title: "Coaching de Idiomas", desc: "Domina el idioma con IA." },
                            { icon: <Star />, title: "Crecimiento Personal", desc: "Gestión de miedos." }
                        ].map((item, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors">
                                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                <p className="text-slate-400 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. CONTEXT (Globe Image - "El idioma es parte del camino") */}
            <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        {/* THE "G" IMAGE (Globe/Books) */}
                        <img src="/home/img/landing/uploaded_image_2_1768152607150.jpg" alt="El idioma es el camino" className="rounded-2xl shadow-2xl" />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            El idioma deja de ser un obstáculo
                        </h2>
                        <p className="text-lg text-slate-300 mb-6">
                            Durante mucho tiempo, aprender fue <span className="text-slate-400 line-through">lento y difícil</span>.
                            Hoy se convierte en una herramienta para avanzar con seguridad en tu proceso.
                        </p>
                        <p className="text-slate-300 mb-6">
                            Menos barreras, y más confianza.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. TALKME SOLUTION (Text Only) */}
            <section className="py-20 bg-slate-800">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">
                        Nuestra Solución: Talkme AI
                    </h2>
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                        Contamos con una plataforma que brinda <strong>asesoramiento inteligente</strong> con respuestas inmediatas.
                        Permite resolver dudas al instante, practicar situaciones cotidianas y entrenar el idioma de forma práctica y dinámica.
                    </p>
                    <p className="text-2xl text-white font-semibold mb-10">
                        Esto <span className="text-blue-400">ACELERA</span> el aprendizaje y ayuda a ganar confianza en mucho menos <span className="text-blue-400">TIEMPO</span>.
                    </p>

                    <Link to="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-xl shadow-lg hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1">
                        <Mic size={28} /> Probar Talkme Ahora
                    </Link>
                </div>
            </section>

            {/* 5. CV & ATS (CV Image) */}
            <section className="py-20 bg-slate-900 border-t border-slate-800">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        {/* CV IMAGE */}
                        <img src="/home/img/landing/uploaded_image_1_1768152607150.jpg" alt="Revolución CV" className="rounded-2xl shadow-2xl" />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Simulador ATS y Revolución de CV
                        </h2>
                        <p className="text-lg text-slate-300 mb-6">
                            Adaptamos tu perfil profesional a los estándares europeos. No se trata solo de traducir, sino de interpretar lo que las empresas buscan.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-blue-500" /> Supera filtros automáticos (ATS)</li>
                            <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-blue-500" /> Formatos claros y profesionales</li>
                            <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-blue-500" /> Aumenta tus posibilidades de selección</li>
                        </ul>

                        <a
                            href="https://ats-career-client.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-1"
                        >
                            <span className="bg-white/20 p-1 rounded-full"><Star size={18} fill="currentColor" /></span>
                            utiza nuestro: Simulador ATS y Revolución de CV con IA
                        </a>
                    </div>
                </div>
            </section>

            {/* 6. COACH PERSONALIZADO */}
            <section className="py-20 bg-slate-800 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="md:w-1/2">
                        <img src="/home/img/landing/uploaded_image_2_1768150943006.jpg" alt="Coaching Personalizado" className="rounded-2xl shadow-2xl" />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Coach Personalizado
                        </h2>
                        <h3 className="text-xl text-blue-400 font-semibold mb-6">Trabajando todos tus miedos</h3>
                        <div className="space-y-4 text-slate-300">
                            <p>Emigrar implica superar barreras internas. Nuestro coaching te acompaña en:</p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3"><CheckCircle className="text-green-500" size={18} /> Miedo a dejar a la familia</li>
                                <li className="flex items-center gap-3"><CheckCircle className="text-green-500" size={18} /> Miedo al proceso y la incertidumbre</li>
                                <li className="flex items-center gap-3"><CheckCircle className="text-green-500" size={18} /> Gestión de agencias y papeleo</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>



            {/* 6. BENEFITS GRID */}
            <section className="py-20 bg-slate-800">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Te permites...</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            "Aprender cualquier idioma",
                            "Adaptado a tu nivel y ritmo",
                            "Respuestas Inmediatas",
                            "Práctica en contextos reales",
                            "Preparación Laboral y Migratoria",
                            "Aprendizaje rápido y efectivo",
                            "Mayor confianza al comunicarte",
                            "Asesoramiento sin limitaciones"
                        ].map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="font-medium text-slate-200">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. CTA / FINAL PITCH */}
            <section className="relative py-24 bg-blue-900 overflow-hidden">
                <img src="/home/img/landing/uploaded_image_3_1768144162832.jpg" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" alt="Paris" />
                <div className="relative container mx-auto px-6 text-center z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">La preparación correcta transforma el camino</h2>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                        El cambio empieza mucho antes del viaje. Empieza cuando decidís prepararte, informarte y entender cómo funciona el camino que querés recorrer.
                    </p>
                    <div className="inline-block p-6 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-blue-400/30">
                        <p className="text-2xl font-bold text-white mb-2">No se trata solo de postular,</p>
                        <p className="text-3xl font-bold text-blue-400">sino de estar LISTO ✨</p>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
                        <a href="https://calendly.com/puentesglobales" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                            <Calendar /> Agendar Entrevista
                        </a>
                        <a href="https://wa.me/541158253958" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-green-600 hover:bg-slate-100 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                            <MessageCircle /> WhatsApp Directo
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-950 py-12 border-t border-slate-900">
                <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
                    <div className="flex justify-center gap-6 mb-8">
                        <a href="#" className="hover:text-white transition-colors">Terminos y Condiciones</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Contacto</a>
                    </div>
                    <p>&copy; 2026 Puentes Globales. Todos los derechos reservados.</p>
                    <p className="mt-2 text-xs">Desarrollado con ❤️ y mucha IA.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
