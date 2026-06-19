import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookingClipProps {
  active: boolean;
}

const STEPS = [
  { emoji: '🥬', label: 'Zwiebeln' },
  { emoji: '🧄', label: 'Knoblauch' },
  { emoji: '🍅', label: 'Tomaten' },
  { emoji: '🍝', label: 'Pasta' },
  { emoji: '🧀', label: 'Parmesan' },
];

export function CookingClip({ active }: CookingClipProps) {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setStepIdx(i => (i + 1) % STEPS.length), 1800);
    return () => clearInterval(t);
  }, [active]);

  const step = STEPS[stepIdx];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, #f6c177 0%, #e89b3c 50%, #b8541d 100%)',
      overflow: 'hidden',
    }}>
      {/* Heat shimmer */}
      <motion.div
        animate={active ? { opacity: [0.15, 0.35, 0.15] } : { opacity: 0.2 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 70%, rgba(255,200,100,0.6) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Pan */}
      <motion.div
        animate={active ? { rotate: [-2, 2, -2], y: [0, -3, 0] } : { rotate: 0, y: 0 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '20%',
          transform: 'translateX(-50%)',
          width: 220,
          height: 200,
        }}
      >
        {/* Pan body */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          background: 'linear-gradient(180deg, #2a2a2a 0%, #0e0e0e 100%)',
          borderRadius: '50% 50% 8px 8px / 60% 60% 12px 12px',
          boxShadow: 'inset 0 6px 12px rgba(255,255,255,0.18), 0 8px 18px rgba(0,0,0,0.5)',
        }} />
        {/* Handle */}
        <div style={{
          position: 'absolute',
          bottom: 28,
          right: -90,
          width: 100,
          height: 14,
          background: 'linear-gradient(180deg, #1a1a1a, #000)',
          borderRadius: 7,
          boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
        }} />
        {/* Sizzle / contents */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: 18,
          right: 18,
          height: 30,
          background: 'radial-gradient(ellipse at 50% 50%, #d97a3a 0%, #5c2a10 80%)',
          borderRadius: '50%',
          opacity: 0.85,
        }} />

        {/* Steam */}
        {active && [0, 1, 2].map(i => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0, scale: 0.6 }}
            animate={{ y: -120, opacity: [0, 0.6, 0], scale: 1.4 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: -10,
              left: 50 + i * 50,
              width: 40,
              height: 40,
              background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)',
              filter: 'blur(4px)',
            }}
          />
        ))}
      </motion.div>

      {/* Falling ingredient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIdx}
          initial={{ y: -40, opacity: 0, rotate: -30, scale: 0.5 }}
          animate={{ y: 240, opacity: 1, rotate: 30, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.6, 1] }}
          style={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 64,
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
          }}
        >
          {step.emoji}
        </motion.div>
      </AnimatePresence>

      {/* Step label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={'lbl-' + stepIdx}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 90,
            left: 16,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0.3,
          }}
        >
          Schritt {stepIdx + 1}: {step.label}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
