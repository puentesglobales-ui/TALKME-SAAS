
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface LandingProps {
  onLogin: () => void;
  user: UserProfile | null;
}

const Landing: React.FC<LandingProps> = ({ onLogin, user }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
          Talk<span className="text-indigo-600">Me</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-lg mx-auto">
          Domina un nuevo idioma practicando conversaciones reales con IA de última generación.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
            >
              Ir al Dashboard
            </button>
          ) : (
            <button
              onClick={() => {
                onLogin();
                navigate('/idiomas');
              }}
              className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
            >
              Empezar Gratis
            </button>
          )}
          <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 font-semibold rounded-2xl hover:bg-slate-50 transition-all">
            Ver Syllabus
          </button>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Feedback Real" 
            desc="Correcciones gramaticales instantáneas mientras hablas."
            icon="✨"
          />
          <FeatureCard 
            title="Modo Voz" 
            desc="Practica tu pronunciación con voces ultra-realistas."
            icon="🎙️"
          />
          <FeatureCard 
            title="Niveles CEFR" 
            desc="Contenido adaptado desde A1 hasta C2."
            icon="📈"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-left">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
