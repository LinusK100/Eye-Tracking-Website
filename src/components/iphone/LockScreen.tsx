import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assetUrl } from '../../utils/assetUrl';

interface LockScreenProps {
  active: boolean;
  hasSound: boolean;
  playSoundFn: (src: string) => void;
}

const NOTIFICATION_SOUNDS = [
  assetUrl('/Notification_iPhone.mp3'),
  assetUrl('/Notification_iPhone.mp3'),
  assetUrl('/Notification_iPhone_2.mp3'),
  assetUrl('/Notification_iPhone.mp3'),
];

const NOTIFICATIONS = [
  { sender: 'Max Mustermann', text: 'Hey, kannst du kurz anrufen?' },
  { sender: 'Max Mustermann', text: 'Bin gleich fertig 👍' },
  { sender: 'Max Mustermann', text: 'Hast du kurz Zeit?' },
  { sender: 'Max Mustermann', text: 'Ich warte noch auf deine Antwort 😊' },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function LockScreen({ active, hasSound, playSoundFn }: LockScreenProps) {
  const [now, setNow] = useState(new Date());
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const prevNotifLenRef = useRef(0);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setVisibleNotifications([]);
    prevNotifLenRef.current = 0;

    if (!active) return;

    // Notifications at t=1s, 3s, 5s, 7s
    const delays = [1000, 3000, 5000, 7000];
    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        setVisibleNotifications(prev => [...prev, i]);
      }, delay);
      timersRef.current.push(t);
    });

    return () => timersRef.current.forEach(clearTimeout);
  }, [active]);

  // Play sound after React has committed the new notification to the DOM
  // (i.e. after the slide-in animation has started, not before)
  useEffect(() => {
    const len = visibleNotifications.length;
    if (!hasSound || len === 0 || len <= prevNotifLenRef.current) return;
    const latestIdx = visibleNotifications[len - 1];
    playSoundFn(NOTIFICATION_SOUNDS[latestIdx]);
    prevNotifLenRef.current = len;
  }, [visibleNotifications]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#fff',
      userSelect: 'none',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Glasmorphism overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Time & Date */}
      <div style={{ marginTop: '18%', textAlign: 'center', zIndex: 1 }}>
        <div style={{
          fontSize: 72,
          fontWeight: 200,
          letterSpacing: -2,
          lineHeight: 1,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}>
          {formatTime(now)}
        </div>
        <div style={{
          fontSize: 17,
          fontWeight: 400,
          marginTop: 8,
          opacity: 0.85,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}>
          {formatDate(now)}
        </div>
      </div>

      {/* Notification banners */}
      <div style={{
        position: 'absolute',
        top: '44%',
        left: 12,
        right: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 10,
      }}>
        <AnimatePresence>
          {visibleNotifications.map(i => (
            <motion.div
              key={i}
              initial={{ y: -80, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -80, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 18,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              {/* App icon */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: 'linear-gradient(135deg, #4cd964, #2ecc71)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>Nachrichten</span>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>jetzt</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{NOTIFICATIONS[i].sender}</div>
                <div style={{ fontSize: 13, opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {NOTIFICATIONS[i].text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Swipe hint */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        left: 0, right: 0,
        textAlign: 'center',
        fontSize: 14,
        opacity: 0.5,
        fontFamily: '-apple-system, sans-serif',
      }}>
        Nach oben wischen zum Entsperren
      </div>
    </div>
  );
}
