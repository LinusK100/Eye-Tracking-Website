import { motion } from 'framer-motion';

interface DanceClipProps {
  active: boolean;
}

export function DanceClip({ active }: DanceClipProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: '#0a0a14',
    }}>
      {/* Pulsing colored gradient backdrop, beat-synced */}
      <motion.div
        animate={active ? {
          background: [
            'radial-gradient(circle at 30% 30%, #ff006e 0%, #8338ec 40%, #3a0ca3 100%)',
            'radial-gradient(circle at 70% 30%, #f72585 0%, #b5179e 40%, #560bad 100%)',
            'radial-gradient(circle at 50% 70%, #ff5400 0%, #ff006e 40%, #480ca8 100%)',
            'radial-gradient(circle at 30% 30%, #ff006e 0%, #8338ec 40%, #3a0ca3 100%)',
          ],
        } : {}}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Strobe flashes */}
      {active && (
        <motion.div
          animate={{ opacity: [0, 0, 0.4, 0, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Spotlight rays */}
      {active && [0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ rotate: [0 + i * 60, 360 + i * 60] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: 4,
            height: '120%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)',
            transformOrigin: 'top center',
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* Dancer silhouette */}
      <motion.svg
        viewBox="0 0 200 360"
        animate={active ? {
          x: [-8, 8, -8, 8, -8],
          rotate: [-3, 3, -3, 3, -3],
        } : {}}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '12%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 360,
          filter: 'drop-shadow(0 0 24px rgba(255, 0, 110, 0.6))',
        }}
      >
        {/* Head */}
        <motion.circle
          cx="100"
          cy="40"
          r="22"
          fill="#1a1a2e"
          animate={active ? { y: [0, -6, 0] } : {}}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Body */}
        <path d="M 80 65 L 120 65 L 130 180 L 110 180 L 100 130 L 90 180 L 70 180 Z" fill="#1a1a2e" />
        {/* Arms */}
        <motion.g
          animate={active ? { rotate: [-30, 40, -30] } : {}}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '85px 75px' }}
        >
          <path d="M 80 70 L 50 130 L 56 138 L 88 80 Z" fill="#1a1a2e" />
        </motion.g>
        <motion.g
          animate={active ? { rotate: [30, -40, 30] } : {}}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '115px 75px' }}
        >
          <path d="M 120 70 L 150 130 L 144 138 L 112 80 Z" fill="#1a1a2e" />
        </motion.g>
        {/* Legs */}
        <motion.g
          animate={active ? { rotate: [-12, 12, -12] } : {}}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 180px' }}
        >
          <path d="M 90 180 L 80 280 L 90 282 L 100 182 Z" fill="#1a1a2e" />
          <path d="M 110 180 L 120 280 L 110 282 L 100 182 Z" fill="#1a1a2e" />
        </motion.g>
      </motion.svg>

      {/* Beat indicator dots */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 16,
        display: 'flex',
        gap: 6,
        alignItems: 'center',
      }}>
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={active ? { scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 0 8px rgba(255,255,255,0.8)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
