import { motion } from 'framer-motion';

interface CategoryBannerProps {
  index: number;
  total: number;
}

const bannerVariants = {
  initial: { y: '-100%' },
  animate: { y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { y: '-100%', transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] as const } },
};

export function CategoryBanner({ index, total }: CategoryBannerProps) {
  return (
    <motion.div
      variants={bannerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-bg)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        color: 'var(--color-text)',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-sm)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--color-text-muted)',
        }}
      >
        Nächster Abschnitt
      </span>
      <span style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-text-muted)' }}>
        {index} / {total}
      </span>
    </motion.div>
  );
}
