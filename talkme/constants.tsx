
import React from 'react';
import { Language, ProficiencyLevel } from './types';

export const SYLLABUS = {
  [Language.ENGLISH]: {
    [ProficiencyLevel.A1]: {
      description: "Acceso / Beginner (Supervivencia)",
      goal: "Misión: Sobrevivir en el Aeropuerto y Migraciones. 🧳",
      grammar: "Present Simple (be, do), pronouns, basic questions (Where, What), articles.",
      vocabulary: "Passport, Flight, Luggage, Hotel, Food, Numbers, Greetings.",
      skills: "Presentarse, pasar control de pasaportes, pedir ayuda básica.",
      expected_errors: ["Incorrect use of 'be'", "Question order", "Basic prepositions"],
      protocol: "EXPLICT CORRECTION. Refuérzame la confianza del viajero.",
      style: "Short, clear sentences for a busy airport environment."
    },
    [ProficiencyLevel.A2]: {
      description: "Plataforma / Elementary (Migrante)",
      goal: "Misión: Instalación y trámites de residencia. 🏠",
      grammar: "Past simple, present continuous, comparatives, going to.",
      vocabulary: "Rent, Job interview, Health, Weather, Documents, Registration.",
      skills: "Describing the past, making plans, rental calls, basic job application.",
      expected_errors: ["Irregular past verbs", "Much/many confusion"],
      protocol: "SELECTIVE CORRECTION. Focus on clarity for important procedures.",
      style: "Friendly but precise tone for administrative tasks."
    },
    [ProficiencyLevel.B1]: {
      description: "Umbral / Intermediate",
      goal: "Desenvolverse en viajes y expresar opiniones.",
      grammar: "Present perfect, basic passive voice, conditionals 1 and 2, modals (should, must), relative clauses.",
      vocabulary: "Education, environment, technology, feelings, current events.",
      skills: "Expressing opinions, justifying, simple letters, understanding main ideas.",
      expected_errors: ["Past simple vs Present perfect", "Conditionals", "Passive voice", "False friends"],
      protocol: "GRAMMATICAL SUGGESTION ('Consider using present perfect'). Offer alternatives. Reflection questions.",
      style: "Medium sentences (max 20 words). Conversational and stimulating. Justification questions (Why do you think...?)."
    },
    [ProficiencyLevel.B2]: {
      description: "Avanzado / Upper Intermediate",
      goal: "Interactuar con fluidez y espontaneidad con nativos.",
      grammar: "Perfect continuous, advanced passive, 3rd conditional, modals of deduction, contrast/cause connectors.",
      vocabulary: "Business, art, science, phrasal verbs, abstracts.",
      skills: "Argumenting, debating, understanding complex texts, fluency.",
      expected_errors: ["Modal nuances", "Complex collocations", "Precise use of connectors"],
      protocol: "PRECISION AND STYLE CORRECTION. Suggest more natural alternatives. Discussion of nuances.",
      style: "Long sentences (max 30 words). Challenging and analytical. Hypothetical and comparative questions."
    }
  },
  [Language.GERMAN]: {
    [ProficiencyLevel.A1]: {
      description: "Acceso / Start Deutsch 1",
      goal: "Comunicación básica y necesidades concretas.",
      grammar: "Present, separable verbs, articles (der/die/das), nominative/accusative, negation (nicht/kein), imperative.",
      vocabulary: "Greetings, family, housing, food, time.",
      skills: "Basic questions, forms, understanding announcements.",
      expected_errors: ["Gender and articles", "Word order (V2)", "Cases (Nom/Akk)", "Sein vs Haben"],
      protocol: "EXPLICT GENDER CORRECTION ('Remember: der Tisch'). Highlight structure (Verb at the end).",
      style: "Very structured. Simple sentences. Emphasis on word order."
    }
  },
  [Language.FRENCH]: {
    [ProficiencyLevel.A1]: {
      description: "Découverte / Acceso",
      goal: "Interacción sencilla si el interlocutor habla lento.",
      grammar: "Present (être, avoir, -er), articles, adjectives, interrogation, simple negation (ne...pas).",
      vocabulary: "Greetings, numbers, family, professions, food.",
      skills: "Presenting oneself, buying, understanding basic instructions.",
      expected_errors: ["Gender/Number", "Être vs Avoir", "Negation order"],
      protocol: "EXPLICT GENDER CORRECTION ('La table est belle'). Simple rule.",
      style: "Clear and slow. Direct questions."
    }
  }
};

export const DAILY_LIMIT = 50;

export const LANGUAGE_LABELS: Record<Language, string> = {
  [Language.ENGLISH]: 'Inglés',
  [Language.GERMAN]: 'Alemán',
  [Language.FRENCH]: 'Francés'
};

export const Icons = {
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  Mic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};
