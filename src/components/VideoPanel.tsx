import { memo, useEffect, useRef, useState } from 'react';
import { Volume2, FolderOpen } from 'lucide-react';
import type { CategoryConfig } from '../types';

interface VideoPanelProps {
  category: CategoryConfig;
  active?: boolean;
}

function VideoPanelInner({ category, active }: VideoPanelProps) {
  const [hasError, setHasError] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const srcs = category.videoSrcs ?? (category.videoSrc ? [category.videoSrc] : []);
  const currentSrc = srcs[videoIndex] ?? category.videoSrc;
  const isPlaylist = srcs.length > 1;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active === false) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }
  }, [active]);

  if (!category.hasVideo) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--color-surface)',
        }}
        aria-hidden="true"
      />
    );
  }

  if (hasError) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--color-surface-offset)',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
          <FolderOpen size={32} />
          <span style={{ fontSize: 'var(--text-sm)' }}>
            Video einfügen: <code style={{ background: 'var(--color-surface)', padding: '2px 6px', borderRadius: 4 }}>{currentSrc}</code>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
      <video
        ref={videoRef}
        key={currentSrc + (category.hasSound ? '_s' : '_m')}
        src={currentSrc}
        autoPlay
        loop={!isPlaylist}
        muted={!category.hasSound}
        playsInline
        onEnded={isPlaylist ? () => setVideoIndex(i => (i + 1) % srcs.length) : undefined}
        onError={() => setHasError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {category.hasSound && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 'var(--text-xs)',
          }}
          aria-label="Mit Ton"
        >
          <Volume2 size={14} />
        </div>
      )}
    </div>
  );
}

export const VideoPanel = memo(VideoPanelInner);
