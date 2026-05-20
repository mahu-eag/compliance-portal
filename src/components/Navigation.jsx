import React from 'react';

export default function Navigation({ onPrev, onNext, canGoPrev, canGoNext, isLast, onFinish }) {
  return (
    <div className="navigation">
      <button
        className="btn btn-secondary"
        onClick={onPrev}
        disabled={!canGoPrev}
      >
        ← Zurück
      </button>

      {isLast ? (
        <button
          className="btn btn-primary"
          onClick={onFinish}
          disabled={!canGoNext}
        >
          Auswertung anzeigen →
        </button>
      ) : (
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canGoNext}
        >
          Weiter →
        </button>
      )}
    </div>
  );
}