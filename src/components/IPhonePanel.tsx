import { useEffect, useRef, useState } from 'react';
import type { NotificationType } from '../types';
import { LockScreen } from './iphone/LockScreen';
import { MessagesApp } from './iphone/MessagesApp';
import { CallScreen } from './iphone/CallScreen';

// Variante 1 (LockScreen): Handy = erste Hälfte, Teams = zweite Hälfte
// Variante 2 (MessagesApp): iPhone = Hauptnachrichten, iPhone_2 = letzte Nachricht
// Variante 3 (CallScreen): Teams_Anruf als Klingelton mit Pausen

interface IPhonePanelProps {
  notificationType: NotificationType;
  hasSound: boolean;
  active: boolean;
}

// Status bar icons
function StatusBar() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 10000);
    return () => clearInterval(t);
  }, []);
  const timeStr = time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px 0 24px',
      color: '#fff',
      flexShrink: 0,
      zIndex: 20,
      position: 'relative',
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, fontFamily: '-apple-system, sans-serif' }}>
        {timeStr}
      </span>
      {/* Right: signal + wifi + battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
          <rect x="0"  y="8"  width="3" height="4" rx="1"/>
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="1"/>
          <rect x="9"  y="2.5" width="3" height="9.5" rx="1"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1"/>
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
          <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
          <path d="M8 6c1.6 0 3 .65 4.05 1.7L13.5 6.25A7.95 7.95 0 0 0 8 4a7.95 7.95 0 0 0-5.5 2.25L3.95 7.7A5.4 5.4 0 0 1 8 6z"/>
          <path d="M8 2.5c2.75 0 5.2 1.1 7 2.9L16.4 3.95A11.45 11.45 0 0 0 8 .5 11.45 11.45 0 0 0-.4 3.95L1 5.4c1.8-1.8 4.25-2.9 7-2.9z"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="white">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeWidth="1" fill="none"/>
          <rect x="22" y="3.5" width="2.5" height="5" rx="1.5" fill="white" opacity="0.4"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill="white"/>
        </svg>
      </div>
    </div>
  );
}

export function IPhonePanel({ notificationType, hasSound, active }: IPhonePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Physical iPhone 15 Pro dimensions in CSS px (390 × 844 logical resolution)
  const DEVICE_W = 390;
  const DEVICE_H = 844;
  const BORDER   = 14;
  const FRAME_W  = DEVICE_W + BORDER * 2;
  const FRAME_H  = DEVICE_H + BORDER * 2;

  useEffect(() => {
    const observe = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const scaleX = (width  - 32) / FRAME_W;
      const scaleY = (height - 32) / FRAME_H;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    observe();
    const ro = new ResizeObserver(observe);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const playSoundFn = (src: string) => {
    const audio = new Audio(src);
    audio.volume = 0.7;
    audio.play().catch(() => {});
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        overflow: 'hidden',
      }}
    >
      {/* iPhone device frame */}
      <div
        style={{
          width:  FRAME_W,
          height: FRAME_H,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          borderRadius: 54,
          background: '#1c1c1e',
          padding: BORDER,
          boxShadow: '0 0 0 1px #3a3a3c, 0 24px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {/* Side buttons (decorative) */}
        {/* Volume up */}
        <div style={{ position: 'absolute', left: -3, top: 100, width: 3, height: 32, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', left: -3, top: 142, width: 3, height: 32, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
        {/* Power button */}
        <div style={{ position: 'absolute', right: -3, top: 120, width: 3, height: 60, background: '#3a3a3c', borderRadius: '0 2px 2px 0' }} />

        {/* Screen */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: 40,
          overflow: 'hidden',
          background: '#000',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Dynamic Island */}
          <div style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 34,
            background: '#000',
            borderRadius: 20,
            zIndex: 30,
            boxShadow: '0 0 0 2px #1c1c1e',
          }} />

          {/* Status bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 25,
          }}>
            <StatusBar />
          </div>

          {/* Screen content */}
          <div style={{ flex: 1, paddingTop: 44, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {notificationType === 'lock_screen' && (
              <LockScreen active={active} hasSound={hasSound} playSoundFn={playSoundFn} />
            )}
            {notificationType === 'chat' && (
              <MessagesApp active={active} hasSound={hasSound} playSoundFn={playSoundFn} />
            )}
            {notificationType === 'call' && (
              <CallScreen active={active} hasSound={hasSound} />
            )}
          </div>

          {/* Home indicator */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 130,
            height: 5,
            background: notificationType === 'lock_screen' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)',
            borderRadius: 3,
            zIndex: 30,
          }} />
        </div>
      </div>
    </div>
  );
}
