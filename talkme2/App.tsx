
import React, { useState, useCallback, useEffect } from 'react';
import { CEFRLevel, Language, ChatMessage } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { gemini } from './services/geminiService';
import { playPcmAudio } from './services/audioService';
import { Send, Mic, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [level, setLevel] = useState<CEFRLevel>('A1');
  const [language, setLanguage] = useState<Language>('English');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }]
      }));

      const feedback = await gemini.generateResponse(text, level, language, history);

      const tutorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'tutor',
        text: feedback.response_text,
        feedback: feedback,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, tutorMessage]);
      
      // Auto-play TTS for immersion
      const audioData = await gemini.generateSpeech(feedback.response_text);
      await playPcmAudio(audioData);

    } catch (error) {
      console.error("Communication error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, level, language]);

  const handlePlayVoice = async (text: string) => {
    try {
      const audioData = await gemini.generateSpeech(text);
      await playPcmAudio(audioData);
    } catch (e) {
      console.error("TTS error", e);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50">
      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <h1 className="text-xl font-bold text-indigo-600">TalkMe</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Settings className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative inset-0 z-40 bg-white md:bg-transparent`}>
        <div className="h-full flex flex-col relative">
          <button 
            className="md:hidden absolute top-4 right-4 text-slate-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            Close
          </button>
          <Sidebar 
            level={level} 
            setLevel={(l) => { setLevel(l); setIsSidebarOpen(false); }}
            language={language}
            setLanguage={(lang) => { setLanguage(lang); setIsSidebarOpen(false); }}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/50 backdrop-blur-sm border-b">
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">{language}</span>
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">{level}</span>
          </div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-widest">Learning Session Active</div>
        </header>

        <ChatWindow 
          messages={messages} 
          onPlayVoice={handlePlayVoice}
          isLoading={isLoading}
        />

        <div className="p-4 md:p-8 bg-gradient-to-t from-slate-50 to-transparent">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(inputValue); }}
            className="max-w-4xl mx-auto flex items-center gap-2 md:gap-4 glass p-2 rounded-2xl shadow-xl border border-white"
          >
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Say something in ${language}...`}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 outline-none text-slate-700"
            />
            <div className="flex items-center gap-1">
              <button 
                type="button"
                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                title="Speech Recognition (Coming soon)"
              >
                <Mic size={20} />
              </button>
              <button 
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Send size={20} />
                <span className="hidden md:inline font-medium text-sm">Send</span>
              </button>
            </div>
          </form>
          <div className="mt-3 text-center">
             <p className="text-[10px] text-slate-400 uppercase font-medium tracking-widest">
                Deployment Guide: 1. Set API_KEY in env 2. Run npm start 3. Deploy to Firebase/Cloud Run
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
