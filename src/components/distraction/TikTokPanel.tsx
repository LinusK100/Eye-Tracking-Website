import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { motion } from 'framer-motion';
import type { Difficulty } from '../../types';
import { CookingClip } from './tiktok/CookingClip';
import { DanceClip } from './tiktok/DanceClip';
import { PetClip } from './tiktok/PetClip';
import { assetUrl } from '../../utils/assetUrl';

interface TikTokPanelProps {
  difficulty: Difficulty;
  hasSound: boolean;
  active: boolean;
}

const VARIANTS: Record<Difficulty, {
  Component: (p: { active: boolean }) => ReactElement;
  username: string;
  caption: string;
  song: string;
  likes: string;
  comments: string;
}> = {
  easy: {
    Component: CookingClip,
    username: '@cookwithme',
    caption: '5-Minuten Pasta 🍝 #foodtok #recipe #pasta',
    song: 'Original Sound · cookwithme',
    likes: '124,3K',
    comments: '2.486',
  },
  medium: {
    Component: DanceClip,
    username: '@danceclub',
    caption: 'Neue Choreo zum Trend-Song 💃 #dance #fyp #viral',
    song: 'Levitating – Dua Lipa',
    likes: '892K',
    comments: '14,2K',
  },
  hard: {
    Component: PetClip,
    username: '@catsofficial',
    caption: 'Wenn die Katze den Ball jagt 😻 #catsoftiktok #cute',
    song: 'Funny Cat Sounds · catsofficial',
    likes: '2,1M',
    comments: '38,9K',
  },
  expert: {
    Component: PetClip,
    username: '@catsofficial',
    caption: 'Wenn die Katze den Ball jagt 😻 #catsoftiktok #cute',
    song: 'Funny Cat Sounds · catsofficial',
    likes: '2,1M',
    comments: '38,9K',
  },
};

function SidebarIcon({ icon, label, hot }: { icon: ReactElement; label: string; hot?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hot ? '#ff3b5c' : '#fff',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: '#fff',
        textShadow: '0 1px 2px rgba(0,0,0,0.6)',
      }}>{label}</span>
    </div>
  );
}

export function TikTokPanel({ difficulty, hasSound, active }: TikTokPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const DEVICE_W = 390;
  const DEVICE_H = 844;
  const BORDER = 14;
  const FRAME_W = DEVICE_W + BORDER * 2;
  const FRAME_H = DEVICE_H + BORDER * 2;

  useEffect(() => {
    const observe = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const scaleX = (width - 32) / FRAME_W;
      const scaleY = (height - 32) / FRAME_H;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    observe();
    const ro = new ResizeObserver(observe);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !hasSound) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sounds = [
      { delay: 2000,  src: assetUrl('/Notification_iPhone.mp3') },
      { delay: 8000,  src: assetUrl('/Notification_iPhone_2.mp3') },
    ];
    sounds.forEach(({ delay, src }) => {
      const t = setTimeout(() => {
        if (cancelled) return;
        const audio = new Audio(src);
        audio.volume = 0.7;
        audio.play().catch(() => {});
      }, delay);
      timers.push(t);
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [active, hasSound]);

  const variant = VARIANTS[difficulty];
  const Clip = variant.Component;

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
      {/* Phone frame */}
      <div
        style={{
          width: FRAME_W,
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
        <div style={{ position: 'absolute', left: -3, top: 100, width: 3, height: 32, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', left: -3, top: 142, width: 3, height: 32, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', right: -3, top: 120, width: 3, height: 60, background: '#3a3a3c', borderRadius: '0 2px 2px 0' }} />

        {/* Screen */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: 40,
          overflow: 'hidden',
          background: '#000',
          position: 'relative',
        }}>
          {/* Dynamic island */}
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
          }} />

          {/* Clip content */}
          <Clip active={active} />

          {/* Top tabs */}
          <div style={{
            position: 'absolute',
            top: 56,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 28,
            zIndex: 20,
            color: '#fff',
            fontFamily: '-apple-system, sans-serif',
            fontSize: 17,
            fontWeight: 600,
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}>
            <span style={{ opacity: 0.5 }}>Folge ich</span>
            <span style={{ position: 'relative' }}>
              Für dich
              <span style={{
                position: 'absolute',
                bottom: -6,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 18,
                height: 3,
                background: '#fff',
                borderRadius: 2,
              }} />
            </span>
          </div>

          {/* Right sidebar */}
          <div style={{
            position: 'absolute',
            right: 8,
            bottom: 130,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            zIndex: 25,
          }}>
            {/* Avatar with follow button */}
            <div style={{ position: 'relative', width: 48, height: 56 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #25f4ee, #fe2c55)',
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
              }}>{variant.username[1].toUpperCase()}</div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fe2c55',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                lineHeight: 1,
              }}>+</div>
            </div>

            <SidebarIcon
              icon={
                <motion.svg
                  width="36" height="36" viewBox="0 0 24 24" fill="currentColor"
                  animate={active ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </motion.svg>
              }
              label={variant.likes}
              hot
            />

            <SidebarIcon
              icon={
                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
                </svg>
              }
              label={variant.comments}
            />

            <SidebarIcon
              icon={
                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
                </svg>
              }
              label="Teilen"
            />

            {/* Spinning vinyl */}
            <motion.div
              animate={active ? { rotate: 360 } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #555 0%, #1a1a1a 60%, #000 100%)',
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fe2c55, #ff7e8e)',
              }} />
            </motion.div>
          </div>

          {/* Bottom caption */}
          <div style={{
            position: 'absolute',
            left: 16,
            right: 80,
            bottom: 100,
            color: '#fff',
            zIndex: 20,
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{variant.username}</div>
            <div style={{ fontSize: 14, lineHeight: 1.35, marginBottom: 10 }}>{variant.caption}</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              overflow: 'hidden',
              fontSize: 13,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <motion.span
                animate={active ? { x: [0, -120, 0] } : {}}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ whiteSpace: 'nowrap' }}
              >
                {variant.song} · {variant.song}
              </motion.span>
            </div>
          </div>

          {/* Bottom tab bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            zIndex: 30,
            paddingBottom: 16,
          }}>
            {['Start', 'Suche', '', 'Inbox', 'Profil'].map((label, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {i === 2 ? (
                  <div style={{
                    width: 44,
                    height: 30,
                    borderRadius: 8,
                    background: 'linear-gradient(90deg, #25f4ee, #fff, #fe2c55)',
                    backgroundSize: '200% 100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontSize: 22,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}>+</div>
                ) : (
                  <>
                    <div style={{ width: 22, height: 22, opacity: i === 0 ? 1 : 0.6 }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                        {i === 0 && <path d="M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3l9-8z" />}
                        {i === 1 && <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />}
                        {i === 3 && <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />}
                        {i === 4 && <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />}
                      </svg>
                    </div>
                    <span style={{ opacity: i === 0 ? 1 : 0.7 }}>{label}</span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Optional sound indicator */}
          {hasSound && (
            <div
              style={{
                position: 'absolute',
                top: 100,
                right: 12,
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                padding: '6px 10px',
                borderRadius: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                zIndex: 25,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              Ton an
            </div>
          )}

          {/* Home indicator */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 130,
            height: 5,
            background: 'rgba(255,255,255,0.5)',
            borderRadius: 3,
            zIndex: 35,
          }} />
        </div>
      </div>
    </div>
  );
}
