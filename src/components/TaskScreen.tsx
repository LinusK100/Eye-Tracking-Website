import { useMemo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CategoryConfig, Difficulty, Question } from '../types';
import { Timer } from './Timer';
import { ProgressBar } from './ProgressBar';
import { VideoPanel } from './VideoPanel';
import { IPhonePanel } from './IPhonePanel';
import { TikTokPanel } from './distraction/TikTokPanel';
import { MoviePanel } from './distraction/MoviePanel';
import { AnswerFeedback } from './AnswerFeedback';
import type { FeedbackKind } from './AnswerFeedback';
import { QUESTIONS_PER_CATEGORY } from '../data/questions';

interface TaskScreenProps {
  question: Question;
  category: CategoryConfig;
  questionNumber: number;
  total: number;
  onAnswer: (selectedIndex: number | null, timeSpent: number) => void;
  useAnimationFallback?: boolean;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Leicht',
  medium: 'Mittel',
  hard: 'Schwer',
  expert: 'Sehr schwer',
};

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'var(--color-difficulty-easy)',
  medium: 'var(--color-difficulty-medium)',
  hard: 'var(--color-difficulty-hard)',
  expert: 'var(--color-difficulty-expert)',
};

const TIME_LIMIT = 15;
const FEEDBACK_DURATION = 1500;

const buttonVariants = {
  initial: { opacity: 0, x: -8 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const shakeVariants = {
  rest: { x: 0 },
  shake: { x: [0, -12, 12, -8, 8, -4, 4, 0], transition: { duration: 0.5 } },
};

export function TaskScreen({
  question,
  category,
  questionNumber,
  total,
  onAnswer,
  useAnimationFallback = false,
}: TaskScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackKind | null>(null);
  const [timerActive, setTimerActive] = useState(true);
  const [timerPhase, setTimerPhase] = useState<'normal' | 'alert' | 'warning'>('normal');
  const startTimeRef = useRef<number>(Date.now());
  const handledRef = useRef(false);

  const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const effectiveCategory = useMemo((): CategoryConfig => {
    if (!category.videoSrcs || category.videoSrcs.length === 0) return category;
    const idx = DIFFICULTY_ORDER.indexOf(question.difficulty);
    const src = category.videoSrcs[idx >= 0 ? idx : 0];
    return { ...category, videoSrc: src, videoSrcs: [src] };
  }, [category, question.difficulty]);

  useEffect(() => {
    handledRef.current = false;
    startTimeRef.current = Date.now();
    setSelectedIndex(null);
    setFeedback(null);
    setTimerActive(true);
    setTimerPhase('normal');
  }, [question.id, category.type]);

  const handleSelection = (idx: number | null) => {
    if (handledRef.current) return;
    handledRef.current = true;
    setTimerActive(false);
    const elapsed = Math.min(TIME_LIMIT, (Date.now() - startTimeRef.current) / 1000);
    setSelectedIndex(idx);
    const correct = idx !== null && idx === question.correctIndex;
    const kind: FeedbackKind = idx === null ? 'timeout' : correct ? 'correct' : 'wrong';
    setFeedback(kind);
    window.setTimeout(() => {
      onAnswer(idx, elapsed);
    }, FEEDBACK_DURATION);
  };

  const correctLetter = String.fromCharCode(65 + question.correctIndex);
  const isWrong = feedback === 'wrong';

  const rectScale = timerPhase === 'warning'
    ? [1.18, 1.28, 1.18]
    : timerPhase === 'alert'
      ? 1.1
      : 1;

  const rectTransition = timerPhase === 'warning'
    ? { duration: 0.55, repeat: Infinity, ease: 'easeInOut' as const }
    : { duration: 0.3 };

  return (
    <div
      style={{
        height: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      <header
        style={{
          height: 60,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: '0 var(--space-5)',
          borderBottom: '1px solid var(--color-divider)',
          background: 'var(--color-surface)',
        }}
      >
        <span
          style={{
            minWidth: 90,
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            background: 'color-mix(in srgb, ' + DIFFICULTY_COLOR[question.difficulty] + ' 12%, transparent)',
            color: DIFFICULTY_COLOR[question.difficulty],
          }}
        >
          {DIFFICULTY_LABEL[question.difficulty]}
        </span>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <ProgressBar
            current={questionNumber}
            total={total}
            questionInCategory={(questionNumber - 1) % QUESTIONS_PER_CATEGORY + 1}
            questionsPerCategory={QUESTIONS_PER_CATEGORY}
            categoryIndex={Math.floor((questionNumber - 1) / QUESTIONS_PER_CATEGORY) + 1}
            totalCategories={total / QUESTIONS_PER_CATEGORY}
          />
        </div>
        <div style={{ minWidth: 90, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {category.hasSound && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Ton aktiv">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="var(--color-text-muted)" stroke="none" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </div>
      </header>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <motion.section
          variants={shakeVariants}
          animate={isWrong ? 'shake' : 'rest'}
          style={{
            position: 'relative',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
            background: 'var(--color-bg)',
            overflow: 'hidden',
          }}
        >

          <h1
            style={{
              fontSize: 'var(--text-lg)',
              lineHeight: 1.5,
              fontWeight: 500,
              color: 'var(--color-text)',
              whiteSpace: 'pre-line',
            }}
          >
            {question.text}
          </h1>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', listStyle: 'none', marginTop: 'var(--space-2)' }}>
            {question.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected = selectedIndex === i;
              const showCorrect = feedback !== null && i === question.correctIndex;
              const showWrongSel = feedback === 'wrong' && isSelected;
              return (
                <motion.li key={i} custom={i} variants={buttonVariants} initial="initial" animate="animate">
                  <button
                    aria-label={`Antwort ${letter}: ${opt}`}
                    disabled={feedback !== null}
                    onClick={() => handleSelection(i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3) var(--space-4)',
                      background: showCorrect
                        ? 'var(--color-success-bg)'
                        : showWrongSel
                          ? 'var(--color-error-bg)'
                          : 'var(--color-surface)',
                      border: '1px solid',
                      borderColor: showCorrect
                        ? 'var(--color-success)'
                        : showWrongSel
                          ? 'var(--color-error)'
                          : 'var(--color-divider)',
                      borderLeftWidth: 4,
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text)',
                      transition: 'background var(--transition), border-color var(--transition)',
                      cursor: feedback !== null ? 'default' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (feedback === null) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary-highlight)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (feedback === null) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)';
                      }
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--radius-sm)',
                        background: showCorrect
                          ? 'var(--color-success)'
                          : showWrongSel
                            ? 'var(--color-error)'
                            : 'var(--color-surface-offset)',
                        color: showCorrect || showWrongSel ? '#fff' : 'var(--color-text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                      }}
                    >
                      {letter}
                    </span>
                    <span>{opt}</span>
                  </button>
                </motion.li>
              );
            })}
          </ul>

          <AnimatePresence>
            {feedback !== null && (
              <AnswerFeedback kind={feedback} correctLetter={correctLetter} />
            )}
          </AnimatePresence>
        </motion.section>

        <section
          style={{
            position: 'relative',
            padding: 0,
            background: 'var(--color-surface)',
            borderLeft: '1px solid var(--color-divider)',
            overflow: 'hidden',
          }}
        >
          {(() => {
            const notifType =
              category.notificationTypes?.[question.difficulty] ??
              category.notificationType;
            if (notifType) {
              return (
                <IPhonePanel
                  key={question.id + category.type}
                  notificationType={notifType}
                  hasSound={category.hasSound}
                  active={timerActive}
                />
              );
            }
            if (category.hasVideo && useAnimationFallback) {
              const isTikTok = category.type.startsWith('tiktok');
              return isTikTok ? (
                <TikTokPanel
                  key={question.id + category.type + '_anim'}
                  difficulty={question.difficulty}
                  hasSound={category.hasSound}
                  active={timerActive}
                />
              ) : (
                <MoviePanel
                  key={question.id + category.type + '_anim'}
                  difficulty={question.difficulty}
                  hasSound={category.hasSound}
                  active={timerActive}
                />
              );
            }
            return (
              <VideoPanel
                key={question.id + category.type}
                category={effectiveCategory}
                active={timerActive}
              />
            );
          })()}
        </section>
      </div>

      <motion.div
        animate={{ x: '-50%', scale: rectScale }}
        transition={rectTransition}
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          background: 'var(--color-surface)',
          borderRadius: 16,
          padding: '10px 52px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          zIndex: 100,
        }}
      >
        <Timer
          key={question.id + category.type}
          active={timerActive}
          duration={TIME_LIMIT}
          onTimeout={() => handleSelection(null)}
          onPhaseChange={setTimerPhase}
        />
      </motion.div>
    </div>
  );
}
