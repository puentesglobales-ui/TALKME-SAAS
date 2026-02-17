
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const PaymentSetup: React.FC<Props> = ({ user, onUpdate }) => {
  const navigate = useNavigate();

  const handlePay = () => {
    onUpdate({ isStudent: true, useCount: 0 });
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ⭐
        </div>
        <h2 className="text-2xl font-bold mb-4">Has alcanzado el límite diario</h2>
        <p className="text-slate-500 mb-8">
          Para seguir practicando sin límites y acceder a todas las funciones premium, suscríbete hoy.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
          <p className="text-slate-400 text-sm mb-1">Plan Mensual</p>
          <p className="text-4xl font-extrabold text-slate-900">$19.99<span className="text-lg font-normal text-slate-400">/mes</span></p>
          <ul className="mt-6 space-y-3 text-left">
            <li className="flex items-center gap-2 text-sm text-slate-600">✅ Mensajes Ilimitados</li>
            <li className="flex items-center gap-2 text-sm text-slate-600">✅ Syllabus Personalizado</li>
            <li className="flex items-center gap-2 text-sm text-slate-600">✅ Acceso a todos los idiomas</li>
          </ul>
        </div>

        <button
          onClick={handlePay}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-md hover:bg-indigo-700 transition-all mb-4"
        >
          Convertirme en Estudiante
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 text-sm hover:text-slate-600"
        >
          Volver por ahora
        </button>
      </div>
    </div>
  );
};

export default PaymentSetup;
