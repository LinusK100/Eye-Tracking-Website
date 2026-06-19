import { motion } from 'framer-motion';

interface ChaseSceneProps {
  active: boolean;
}

export function ChaseScene({ active }: ChaseSceneProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0a0e2e 0%, #1a1745 35%, #2a1659 60%, #4a1d4d 100%)',
    }}>
      {/* Moon */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '12%',
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #f5f3e7 0%, #d4d2c0 70%, #807e6d 100%)',
        boxShadow: '0 0 40px rgba(255,255,255,0.4)',
      }} />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={active ? { opacity: [0.3, 1, 0.3] } : {}}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.13 }}
          style={{
            position: 'absolute',
            top: `${5 + (i * 7) % 35}%`,
            left: `${(i * 13) % 100}%`,
            width: 2,
            height: 2,
            background: '#fff',
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Distant skyline */}
      <motion.div
        animate={active ? { x: [0, -200] } : {}}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: '40%',
          left: 0,
          width: '300%',
          height: '20%',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 30 + (i * 7) % 40,
              height: 40 + (i * 11) % 80,
              background: '#0a0518',
              marginRight: 4,
              borderTop: '2px solid #1a0a30',
              boxShadow: 'inset 0 0 8px #2a1659',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Windows */}
            {[...Array(3)].map((_, j) => (
              <div
                key={j}
                style={{
                  position: 'absolute',
                  top: 8 + j * 12,
                  left: 4,
                  width: 4,
                  height: 5,
                  background: ((i + j) % 3) === 0 ? '#ffd166' : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </motion.div>

      {/* Road */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
      }}>
        {/* Road markings */}
        <motion.div
          animate={active ? { x: [-80, 0] } : {}}
          transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: '40%',
            left: 0,
            right: -80,
            height: 4,
            display: 'flex',
            gap: 40,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{ width: 40, height: 4, background: '#ffd166', flexShrink: 0 }} />
          ))}
        </motion.div>
      </div>

      {/* Police car (front) */}
      <motion.div
        animate={active ? {
          x: [-30, 30, -30],
          y: [0, -2, 0],
        } : {}}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '15%',
          width: 110,
          height: 50,
        }}
      >
        <svg viewBox="0 0 110 50" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))' }}>
          {/* Body */}
          <path d="M 5 38 L 5 28 L 25 18 L 75 18 L 95 28 L 105 28 L 105 38 Z" fill="#1a3a8a" />
          <path d="M 25 18 L 35 22 L 35 30 L 25 30 Z" fill="#5a8acf" opacity="0.7" />
          <path d="M 75 18 L 65 22 L 65 30 L 75 30 Z" fill="#5a8acf" opacity="0.7" />
          <rect x="35" y="22" width="30" height="8" fill="#5a8acf" opacity="0.7" />
          {/* Lights bar */}
          <motion.rect
            x="40" y="13" width="14" height="5" rx="1" fill="#ff3b30"
            animate={active ? { opacity: [1, 0.2, 1] } : {}}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
          <motion.rect
            x="56" y="13" width="14" height="5" rx="1" fill="#3b82ff"
            animate={active ? { opacity: [0.2, 1, 0.2] } : {}}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
          {/* Wheels */}
          <circle cx="25" cy="40" r="8" fill="#0a0a0a" />
          <circle cx="25" cy="40" r="4" fill="#3a3a3a" />
          <circle cx="85" cy="40" r="8" fill="#0a0a0a" />
          <circle cx="85" cy="40" r="4" fill="#3a3a3a" />
          {/* Headlights */}
          <circle cx="103" cy="32" r="3" fill="#fff7c2" />
        </svg>
      </motion.div>

      {/* Suspect car (further ahead) */}
      <motion.div
        animate={active ? {
          x: [10, -10, 10],
          y: [0, -1, 0],
        } : {}}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '11%',
          right: '15%',
          width: 90,
          height: 40,
        }}
      >
        <svg viewBox="0 0 90 40" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))' }}>
          <path d="M 4 30 L 4 22 L 20 14 L 60 14 L 80 22 L 86 22 L 86 30 Z" fill="#8a0000" />
          <path d="M 20 14 L 28 18 L 28 24 L 20 24 Z" fill="#ff4040" opacity="0.5" />
          <rect x="28" y="18" width="24" height="6" fill="#ff4040" opacity="0.5" />
          <circle cx="20" cy="32" r="6" fill="#0a0a0a" />
          <circle cx="68" cy="32" r="6" fill="#0a0a0a" />
          {/* Tail lights */}
          <motion.circle
            cx="6" cy="24" r="2" fill="#ff0000"
            animate={active ? { opacity: [1, 0.4, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Speed lines / motion blur */}
      {active && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ x: [400, -100], opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.07, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: `${50 + (i * 5) % 25}%`,
            left: 0,
            width: 80,
            height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}
