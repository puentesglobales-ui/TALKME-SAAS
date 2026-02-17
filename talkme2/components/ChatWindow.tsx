
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Volume2, ChevronRight, CheckCircle2, Lightbulb } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  onPlayVoice: (text: string) => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onPlayVoice, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6" ref={scrollRef}>
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <ChevronRight className="w-10 h-10 text-indigo-400" />
          </div>
          <p className="text-lg">Start speaking to begin your lesson</p>
        </div>
      )}

      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
        >
          <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
            msg.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white border rounded-tl-none shadow-sm'
          }`}>
            <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
            {msg.role === 'tutor' && (
              <button 
                onClick={() => onPlayVoice(msg.text)}
                className="mt-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Volume2 size={18} />
              </button>
            )}
          </div>

          {msg.feedback && (
            <div className="w-full mt-4 space-y-3">
              {msg.feedback.corrections && msg.feedback.corrections.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-tight">Corrections</p>
                    <ul className="text-sm text-amber-900 list-disc pl-4">
                      {msg.feedback.corrections.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>
              )}
              
              {msg.feedback.grammar_tip && (
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-4">
                  <Lightbulb className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-tight">Language Tip</p>
                    <p className="text-sm text-emerald-900">{msg.feedback.grammar_tip}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-indigo-400">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <span className="text-xs font-medium uppercase tracking-widest">Tutor Thinking</span>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
