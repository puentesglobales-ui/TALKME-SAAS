
import React from 'react';
import { CEFRLevel, Language } from '../types';
import { SYLLABUS } from '../constants';

interface SidebarProps {
  level: CEFRLevel;
  setLevel: (l: CEFRLevel) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ level, setLevel, language, setLanguage }) => {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const languages: Language[] = ['English', 'German', 'French'];

  return (
    <div className="w-full md:w-80 h-full glass border-r p-6 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-indigo-600 mb-1">TalkMe</h1>
        <p className="text-sm text-slate-500">Your Adaptive AI Tutor</p>
      </div>

      <section>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">Language</label>
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                language === lang 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      <section>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">CEFR Level</label>
        <div className="grid grid-cols-3 gap-2">
          {levels.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                level === l 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-auto bg-indigo-50 p-4 rounded-xl border border-indigo-100">
        <h3 className="text-xs font-bold text-indigo-700 uppercase mb-2">Current Syllabus ({level})</h3>
        <p className="text-xs text-indigo-900 mb-1 font-semibold">Grammar:</p>
        <ul className="text-xs text-indigo-800 list-disc pl-4 space-y-1">
          {SYLLABUS[level].grammarPoints.map(p => <li key={p}>{p}</li>)}
        </ul>
      </section>
    </div>
  );
};

export default Sidebar;
