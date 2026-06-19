import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  questionInCategory: number;
  questionsPerCategory: number;
  categoryIndex: number;
  totalCategories: number;
}

export function ProgressBar({ current, total, questionInCategory, questionsPerCategory }: ProgressBarProps) {
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 220 }}>
      <div
        style={{
          flex: 1,
          height: 7,
          background: 'var(--color-divider)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: '100%', background: 'var(--color-primary)' }}
        />
      </div>
      <span
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        Frage {questionInCategory}&thinsp;/&thinsp;{questionsPerCategory}
      </span>
    </div>
  );
}
