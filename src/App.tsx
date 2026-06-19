import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Answer, CategoryType, Question } from './types';
import { CATEGORIES } from './data/categories';
import { buildQuestionSequence, QUESTIONS_PER_CATEGORY } from './data/questions';
import { TitleScreen } from './components/TitleScreen';
import { TaskScreen } from './components/TaskScreen';
import { CategoryBanner } from './components/CategoryBanner';
import { ResultScreen } from './components/ResultScreen';

type Screen = 'title' | 'task' | 'result';

const BANNER_DURATION = 2000;
const BANNER_DELAY_AFTER_FEEDBACK = 200;
const ANIMATION_FALLBACK_KEY = 'eyetracking_use_animation';

function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showCategoryBanner, setShowCategoryBanner] = useState(false);
  const [useAnimationFallback, setUseAnimationFallback] = useState<boolean>(() => {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(ANIMATION_FALLBACK_KEY) === 'true';
  });
  const studyStartTimeRef = useRef<number | null>(null);
  const studyEndTimeRef = useRef<number | null>(null);

  const handleAnimationFallbackChange = useCallback((next: boolean) => {
    setUseAnimationFallback(next);
    try {
      localStorage.setItem(ANIMATION_FALLBACK_KEY, String(next));
    } catch {
      // ignore storage failures (private mode etc.)
    }
  }, []);

  const allQuestions = useMemo<Array<Question & { category: CategoryType }>>(
    () => buildQuestionSequence(),
    []
  );
  const totalQuestions = allQuestions.length;
  const currentQuestion = allQuestions[currentIndex];
  const currentCategory = useMemo(
    () => CATEGORIES.find((c) => c.type === currentQuestion?.category) ?? CATEGORIES[0],
    [currentQuestion]
  );

  const startStudy = useCallback(() => {
    setAnswers([]);
    setCurrentIndex(0);
    studyStartTimeRef.current = Date.now();
    studyEndTimeRef.current = null;
    setScreen('task');
  }, []);

  const restart = useCallback(() => {
    setScreen('title');
    setAnswers([]);
    setCurrentIndex(0);
    setShowCategoryBanner(false);
    studyStartTimeRef.current = null;
    studyEndTimeRef.current = null;
  }, []);

  const handleAnswer = useCallback(
    (selectedIndex: number | null, timeSpent: number) => {
      const q = allQuestions[currentIndex];
      const correct = selectedIndex !== null && selectedIndex === q.correctIndex;
      const newAnswer: Answer = {
        questionId: q.id,
        category: q.category,
        selectedIndex,
        correct,
        timeSpent,
        difficulty: q.difficulty,
      };
      setAnswers((prev) => [...prev, newAnswer]);

      const nextIndex = currentIndex + 1;
      if (nextIndex >= totalQuestions) {
        studyEndTimeRef.current = Date.now();
        setScreen('result');
        return;
      }

      const startsNewCategory = nextIndex % QUESTIONS_PER_CATEGORY === 0;

      if (startsNewCategory) {
        window.setTimeout(() => {
          setShowCategoryBanner(true);
          window.setTimeout(() => {
            setShowCategoryBanner(false);
            setCurrentIndex(nextIndex);
          }, BANNER_DURATION);
        }, BANNER_DELAY_AFTER_FEEDBACK);
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [allQuestions, currentIndex, totalQuestions]
  );

  const totalTimeSeconds = useMemo(() => {
    if (!studyStartTimeRef.current) return 0;
    const end = studyEndTimeRef.current ?? Date.now();
    return (end - studyStartTimeRef.current) / 1000;
  }, [screen]);

  const nextCategoryForBanner = useMemo(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= totalQuestions) return null;
    const nextCat = allQuestions[nextIdx]?.category;
    return CATEGORIES.find((c) => c.type === nextCat) ?? null;
  }, [currentIndex, allQuestions, totalQuestions]);

  const nextCategoryNumber = useMemo(() => {
    if (!nextCategoryForBanner) return 0;
    return CATEGORIES.findIndex((c) => c.type === nextCategoryForBanner.type) + 1;
  }, [nextCategoryForBanner]);

  return (
    <>
      <AnimatePresence mode="wait">
        {screen === 'title' && (
          <TitleScreen
            key="title"
            onStart={startStudy}
            useAnimation={useAnimationFallback}
            onAnimationChange={handleAnimationFallbackChange}
          />
        )}

        {screen === 'task' && currentQuestion && currentCategory && (
          <TaskScreen
            key="task"
            question={currentQuestion}
            category={currentCategory}
            questionNumber={currentIndex + 1}
            total={totalQuestions}
            onAnswer={handleAnswer}
            useAnimationFallback={useAnimationFallback}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            key="result"
            answers={answers}
            totalTimeSeconds={totalTimeSeconds}
            onRestart={restart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCategoryBanner && (
          <CategoryBanner
            key="banner"
            index={nextCategoryNumber}
            total={CATEGORIES.length}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
