import { motion } from 'framer-motion';

interface SpaceSceneProps {
  active: boolean;
}

export function SpaceScene({ active }: SpaceSceneProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 30% 50%, #1a0040 0%, #050020 50%, #000010 100%)',
    }}>
      {/* Distant nebula */}
      <motion.div
        animate={active ? { opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(180,80,200,0.5) 0%, rgba(60,30,120,0.3) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <motion.div
        animate={active ? { opacity: [0.3, 0.6, 0.3] } : {}}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(80,180,220,0.4) 0%, rgba(20,60,140,0.2) 50%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      {/* Far stars layer (slow) */}
      <motion.div
        animate={active ? { x: [0, -100] } : {}}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, width: '200%' }}
      >
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${(i * 13) % 100}%`,
              left: `${(i * 17) % 200}%`,
              width: 1,
              height: 1,
              background: '#fff',
              borderRadius: '50%',
              opacity: 0.4 + (i % 4) * 0.15,
            }}
          />
        ))}
      </motion.div>

      {/* Near stars layer (fast) */}
      <motion.div
        animate={active ? { x: [0, -200] } : {}}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, width: '200%' }}
      >
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={active ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.5 + (i % 3), repeat: Infinity, delay: i * 0.1 }}
            style={{
              position: 'absolute',
              top: `${(i * 11) % 100}%`,
              left: `${(i * 23) % 200}%`,
              width: 2,
              height: 2,
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 0 4px rgba(255,255,255,0.8)',
            }}
          />
        ))}
      </motion.div>

      {/* Planet */}
      <motion.div
        animate={active ? { y: [0, -8, 0] } : {}}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          right: '12%',
          top: '25%',
          width: 130,
          height: 130,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #ffb87a 0%, #c46a2a 35%, #6b2a08 80%, #1a0800 100%)',
          boxShadow: 'inset -25px -25px 60px rgba(0,0,0,0.7), 0 0 60px rgba(255,140,60,0.3)',
        }}
      >
        {/* Planet rings */}
        <div style={{
          position: 'absolute',
          top: '38%',
          left: '-30%',
          right: '-30%',
          height: '24%',
          border: '4px solid rgba(255,200,140,0.4)',
          borderRadius: '50%',
          transform: 'rotate(-18deg)',
          borderLeftColor: 'transparent',
          borderRightColor: 'rgba(255,200,140,0.7)',
        }} />
      </motion.div>

      {/* Spaceship */}
      <motion.div
        animate={active ? {
          x: [-200, window.innerWidth + 100],
          y: [-30, 30, -30],
        } : { x: 0 }}
        transition={{
          x: { duration: 14, repeat: Infinity, ease: 'linear' },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          position: 'absolute',
          top: '55%',
          left: 0,
          width: 140,
          height: 60,
        }}
      >
        <svg viewBox="0 0 140 60" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 20px rgba(120,180,255,0.6))' }}>
          {/* Engine glow trail */}
          <ellipse cx="20" cy="30" rx="25" ry="6" fill="url(#engineGlow)" opacity="0.8" />
          <defs>
            <linearGradient id="engineGlow" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="rgba(80,180,255,0)" />
              <stop offset="50%" stopColor="rgba(120,200,255,0.7)" />
              <stop offset="100%" stopColor="rgba(220,240,255,1)" />
            </linearGradient>
          </defs>
          {/* Body */}
          <path d="M 40 30 L 60 22 L 110 22 L 130 30 L 110 38 L 60 38 Z" fill="#9aa4b0" />
          <path d="M 40 30 L 60 22 L 110 22 L 130 30 L 110 38 L 60 38 Z" fill="url(#bodyShine)" opacity="0.6" />
          <defs>
            <linearGradient id="bodyShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0e6ee" />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="100%" stopColor="#3a4250" />
            </linearGradient>
          </defs>
          {/* Cockpit */}
          <ellipse cx="105" cy="28" rx="14" ry="6" fill="#3a8acf" opacity="0.85" />
          <ellipse cx="103" cy="26" rx="6" ry="2" fill="#a5d8ff" opacity="0.7" />
          {/* Wings */}
          <path d="M 70 22 L 75 14 L 95 14 L 90 22 Z" fill="#6a747f" />
          <path d="M 70 38 L 75 46 L 95 46 L 90 38 Z" fill="#6a747f" />
          {/* Lights */}
          <circle cx="125" cy="30" r="2" fill="#ff5050" />
          <circle cx="115" cy="22" r="1.5" fill="#50ff80" />
        </svg>
      </motion.div>

      {/* Lens flare on planet */}
      <motion.div
        animate={active ? { opacity: [0.4, 0.7, 0.4] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '30%',
          right: '18%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 0 30px 8px rgba(255,255,255,0.7)',
        }}
      />
    </div>
  );
}
