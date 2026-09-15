import { Question, ExamPreset, ExamMode } from '../types';
import { module1Questions } from './module1Questions';
import { module2Questions } from './module2Questions';
import { module3Questions } from './module3Questions';
import { module4Questions } from './module4Questions';
import { module5Questions } from './module5Questions';
import { module6Questions } from './module6Questions';

export const allQuestions: Question[] = [
  ...module1Questions,
  ...module2Questions,
  ...module3Questions,
  ...module4Questions,
  ...module5Questions,
  ...module6Questions,
];

export const examPresets: ExamPreset[] = [
  {
    id: 'm1_2',
    name: 'Modules 1 & 2 Practice Exam',
    badge: '80 Questions',
    modules: [1, 2],
    moduleTitles: [
      'Module 1: Sustainability Fundamentals, Concepts, & Frameworks',
      'Module 2: Environmental Science & Management Tools'
    ],
    questionCount: 80,
    timeLimitMinutes: 120, // 2 hours
    description: 'Comprehensive test covering sustainability principles, planetary boundaries, SDGs, ISO 14001, climate science, LCA, GHG Protocol, and circular economy.'
  },
  {
    id: 'm3_4',
    name: 'Modules 3 & 4 Practice Exam',
    badge: '80 Questions',
    modules: [3, 4],
    moduleTitles: [
      'Module 3: Social Equity, Human Rights, & Stakeholder Engagement',
      'Module 4: Economic Sustainability, Governance, & Business Ethics'
    ],
    questionCount: 80,
    timeLimitMinutes: 120, // 2 hours
    description: 'Practice exam focusing on human rights due diligence, ILO labor standards, FPIC, stakeholder mapping, sustainable finance, SFDR, anti-corruption, and ERM.'
  },
  {
    id: 'm5_6',
    name: 'Modules 5 & 6 Practice Exam',
    badge: '80 Questions',
    modules: [5, 6],
    moduleTitles: [
      'Module 5: Sustainability Strategy, Implementation, & Performance',
      'Module 6: Reporting Frameworks, Communication, & SEA Exam Strategy'
    ],
    questionCount: 80,
    timeLimitMinutes: 120, // 2 hours
    description: 'Rigorous assessment on double materiality, SBTi target setting, PDCA implementation, GRI Standards, TCFD, ISSB, assurance, and SEA exam techniques.'
  },
  {
    id: 'full',
    name: 'Full Course Mock Exam (Comprehensive)',
    badge: '100 Questions',
    modules: [1, 2, 3, 4, 5, 6],
    moduleTitles: [
      'Module 1 & 2: Fundamentals & Environmental Tools',
      'Module 3 & 4: Social Equity, Governance & Economics',
      'Module 5 & 6: Strategy, Reporting & Certification'
    ],
    questionCount: 100,
    timeLimitMinutes: 120, // 2 hours (per prompt requirement)
    description: 'Simulated 100-question credentialing mock examination mirroring the official SEA examination structure, sampled proportionately across all 6 course modules.'
  }
];

// Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate randomized question pool for a preset
export function generateExamQuestions(mode: ExamMode): Question[] {
  if (mode === 'm1_2') {
    const pool = [...module1Questions, ...module2Questions];
    return shuffleArray(pool);
  }
  if (mode === 'm3_4') {
    const pool = [...module3Questions, ...module4Questions];
    return shuffleArray(pool);
  }
  if (mode === 'm5_6') {
    const pool = [...module5Questions, ...module6Questions];
    return shuffleArray(pool);
  }
  if (mode === 'full') {
    // 100 questions distributed across all 6 modules:
    // Modules 1, 2, 3, 4, 5, 6 (~16-17 from each module)
    const m1 = shuffleArray(module1Questions).slice(0, 17);
    const m2 = shuffleArray(module2Questions).slice(0, 17);
    const m3 = shuffleArray(module3Questions).slice(0, 17);
    const m4 = shuffleArray(module4Questions).slice(0, 17);
    const m5 = shuffleArray(module5Questions).slice(0, 16);
    const m6 = shuffleArray(module6Questions).slice(0, 16);
    const combined = [...m1, ...m2, ...m3, ...m4, ...m5, ...m6];
    return shuffleArray(combined);
  }
  return shuffleArray(allQuestions).slice(0, 80);
}

// Generate security authentication code for test attempt verification
export function generateAttemptAuthCode(studentName: string, date: Date, score: number): string {
  const cleanName = studentName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const timestamp = date.getTime().toString(36).toUpperCase();
  const rawSum = cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + score * 7;
  const hash = Math.abs(rawSum).toString(16).toUpperCase().padStart(4, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SEA-${hash}-${timestamp.slice(-4)}-${randomSuffix}`;
}
