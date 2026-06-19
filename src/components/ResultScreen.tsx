import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, X } from 'lucide-react';
import type { Answer, CategoryConfig, Difficulty } from '../types';
import { CATEGORIES } from '../data/categories';
import { buildQuestionSequence } from '../data/questions';

interface ResultScreenProps {
  answers: Answer[];
  totalTimeSeconds: number;
  onRestart: () => void;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Leicht',
  medium: 'Mittel',
  hard: 'Schwer',
  expert: 'Sehr schwer',
};

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'var(--color-difficulty-easy)',
  medium: 'var(--color-difficulty-medium)',
  hard: 'var(--color-difficulty-hard)',
  expert: 'var(--color-difficulty-expert)',
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s} min`;
}

function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return new Promise((resolve) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      resolve(ok);
    } catch {
      resolve(false);
    }
  });
}

export function ResultScreen({ answers, totalTimeSeconds, onRestart }: ResultScreenProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const questionMap = useMemo(() => {
    const seq = buildQuestionSequence();
    return new Map(seq.map((q) => [q.id, q]));
  }, []);

  const totalCorrect = answers.filter((a) => a.correct).length;

  const byCategory = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const items = answers.filter((a) => a.category === cat.type);
      const correct = items.filter((a) => a.correct).length;
      const totalTime = items.reduce((sum, a) => sum + a.timeSpent, 0);
      return { cat, items, correct, total: items.length, avgTime: items.length ? totalTime / items.length : 0 };
    });
  }, [answers]);

  const leftCol = byCategory.slice(0, 3);
  const rightCol = byCategory.slice(3);

  const handleCopy = async () => {
    const exportData = {
      summary: {
        totalTime: totalTimeSeconds,
        totalCorrect,
        totalQuestions: answers.length,
      },
      categories: byCategory.map(({ cat, correct, total, avgTime }) => ({
        category: cat.type,
        label: cat.label,
        correct,
        total,
        avgTime: Math.round(avgTime * 10) / 10,
      })),
      results: answers,
    };
    const ok = await copyText(JSON.stringify(exportData, null, 2));
    if (ok) { setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        height: '100dvh',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 28px 16px',
        gap: 12,
      }}
    >
      {/* Header */}
      <header style={{ flexShrink: 0, marginBottom: 20 }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, lineHeight: 1.1 }}>Studie abgeschlossen</h1>
      </header>

      {/* Two-column grid */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <CategoryColumn rows={leftCol} questionMap={questionMap} />
        <CategoryColumn rows={rightCol} questionMap={questionMap} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: '8px 20px', borderRadius: 'var(--radius-md)',
              background: copied ? 'var(--color-success)' : 'var(--color-primary)',
              color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 600,
              transition: 'background var(--transition)',
            }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Kopiert!' : 'Daten kopieren (JSON)'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: '8px 20px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 600,
            }}
          >
            <RotateCcw size={15} />
            Neu starten
          </motion.button>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          <span>Gesamtzeit: <strong style={{ color: 'var(--color-text)' }}>{formatTime(totalTimeSeconds)}</strong></span>
          <span>Ergebnis: <strong style={{ color: 'var(--color-text)' }}>{totalCorrect}&thinsp;/&thinsp;{answers.length}</strong> richtig</span>
        </div>
      </div>
    </motion.div>
  );
}

interface CategoryColumnProps {
  rows: Array<{ cat: CategoryConfig; items: Answer[]; correct: number; total: number; avgTime: number }>;
  questionMap: Map<string, { id: string; text: string; difficulty: Difficulty }>;
}

function CategoryColumn({ rows, questionMap }: CategoryColumnProps) {
  if (rows.length === 0) return null;
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 0 }}>
      {rows.map((row, i) => (
        <CategoryRow key={row.cat.type} row={row} isLast={i === rows.length - 1} questionMap={questionMap} />
      ))}
    </div>
  );
}

interface CategoryRowProps {
  row: { cat: CategoryConfig; items: Answer[]; correct: number; total: number; avgTime: number };
  isLast: boolean;
  questionMap: Map<string, { id: string; text: string; difficulty: Difficulty }>;
}

function CategoryRow({ row, isLast, questionMap }: CategoryRowProps) {
  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid var(--color-divider)' }}>
      {/* Category header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', background: 'var(--color-surface-offset)' }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{row.cat.label}</span>
        <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
          <span>{row.correct}&thinsp;/&thinsp;{row.total} richtig</span>
          <span>Ø {row.avgTime.toFixed(1)} s</span>
        </div>
      </div>

      {/* Individual questions */}
      {row.items.map((item, idx) => {
        const q = questionMap.get(item.questionId);
        const firstLine = q?.text.split('\n')[0] ?? item.questionId;
        return (
          <div
            key={item.questionId}
            style={{
              display: 'grid',
              gridTemplateColumns: '20px 58px 1fr 22px 48px',
              gap: 8,
              alignItems: 'center',
              padding: '4px 12px 4px 14px',
              borderTop: '1px solid var(--color-divider)',
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', fontVariantNumeric: 'tabular-nums' }}>
              {idx + 1}.
            </span>
            <span style={{
              display: 'inline-block', padding: '1px 6px', borderRadius: 999,
              fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
              background: 'color-mix(in srgb, ' + DIFFICULTY_COLOR[item.difficulty] + ' 12%, transparent)',
              color: DIFFICULTY_COLOR[item.difficulty], whiteSpace: 'nowrap',
            }}>
              {DIFFICULTY_LABEL[item.difficulty]}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {firstLine}
            </span>
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              {item.correct ? <Check size={13} color="var(--color-success)" /> : <X size={13} color="var(--color-error)" />}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', textAlign: 'right', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {item.timeSpent.toFixed(1)} s
            </span>
          </div>
        );
      })}
    </div>
  );
}
