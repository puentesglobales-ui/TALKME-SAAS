
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage, ProficiencyLevel } from '../types';
import { Icons, DAILY_LIMIT, SYLLABUS } from '../constants';
import { generateAIChatResponse, transcribeAudio, synthesizeSpeech, decodeAudioData } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
}

const ChatDashboard: React.FC<Props> = ({ user, onUpdate, onLogout }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const playAudioResponse = async (text: string) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioBytes = await synthesizeSpeech(text);
      if (audioBytes && audioCtxRef.current) {
        const buffer = await decodeAudioData(audioBytes, audioCtxRef.current);
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtxRef.current.destination);
        source.start();
      }
    } catch (e) {
      console.warn("No se pudo reproducir el audio", e);
    }
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim() || isLoading) return;

    // Validación de límites (Punto 4 del plan)
    if (user.useCount >= DAILY_LIMIT && !user.isStudent) {
      navigate('/payment');
      return;
    }

    const newUserMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const aiRes = await generateAIChatResponse(user, text, history);

      const aiMsg: ChatMessage = {
        role: 'model',
        content: aiRes.message,
        correction: aiRes.correction,
        tip: aiRes.tip,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
      onUpdate({ useCount: (user.useCount || 0) + 1 });

      // Reproducir voz automáticamente
      await playAudioResponse(aiRes.message);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Detección universal de formato (mp4 para Safari/iOS, webm para Chrome/Android)
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log(`🎙️ Grabación Lenguini finalizada: ${blob.size} bytes (${mimeType})`);

        setIsLoading(true);
        try {
          const transcription = await transcribeAudio(blob);
          if (transcription.trim()) {
            handleSend(transcription);
          }
        } catch (error) {
          console.error("Error en STT:", error);
        } finally {
          setIsLoading(false);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden bg-slate-50">
      <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-indigo-100 shadow-lg">T</div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none">TalkMe Tutor</h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">{user.language} • NIVEL {user.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Uso Diario</p>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${Math.min((user.useCount / DAILY_LIMIT) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
          <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Mission Banner (Gamification) */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 mb-8 text-center animate-in fade-in zoom-in duration-500">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Misión de Aprendizaje</span>
              <h2 className="text-xl font-bold text-indigo-900 mt-1">
                {(SYLLABUS[user.language] as any)?.[user.level]?.goal || "Practica libremente"}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {(SYLLABUS[user.language] as any)?.[user.level]?.grammar.split(',').slice(0, 2).map((g: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white text-indigo-600 rounded-full text-xs font-bold shadow-sm border border-indigo-50">✨ {g.trim()}</span>
                ))}
                {(SYLLABUS[user.language] as any)?.[user.level]?.vocabulary.split(',').slice(0, 2).map((v: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white text-emerald-600 rounded-full text-xs font-bold shadow-sm border border-emerald-50">🎯 {v.trim()}</span>
                ))}
              </div>
            </div>

            {messages.length === 0 && (
              <div className="text-center py-20 opacity-40">
                <p className="text-slate-500">Inicia la conversación escribiendo o pulsando el micro.</p>
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className="max-w-[85%] space-y-2">
                  <div className={`p-4 rounded-2xl shadow-sm ${m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                    <p className="leading-relaxed">{m.content}</p>
                  </div>

                  {m.role === 'model' && (m.correction || m.tip) && (
                    <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-3 text-xs space-y-2 backdrop-blur-sm">
                      {m.correction && (
                        <div className="flex gap-2">
                          <Icons.Check />
                          <p className="text-emerald-800"><span className="font-bold">Corrección:</span> {m.correction}</p>
                        </div>
                      )}
                      {m.tip && (
                        <p className="text-emerald-700 border-t border-emerald-100 pt-2"><span className="font-bold">💡 Tip:</span> {m.tip}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-200/50 p-4 rounded-2xl flex gap-1 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isRecording
                ? 'bg-red-500 text-white scale-110 ring-4 ring-red-100 animate-pulse'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              <Icons.Mic />
            </button>

            <div className="flex-1 relative group">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe en tu idioma objetivo..."
                className="w-full h-14 px-5 pr-14 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-2 top-2 w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl disabled:opacity-30 hover:bg-indigo-100 transition-colors"
              >
                <Icons.Send />
              </button>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              {isRecording ? 'Escuchando...' : 'Mantén pulsado el micro para hablar'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatDashboard;
