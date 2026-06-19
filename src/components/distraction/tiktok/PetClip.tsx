import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PetClipProps {
  active: boolean;
}

export function PetClip({ active }: PetClipProps) {
  // Ball position bouncing across the floor
  const [ballX, setBallX] = useState(80);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setBallX(x => (x > 250 ? 80 : x + 25));
    }, 350);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #ffd6a5 0%, #ffc09f 60%, #c69c81 100%)',
    }}>
      {/* Sun */}
      <div style={{
        position: 'absolute',
        top: 60,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #ffe066 0%, #ffb703 80%)',
        filter: 'blur(1px)',
        boxShadow: '0 0 40px rgba(255,176,3,0.6)',
      }} />

      {/* Window frame */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 30,
        right: 30,
        height: 200,
        border: '6px solid #6f4e37',
        borderRadius: 4,
        background: 'linear-gradient(180deg, #cee6f3 0%, #a3c4d9 100%)',
        opacity: 0.55,
      }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 4, background: '#6f4e37' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, background: '#6f4e37' }} />
      </div>

      {/* Floor */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(180deg, #a07050 0%, #6b4226 100%)',
      }} />

      {/* Ball */}
      <motion.div
        animate={active ? { y: [0, -30, 0] } : {}}
        transition={{ duration: 0.35, repeat: Infinity, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '24%',
          left: ballX,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #ff5252 0%, #b22222 80%)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
        }}
      />

      {/* Cat - chasing the ball */}
      <motion.div
        animate={active ? {
          x: [0, 30, 0, 30, 0],
          rotate: [0, -5, 0, 5, 0],
        } : {}}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '22%',
          left: 50,
          width: 140,
          height: 100,
        }}
      >
        <svg viewBox="0 0 140 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
          {/* Body */}
          <ellipse cx="70" cy="65" rx="45" ry="22" fill="#3d3d3d" />
          {/* Head */}
          <circle cx="115" cy="50" r="22" fill="#3d3d3d" />
          {/* Ears */}
          <polygon points="100,32 105,15 115,28" fill="#3d3d3d" />
          <polygon points="120,28 130,12 132,32" fill="#3d3d3d" />
          {/* Inner ears */}
          <polygon points="103,28 107,20 112,28" fill="#ff8a80" />
          <polygon points="122,26 128,18 130,28" fill="#ff8a80" />
          {/* Eyes */}
          <ellipse cx="111" cy="50" rx="2.5" ry="4" fill="#ffeb3b" />
          <ellipse cx="121" cy="50" rx="2.5" ry="4" fill="#ffeb3b" />
          <circle cx="111" cy="50" r="1" fill="#000" />
          <circle cx="121" cy="50" r="1" fill="#000" />
          {/* Nose */}
          <path d="M 115 56 L 113 58 L 117 58 Z" fill="#ff8a80" />
          {/* Whiskers */}
          <line x1="100" y1="56" x2="90" y2="54" stroke="#fff" strokeWidth="0.8" />
          <line x1="100" y1="58" x2="90" y2="60" stroke="#fff" strokeWidth="0.8" />
          <line x1="130" y1="56" x2="138" y2="54" stroke="#fff" strokeWidth="0.8" />
          <line x1="130" y1="58" x2="138" y2="60" stroke="#fff" strokeWidth="0.8" />
          {/* Legs */}
          <rect x="40" y="78" width="8" height="14" fill="#3d3d3d" rx="2" />
          <rect x="56" y="80" width="8" height="12" fill="#3d3d3d" rx="2" />
          <rect x="80" y="80" width="8" height="12" fill="#3d3d3d" rx="2" />
          <rect x="96" y="78" width="8" height="14" fill="#3d3d3d" rx="2" />
          {/* Tail */}
          <motion.path
            d="M 28 60 Q 5 50 15 25"
            stroke="#3d3d3d"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            animate={active ? { rotate: [-15, 15, -15] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '28px 60px' }}
          />
        </svg>
      </motion.div>

      {/* Hearts floating up */}
      {active && [0, 1, 2].map(i => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{ y: -200, opacity: [0, 1, 0], scale: 1.2 }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1.1, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: '40%',
            left: 80 + i * 60,
            fontSize: 22,
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}
