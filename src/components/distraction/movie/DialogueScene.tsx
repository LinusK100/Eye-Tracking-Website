import { motion } from 'framer-motion';

interface DialogueSceneProps {
  active: boolean;
}

export function DialogueScene({ active }: DialogueSceneProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #2c1810 0%, #4a2818 40%, #6b3820 100%)',
    }}>
      {/* Warm window light */}
      <motion.div
        animate={active ? {
          opacity: [0.5, 0.8, 0.5],
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: 140,
          height: 200,
          background: 'linear-gradient(135deg, rgba(255,180,90,0.6) 0%, rgba(255,140,60,0.2) 60%, transparent 100%)',
          borderRadius: 8,
          filter: 'blur(20px)',
        }}
      />

      {/* Window grid */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '12%',
        width: 110,
        height: 160,
        background: 'linear-gradient(180deg, rgba(255,200,120,0.5), rgba(255,160,80,0.3))',
        border: '4px solid #2a1410',
        borderRadius: 4,
      }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 4, background: '#2a1410' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, background: '#2a1410' }} />
      </div>

      {/* Floating dust particles */}
      {active && [...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            x: [0, 5, -5, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5 + (i % 3),
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: `${30 + (i * 5) % 40}%`,
            left: `${20 + (i * 9) % 60}%`,
            width: 3,
            height: 3,
            background: '#ffd9a3',
            borderRadius: '50%',
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      {/* Table foreground */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(180deg, #3a1a08 0%, #1a0804 100%)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.6)',
      }}>
        {/* Wine glass */}
        <div style={{
          position: 'absolute',
          left: '25%',
          top: -50,
          width: 16,
          height: 60,
        }}>
          <div style={{
            width: 16,
            height: 28,
            background: 'linear-gradient(180deg, transparent 30%, rgba(140,20,30,0.7) 30%, rgba(140,20,30,0.9) 70%, rgba(70,10,20,0.95) 100%)',
            borderRadius: '50% 50% 40% 40%',
            border: '1px solid rgba(255,255,255,0.2)',
          }} />
          <div style={{
            width: 2,
            height: 24,
            background: 'rgba(255,255,255,0.15)',
            margin: '0 auto',
          }} />
          <div style={{
            width: 14,
            height: 4,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            margin: '0 auto',
          }} />
        </div>
      </div>

      {/* Left character silhouette (profile facing right) */}
      <motion.svg
        viewBox="0 0 120 220"
        animate={active ? { x: [0, 2, 0], y: [0, -1, 0] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '4%',
          bottom: '15%',
          width: 130,
          height: 240,
          filter: 'drop-shadow(8px 0 20px rgba(0,0,0,0.6))',
        }}
      >
        {/* Hair / head profile */}
        <path d="M 30 60 Q 25 30 50 22 Q 75 18 88 38 Q 95 58 92 78 L 88 90 L 84 88 L 82 92 L 80 96 L 92 100 Q 92 110 86 116 L 80 120 L 78 220 L 30 220 Z" fill="#1a0a04" />
        {/* Subtle face highlight from window */}
        <path d="M 84 60 Q 90 65 88 75 L 85 78 L 84 75 Z" fill="#a85a30" opacity="0.45" />
      </motion.svg>

      {/* Right character silhouette (profile facing left) */}
      <motion.svg
        viewBox="0 0 120 220"
        animate={active ? { x: [0, -2, 0], y: [0, -1, 0] } : {}}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          right: '4%',
          bottom: '15%',
          width: 130,
          height: 240,
          filter: 'drop-shadow(-8px 0 20px rgba(0,0,0,0.6))',
          transform: 'scaleX(-1)',
        }}
      >
        <path d="M 30 60 Q 25 30 50 22 Q 75 18 88 38 Q 95 58 92 78 L 88 90 L 84 88 L 82 92 L 80 96 L 92 100 Q 92 110 86 116 L 80 120 L 78 220 L 30 220 Z" fill="#0a0604" />
        <path d="M 84 60 Q 90 65 88 75 L 85 78 L 84 75 Z" fill="#a85a30" opacity="0.3" />
      </motion.svg>
    </div>
  );
}
