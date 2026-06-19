import type { Question, CategoryType } from '../types';
import { CATEGORIES } from './categories';

export const QUESTIONS_PER_CATEGORY = 3;

const EASY_QUESTIONS: Question[] = [
  {
    id: 'e1_mult_8x7',
    difficulty: 'easy',
    text: 'Was ergibt 8 × 7?',
    options: ['56', '54', '64', '49', '63'],
    correctIndex: 0,
  },
  {
    id: 'e2_mult_6x9',
    difficulty: 'easy',
    text: 'Was ergibt 6 × 9?',
    options: ['45', '54', '48', '52', '56'],
    correctIndex: 1,
  },
  {
    id: 'e3_mult_13x4',
    difficulty: 'easy',
    text: 'Was ergibt 13 × 4?',
    options: ['46', '48', '52', '56', '42'],
    correctIndex: 2,
  },
  {
    id: 'e4_mult_15x6',
    difficulty: 'easy',
    text: 'Was ergibt 15 × 6?',
    options: ['75', '80', '85', '90', '95'],
    correctIndex: 3,
  },
  {
    id: 'e5_mult_12x8',
    difficulty: 'easy',
    text: 'Was ergibt 12 × 8?',
    options: ['84', '88', '100', '104', '96'],
    correctIndex: 4,
  },
  {
    id: 'e6_mult_11x7',
    difficulty: 'easy',
    text: 'Was ergibt 11 × 7?',
    options: ['77', '66', '70', '84', '88'],
    correctIndex: 0,
  },
];

const MEDIUM_QUESTIONS: Question[] = [
  {
    id: 'm1_seq_diffs',
    difficulty: 'medium',
    text: 'Welche Zahl kommt als nächstes in der Folge?\n\n2 – 6 – 12 – 20 – 30 – ?',
    options: ['36', '42', '40', '44', '48'],
    correctIndex: 1,
  },
  {
    id: 'm2_seq_squares',
    difficulty: 'medium',
    text: 'Welche Zahl kommt als nächstes in der Folge?\n\n1 – 4 – 9 – 16 – ?',
    options: ['20', '23', '25', '32', '36'],
    correctIndex: 2,
  },
  {
    id: 'm3_seq_diffs2',
    difficulty: 'medium',
    text: 'Welche Zahl kommt als nächstes in der Folge?\n\n3 – 7 – 13 – 21 – 31 – ?',
    options: ['39', '41', '45', '43', '47'],
    correctIndex: 3,
  },
  {
    id: 'm4_seq_triple',
    difficulty: 'medium',
    text: 'Welche Zahl kommt als nächstes in der Folge?\n\n1 – 3 – 9 – 27 – ?',
    options: ['54', '63', '72', '90', '81'],
    correctIndex: 4,
  },
  {
    id: 'm5_seq_nsq1',
    difficulty: 'medium',
    text: 'Welche Zahl kommt als nächstes in der Folge?\n\n2 – 5 – 10 – 17 – 26 – ?',
    options: ['37', '33', '35', '39', '42'],
    correctIndex: 0,
  },
  {
    id: 'm6_seq_double1',
    difficulty: 'medium',
    text: 'Welche Zahl kommt als nächstes in der Folge?\n\n5 – 11 – 23 – 47 – ?',
    options: ['89', '95', '91', '93', '97'],
    correctIndex: 1,
  },
];

const HARD_QUESTIONS: Question[] = [
  {
    id: 'h1_analogy_director',
    difficulty: 'hard',
    text: 'Dirigent verhält sich zu Orchester\nwie Regisseur verhält sich zu ?',
    options: ['Drehbuch', 'Film', 'Schauspieler', 'Taktstock', 'Bühne'],
    correctIndex: 2,
  },
  {
    id: 'h2_analogy_silk',
    difficulty: 'hard',
    text: 'Biene verhält sich zu Honig\nwie Seidenraupe verhält sich zu ?',
    options: ['Kokon', 'Schmetterling', 'Wolle', 'Seide', 'Wabe'],
    correctIndex: 3,
  },
  {
    id: 'h3_analogy_note',
    difficulty: 'hard',
    text: 'Wort verhält sich zu Satz\nwie Note verhält sich zu ?',
    options: ['Akkord', 'Ton', 'Lied', 'Absatz', 'Melodie'],
    correctIndex: 4,
  },
  {
    id: 'h4_analogy_vaccine',
    difficulty: 'hard',
    text: 'Impfung verhält sich zu Krankheit\nwie Sonnencreme verhält sich zu ?',
    options: ['Sonnenbrand', 'Strand', 'Feuchtigkeitscreme', 'Hitze', 'Virus'],
    correctIndex: 0,
  },
  {
    id: 'h5_analogy_composer',
    difficulty: 'hard',
    text: 'Autor verhält sich zu Roman\nwie Komponist verhält sich zu ?',
    options: ['Notenblatt', 'Sinfonie', 'Konzert', 'Instrument', 'Verleger'],
    correctIndex: 1,
  },
  {
    id: 'h6_analogy_painter',
    difficulty: 'hard',
    text: 'Chirurg verhält sich zu Skalpell\nwie Maler verhält sich zu ?',
    options: ['Palette', 'Gemälde', 'Pinsel', 'Spachtel', 'Klinik'],
    correctIndex: 2,
  },
];

const EXPERT_QUESTIONS: Question[] = [
  {
    id: 'x1_logic_chain',
    difficulty: 'expert',
    text: 'Nur wenn X wahr ist, ist Y wahr.\nX ist falsch.\nZ ist wahr genau dann, wenn Y falsch ist.\n\nWas gilt für Z?',
    options: [
      'Z ist wahr',
      'Z ist falsch',
      'Z ist unbestimmt',
      'Z hängt von X ab',
      'Keine Aussage möglich',
    ],
    correctIndex: 0,
  },
  {
    id: 'x2_look_and_say',
    difficulty: 'expert',
    text: 'Welche Zahl kommt als nächstes in der Folge?\n\n1 – 11 – 21 – 1211 – 111221 – ?',
    options: ['122112', '312211', '211111', '211221', '132231'],
    correctIndex: 1,
  },
  {
    id: 'x3_liars',
    difficulty: 'expert',
    text: 'Drei Personen machen je eine Aussage:\nA sagt: „B lügt."\nB sagt: „C lügt."\nC sagt: „A und B lügen beide."\n\nWer sagt die Wahrheit?',
    options: ['Nur A', 'Nur B', 'Nur C', 'A und B', 'B und C'],
    correctIndex: 1,
  },
  {
    id: 'x4_inclusion_exclusion',
    difficulty: 'expert',
    text: 'In einem Dorf mit 100 Einwohnern trinken 70 Personen Kaffee und 80 Personen Tee.\n\nWie viele trinken MINDESTENS beides?',
    options: ['30', '40', '50', '60', '70'],
    correctIndex: 2,
  },
  {
    id: 'x5_factorial',
    difficulty: 'expert',
    text: 'Welche Zahl kommt als nächstes in der Folge?\n\n1 – 2 – 6 – 24 – 120 – ?',
    options: ['360', '480', '600', '720', '840'],
    correctIndex: 3,
  },
  {
    id: 'x6_snail',
    difficulty: 'expert',
    text: 'Eine Schnecke klettert tagsüber 3 m einen 10 m tiefen Brunnen hinauf und rutscht nachts 2 m zurück.\n\nAn welchem Tag erreicht sie den Rand?',
    options: ['Tag 6', 'Tag 7', 'Tag 8', 'Tag 9', 'Tag 10'],
    correctIndex: 2,
  },
];

if (
  EASY_QUESTIONS.length !== CATEGORIES.length ||
  MEDIUM_QUESTIONS.length !== CATEGORIES.length ||
  HARD_QUESTIONS.length !== CATEGORIES.length ||
  EXPERT_QUESTIONS.length !== CATEGORIES.length
) {
  throw new Error('Anzahl Aufgaben pro Schwierigkeit muss gleich Anzahl Kategorien sein.');
}

export function buildQuestionSequence(): Array<Question & { category: CategoryType }> {
  return CATEGORIES.flatMap((cat, i) => [
    { ...EASY_QUESTIONS[i], category: cat.type },
    { ...MEDIUM_QUESTIONS[i], category: cat.type },
    { ...HARD_QUESTIONS[i], category: cat.type },
  ]);
}
