
export enum Language {
  ENGLISH = 'en',
  GERMAN = 'de',
  FRENCH = 'fr'
}

export enum ProficiencyLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export interface UserProfile {
  id: string;
  name: string;
  language: Language;
  level: ProficiencyLevel;
  goals: string;
  isStudent: boolean;
  useCount: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  correction?: string;
  tip?: string;
  timestamp: number;
}

export interface AIResponse {
  message: string;
  correction?: string;
  tip?: string;
}
