import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

export type FeedbackKind = 'correct' | 'wrong' | 'timeout';

interface AnswerFeedbackProps {
  kind: FeedbackKind;
  correctLetter?: string;
}

const CONFETTI_COLORS = ['#01696f', '#2e7d32', '#e67e22', '#7b2fbe', '#4f98a3', '#f4c83a'];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function AnswerFeedbackInner({ kind, correctLetter }: AnswerFeedbackProps) {
  const confetti = useMemo(() => {
    if (kind !== 'correct') return [];
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: rand(-150, 150),
      y: rand(-220, -50),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      duration: 1.0 + Math.random() * 0.5,
      size: rand(6, 12),
    }));
  }, [kind]);

  const overlayBg =
    kind === 'correct'
      ? 'rgba(46, 125, 50, 0.20)'
      : kind === 'wrong'
        ? 'rgba(198, 40, 40, 0.15)'
        : 'rgba(107, 107, 107, 0.18)';

  const accentColor =
    kind === 'correct'
      ? 'var(--color-success)'
      : kind === 'wrong'
        ? 'var(--color-error)'
        : 'var(--color-text-muted)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: overlayBg,
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        pointerEvents: 'none',
      }}
      role="status"
      aria-live="assertive"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-3)',
          color: accentColor,
        }}
      >
        {kind === 'correct' && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: 1 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'var(--color-success)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(46, 125, 50, 0.4)',
              }}
            >
              <Check size={56} strokeWidth={3} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-success)' }}
            >
              Richtig!
            </motion.span>
            {confetti.map((p) => (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
                transition={{ duration: p.duration, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  background: p.color,
                }}
              />
            ))}
          </>
        )}

        {kind === 'wrong' && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: 1 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'var(--color-error)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(198, 40, 40, 0.4)',
              }}
            >
              <X size={56} strokeWidth={3} />
            </motion.div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-error)' }}>
              Falsch
            </span>
            {correctLetter && (
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Richtig wäre: <strong style={{ color: 'var(--color-text)' }}>{correctLetter})</strong>
              </span>
            )}
          </>
        )}

        {kind === 'timeout' && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.15, 1], opacity: 1 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'var(--color-text-muted)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(107, 107, 107, 0.35)',
              }}
            >
              <Clock size={48} strokeWidth={2.5} />
            </motion.div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Zeit abgelaufen
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}

export const AnswerFeedback = memo(AnswerFeedbackInner);
