
import { SyllabusItem, CEFRLevel, Language } from './types';

export const SYLLABUS: Record<CEFRLevel, SyllabusItem> = {
  'A1': {
    level: 'A1',
    grammarPoints: ['Present simple', 'Personal pronouns', 'Basic prepositions'],
    recommendedVocabulary: ['Family', 'Hobbies', 'Colors', 'Numbers', 'Basic food']
  },
  'A2': {
    level: 'A2',
    grammarPoints: ['Past simple', 'Comparative/Superlative', 'Future intentions (going to)'],
    recommendedVocabulary: ['Work', 'Travel', 'Health', 'Daily routines', 'Shopping']
  },
  'B1': {
    level: 'B1',
    grammarPoints: ['Present perfect', 'Conditional types 0 and 1', 'Passive voice basics'],
    recommendedVocabulary: ['Environment', 'Education', 'Social issues', 'Emotions']
  },
  'B2': {
    level: 'B2',
    grammarPoints: ['All conditionals', 'Advanced modals', 'Reporting verbs'],
    recommendedVocabulary: ['Politics', 'Technology', 'Science', 'Academic discussions']
  },
  'C1': {
    level: 'C1',
    grammarPoints: ['Inversion', 'Cleft sentences', 'Subjunctive forms'],
    recommendedVocabulary: ['Idiomatic expressions', 'Subtle nuances', 'Abstract philosophy']
  },
  'C2': {
    level: 'C2',
    grammarPoints: ['Complete mastery', 'Literary devices', 'Archaic forms'],
    recommendedVocabulary: ['Mastery of all registers', 'Specific professional domains']
  }
};

export const getTutorSystemPrompt = (level: CEFRLevel, language: Language) => {
  const syllabus = SYLLABUS[level];
  return `
You are "TalkMe", an adaptive language tutor for ${language}.
Your student is at the CEFR level: ${level}.

SYLLABUS CONSTRAINTS:
- Only use grammar from: ${syllabus.grammarPoints.join(', ')}.
- Focus vocabulary on: ${syllabus.recommendedVocabulary.join(', ')}.
- For German: Pay special attention to verb placement (V2 rule) and cases.
- For French: Ensure correct use of gender and accentuation.

PROTOCOL:
1. Conversation First: Respond naturally to the student's message in ${language}. Keep the conversation flowing.
2. Subtle Correction: Do not interrupt the flow in the "response_text". Use the "corrections" and "grammar_tip" fields to provide feedback on the user's previous message.
3. Language Balance: Respond primarily in ${language}. If the user is A1/A2, you may include brief translations in English only for the grammar tip.
4. JSON STRUCTURE: You MUST respond strictly in JSON format.

JSON schema:
{
  "response_text": "Your conversational response in ${language}",
  "corrections": ["Array of specific mistakes from user's last message, or empty if perfect"],
  "grammar_tip": "A short, helpful technical tip explaining one rule the user can improve",
  "vocabulary_check": "A word or phrase used in your response that the user should learn at their level"
}
  `.trim();
};
