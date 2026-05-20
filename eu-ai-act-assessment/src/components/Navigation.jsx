import React from 'react';

export default function Navigation({ onPrev, onNext, onFinish, isFirst, isLast, canNext }) {
  return (
    <div className="navigation no-print">
      <button className="btn btn-secondary" onClick={onPrev} disabled={isFirst}>
        ← Zurück
      </button>
      {isLast ? (
        <button className="btn btn-primary" onClick={onFinish} disabled={!canNext}>
          Auswertung ansehen →
        </button>
      ) : (
        <button className="btn btn-primary" onClick={onNext} disabled={!canNext}>
          Weiter →
        </button>
      )}
    </div>
  );
}
