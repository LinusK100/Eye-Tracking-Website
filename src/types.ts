export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type CategoryType =
  | 'no_distraction'
  | 'tiktok_no_sound'
  | 'tiktok_with_sound'
  | 'movie_no_sound'
  | 'movie_with_sound'
  | 'iphone';

export type NotificationType = 'lock_screen' | 'chat' | 'call';

export interface Question {
  id: string;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface CategoryConfig {
  type: CategoryType;
  label: string;
  hasVideo: boolean;
  hasSound: boolean;
  videoSrc: string;
  videoSrcs?: string[];
  notificationType?: NotificationType;
  notificationTypes?: Partial<Record<Difficulty, NotificationType>>;
}

export interface Answer {
  questionId: string;
  category: CategoryType;
  selectedIndex: number | null;
  correct: boolean;
  timeSpent: number;
  difficulty: Difficulty;
}
