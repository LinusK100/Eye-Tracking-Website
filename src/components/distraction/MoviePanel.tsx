import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Difficulty } from '../../types';
import { ChaseScene } from './movie/ChaseScene';
import { DialogueScene } from './movie/DialogueScene';
import { SpaceScene } from './movie/SpaceScene';
import { assetUrl } from '../../utils/assetUrl';

interface MoviePanelProps {
  difficulty: Difficulty;
  hasSound: boolean;
  active: boolean;
}

const VARIANTS: Record<Difficulty, {
  Component: (p: { active: boolean }) => ReactElement;
  title: string;
  subtitles: string[];
}> = {
  easy: {
    Component: ChaseScene,
    title: 'NIGHT PURSUIT',
    subtitles: [
      'Verstärkung anfordern – wir verlieren ihn nicht!',
      'Achtung, er biegt rechts in die Hauptstraße ab!',
      'Schneller, schneller – er darf uns nicht entkommen!',
      'Alle Einheiten, sofort zur 5th Avenue!',
      'Bleib auf seinem Heck – ich übernehme die Seite!',
    ],
  },
  medium: {
    Component: DialogueScene,
    title: 'DIE LETZTE NACHRICHT',
    subtitles: [
      'Ich hätte es dir früher sagen sollen.',
      'Du wusstest die ganze Zeit Bescheid, oder?',
      'Es ist nicht so einfach, wie du denkst.',
      'Manchmal bleibt einem keine andere Wahl.',
      'Was wirst du jetzt tun?',
    ],
  },
  hard: {
    Component: SpaceScene,
    title: 'BEYOND THE STARS',
    subtitles: [
      'Wir nähern uns dem Asteroidengürtel, Commander.',
      'Sensoren registrieren ein unbekanntes Signal.',
      'Schilde auf Maximum – ich habe ein schlechtes Gefühl.',
      'Das ist kein Asteroid. Das ist ein Schiff.',
      'Bereithalten zum Sprung – Lichtgeschwindigkeit in 3, 2, 1...',
    ],
  },
  expert: {
    Component: SpaceScene,
    title: 'BEYOND THE STARS',
    subtitles: [
      'Wir nähern uns dem Asteroidengürtel, Commander.',
      'Sensoren registrieren ein unbekanntes Signal.',
      'Schilde auf Maximum – ich habe ein schlechtes Gefühl.',
      'Das ist kein Asteroid. Das ist ein Schiff.',
      'Bereithalten zum Sprung – Lichtgeschwindigkeit in 3, 2, 1...',
    ],
  },
};

export function MoviePanel({ difficulty, hasSound, active }: MoviePanelProps) {
  const variant = VARIANTS[difficulty];
  const Scene = variant.Component;
  const [subIdx, setSubIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setSubIdx(i => (i + 1) % variant.subtitles.length);
    }, 3500);
    return () => clearInterval(t);
  }, [active, variant.subtitles.length]);

  useEffect(() => {
    setSubIdx(0);
  }, [difficulty]);

  useEffect(() => {
    if (!active || !hasSound) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sounds = [
      { delay: 3000,  src: assetUrl('/Notification_Teams.mp3') },
      { delay: 10000, src: assetUrl('/Notification_Teams.mp3') },
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

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#000',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
    }}>
      {/* Cinema viewport - 2.39:1 letterbox aspect inside the panel */}
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}>
        {/* Top letterbox bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '12%',
          background: '#000',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          justifyContent: 'space-between',
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.25em',
          }}>
            CINEMA · 4K HDR
          </div>
          {hasSound && (
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#ff3b30',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3b30', boxShadow: '0 0 8px #ff3b30' }} />
              LIVE
            </motion.div>
          )}
        </div>

        {/* Bottom letterbox bar with subtitles */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '18%',
          background: '#000',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 32px 8px',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={subIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 500,
                textAlign: 'center',
                lineHeight: 1.4,
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                maxWidth: '90%',
              }}
            >
              {variant.subtitles[subIdx]}
            </motion.div>
          </AnimatePresence>
          <div style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.4)',
            fontSize: 10,
            letterSpacing: '0.2em',
            fontWeight: 600,
          }}>
            <span>{variant.title}</span>
            <span>·</span>
            <span>UT DE</span>
          </div>
        </div>

        {/* Scene */}
        <div style={{
          position: 'absolute',
          top: '12%',
          bottom: '18%',
          left: 0,
          right: 0,
          overflow: 'hidden',
          background: '#000',
        }}>
          <Scene active={active} />

          {/* Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Film grain */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence baseFrequency=%220.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.6%22/></svg>")',
            opacity: 0.07,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }} />
        </div>
      </div>
    </div>
  );
}
