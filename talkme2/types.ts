
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type Language = 'English' | 'German' | 'French';

export interface ChatMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  feedback?: TutorFeedback;
  timestamp: number;
}

export interface TutorFeedback {
  response_text: string;
  corrections?: string[];
  grammar_tip?: string;
  vocabulary_check?: string;
}

export interface UserSession {
  level: CEFRLevel;
  targetLanguage: Language;
}

export interface SyllabusItem {
  level: CEFRLevel;
  grammarPoints: string[];
  recommendedVocabulary: string[];
}
