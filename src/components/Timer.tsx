import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  duration?: number;
  active: boolean;
  onTimeout: () => void;
  onPhaseChange?: (phase: 'normal' | 'alert' | 'warning') => void;
}

const RADIUS = 31;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Timer({ duration = 15, active, onTimeout, onPhaseChange }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const onTimeoutRef = useRef(onTimeout);
  const onPhaseChangeRef = useRef(onPhaseChange);

  useEffect(() => { onTimeoutRef.current = onTimeout; }, [onTimeout]);
  useEffect(() => { onPhaseChangeRef.current = onPhaseChange; }, [onPhaseChange]);

  useEffect(() => {
    if (!active) return;
    const startTime = Date.now();
    let fired = false;
    const id = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newRemaining = Math.max(0, duration - elapsed);
      setRemaining(newRemaining);
      if (newRemaining <= 0 && !fired) {
        fired = true;
        window.clearInterval(id);
        onTimeoutRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [active, duration]);

  const isWarning = remaining <= 3;
  const isAlert = remaining <= 5;

  useEffect(() => {
    if (isWarning) onPhaseChangeRef.current?.('warning');
    else if (isAlert) onPhaseChangeRef.current?.('alert');
    else onPhaseChangeRef.current?.('normal');
  }, [isWarning, isAlert]);

  const progress = remaining / duration;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const displaySeconds = Math.ceil(remaining);

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Verbleibende Zeit: ${displaySeconds} Sekunden`}
      style={{ position: 'relative', width: 78, height: 78 }}
    >
      <svg width="78" height="78" viewBox="0 0 78 78" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="39"
          cy="39"
          r={RADIUS}
          fill="none"
          stroke="var(--color-divider)"
          strokeWidth="5"
        />
        <motion.circle
          cx="39"
          cy="39"
          r={RADIUS}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          animate={{ stroke: isWarning ? 'var(--color-error)' : 'var(--color-primary)' }}
          transition={{ duration: 0.3 }}
          style={{ transition: 'stroke-dashoffset 100ms linear' }}
        />
      </svg>
      <motion.span
        animate={{ color: isWarning ? 'var(--color-error)' : 'var(--color-text)' }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.35rem',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {displaySeconds}
      </motion.span>
    </div>
  );
}
