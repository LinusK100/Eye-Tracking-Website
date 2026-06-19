import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { assetUrl } from '../../utils/assetUrl';

interface CallScreenProps {
  active: boolean;
  hasSound: boolean;
}

export function CallScreen({ active, hasSound }: CallScreenProps) {
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active || !hasSound) return;

    let cancelled = false;

    const playOnce = () => {
      if (cancelled) return;
      const audio = new Audio(assetUrl('/Notification_Teams_Anruf.mp3'));
      audio.volume = 0.8;
      ringtoneRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => {
        if (!cancelled) {
          pauseTimerRef.current = setTimeout(playOnce, 2500);
        }
      };
    };

    // 2s buffer before first ring
    pauseTimerRef.current = setTimeout(playOnce, 2000);

    return () => {
      cancelled = true;
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (ringtoneRef.current) {
        ringtoneRef.current.onended = null;
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
        ringtoneRef.current = null;
      }
    };
  }, [active, hasSound]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 60%, #1c1c1e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#fff',
      padding: '28px 24px 32px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      userSelect: 'none',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Top: Caller info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: '12%' }}>
        {/* Pulsating avatar */}
        <div style={{ position: 'relative', width: 100, height: 100 }}>
          {/* Outer pulse rings */}
          {[0, 1].map(i => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.6], opacity: [0.35, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.9, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
          {/* Avatar circle */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #636366, #48484a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 600,
            color: '#fff',
            zIndex: 1,
          }}>
            MM
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <div style={{ fontSize: 34, fontWeight: 300, letterSpacing: -0.5 }}>Max Mustermann</div>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: 17, opacity: 0.75, marginTop: 6 }}
          >
            Eingehender Anruf…
          </motion.div>
        </div>
      </div>

      {/* Bottom: Action buttons */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 8,
      }}>
        {/* Decline */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: '#ff3b30',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(255,59,48,0.45)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
          <span style={{ fontSize: 14, opacity: 0.75 }}>Ablehnen</span>
        </div>

        {/* Accept */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: '#34c759',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(52,199,89,0.45)',
          }}>
            {/* Phone icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </div>
          <span style={{ fontSize: 14, opacity: 0.75 }}>Annehmen</span>
        </div>
      </div>
    </div>
  );
}
