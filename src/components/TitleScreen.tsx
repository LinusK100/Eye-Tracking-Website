import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { Play, Timer, ClipboardCheck, Brain, Volume2, VolumeX, Film, Sparkles } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';

interface TitleScreenProps {
  onStart: () => void;
  useAnimation: boolean;
  onAnimationChange: (next: boolean) => void;
}

const screenVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const RULES: { icon: React.ReactNode; text: React.ReactNode }[] = [
  {
    icon: <Brain size={18} />,
    text: <><strong>Löse die Logik-Rätsel</strong> – lies jede Aufgabe sorgfältig durch</>,
  },
  {
    icon: <Timer size={18} />,
    text: <>Pro Aufgabe hast du <strong>15 Sekunden</strong> – danach geht es automatisch weiter</>,
  },
  {
    icon: <ClipboardCheck size={18} />,
    text: <>Wähle eine Antwort <strong>(A–E)</strong> – nach dem Klick ist sie verbindlich</>,
  },
];

export function TitleScreen({ onStart, useAnimation, onAnimationChange }: TitleScreenProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggleSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(assetUrl('/Sound_Check_Song.mp3'));
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        height: '100dvh',
        width: '100%',
        overflow: 'auto',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 560,
          width: '100%',
          padding: 'var(--space-8) var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)',
        }}
      >
        {/* Header */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            Eye-Tracking Experiment
          </span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, lineHeight: 1.15 }}>
            Logikaufgaben
          </h1>
        </header>

        {/* Rules */}
        <section>
          <h2 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            So funktioniert es
          </h2>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {RULES.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4) var(--space-5)',
                  borderBottom: i === RULES.length - 1 ? 'none' : '1px solid var(--color-divider)',
                }}
              >
                <span style={{ color: 'var(--color-primary)', display: 'inline-flex', paddingTop: 2, flexShrink: 0 }}>
                  {r.icon}
                </span>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {r.text}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Volume check */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <h2 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            Lautstärke testen
          </h2>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Einige Aufgaben enthalten Audio – teste hier die Lautstärke.
            </span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={toggleSound}
              style={{
                flexShrink: 0,
                background: playing ? 'var(--color-primary)' : 'var(--color-surface-raised, var(--color-divider))',
                color: playing ? '#ffffff' : 'var(--color-text)',
                border: '1px solid var(--color-divider)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                cursor: 'pointer',
              }}
            >
              {playing ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {playing ? 'Stopp' : 'Abspielen'}
            </motion.button>
          </div>
        </section>

        {/* Anzeige-Modus */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <h2 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            Anzeige-Modus
          </h2>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Falls Videos nicht laden, wechsle auf das <strong>Animations-Backup</strong>.
            </span>

            <div
              role="tablist"
              aria-label="Anzeige-Modus"
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-divider)',
                borderRadius: 'var(--radius-md)',
                padding: 4,
                gap: 4,
              }}
            >
              {[
                { key: false as const, label: 'Echte Videos', icon: <Film size={16} /> },
                { key: true as const,  label: 'Animations-Backup', icon: <Sparkles size={16} /> },
              ].map(opt => {
                const active = useAnimation === opt.key;
                return (
                  <button
                    key={String(opt.key)}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onAnimationChange(opt.key)}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      padding: 'var(--space-2) var(--space-3)',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: 'calc(var(--radius-md) - 4px)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: active ? '#ffffff' : 'var(--color-text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-2)',
                      transition: 'color var(--transition)',
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="anzeige-modus-pin"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'var(--color-primary)',
                          borderRadius: 'calc(var(--radius-md) - 4px)',
                          zIndex: -1,
                          boxShadow: '0 2px 8px rgba(1, 105, 111, 0.28)',
                        }}
                      />
                    )}
                    {opt.icon}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Start button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          style={{
            background: 'var(--color-primary)',
            color: '#ffffff',
            padding: 'var(--space-4) var(--space-8)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            boxShadow: '0 4px 14px rgba(1, 105, 111, 0.28)',
            width: '100%',
          }}
        >
          <Play size={18} />
          Studie starten
        </motion.button>
      </div>
    </motion.div>
  );
}
