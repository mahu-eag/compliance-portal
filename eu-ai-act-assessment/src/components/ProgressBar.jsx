import React from 'react';
import { PHASES } from '../data/questions';

export default function ProgressBar({ currentIndex, total, currentPhase }) {
  const pct = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span>
          Phase {currentPhase} von {PHASES.length} &mdash;&nbsp;
          {PHASES.find((p) => p.id === currentPhase)?.label}
        </span>
        <span className="progress-percent">{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.6rem' }}>
        {PHASES.map((ph) => (
          <div
            key={ph.id}
            title={ph.label}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              background:
                ph.id < currentPhase
                  ? 'var(--elpix-red)'
                  : ph.id === currentPhase
                  ? 'var(--elpix-red-dark)'
                  : 'var(--elpix-border)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
