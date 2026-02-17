
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, UserProfile } from '../types';
import { LANGUAGE_LABELS } from '../constants';

interface Props {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const LanguageSelector: React.FC<Props> = ({ user, onUpdate }) => {
  const navigate = useNavigate();

  const handleSelect = (lang: Language) => {
    onUpdate({ language: lang });
    navigate('/onboarding');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center mb-10">¿Qué idioma quieres aprender?</h2>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
            <button
              key={code}
              onClick={() => handleSelect(code as Language)}
              className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-500 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">
                  {code === Language.ENGLISH ? '🇬🇧' : code === Language.GERMAN ? '🇩🇪' : '🇫🇷'}
                </span>
                <span className="text-xl font-semibold">{label}</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 group-hover:bg-indigo-500 group-hover:border-indigo-500 flex items-center justify-center transition-all">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
