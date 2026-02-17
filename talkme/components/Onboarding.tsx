
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, ProficiencyLevel } from '../types';

interface Props {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const Onboarding: React.FC<Props> = ({ user, onUpdate }) => {
  const navigate = useNavigate();
  const [level, setLevel] = useState<ProficiencyLevel>(ProficiencyLevel.A1);
  const [goals, setGoals] = useState('');

  const handleFinish = () => {
    onUpdate({ level, goals, isStudent: true });
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold mb-2">Cuéntanos sobre ti</h2>
        <p className="text-slate-500 mb-8">Personalizaremos tu experiencia de aprendizaje.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Tu nivel actual</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.values(ProficiencyLevel).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${
                    level === l 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">¿Cuál es tu objetivo principal?</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Ej: Quiero mejorar mi fluidez para entrevistas de trabajo en tecnología."
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all outline-none min-h-[120px]"
            />
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all"
          >
            Comenzar mi primera clase
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
