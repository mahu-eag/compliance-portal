import React from 'react';

export default function StartPage({ onStart, onBack }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '3rem 2.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        border: '1px solid #e2e2e2',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: '#e30613',
          color: '#fff',
          fontWeight: 800,
          fontSize: '0.8rem',
          letterSpacing: '1.5px',
          padding: '0.3rem 1rem',
          borderRadius: 999,
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
        }}>
          NIS-2 · Readiness Assessment
        </div>

        <h1 style={{ fontSize: '2rem', margin: '0 0 1rem', lineHeight: 1.3, color: '#1f1f1f' }}>
          Wie gut ist Ihr Unternehmen<br />auf NIS-2 vorbereitet?
        </h1>

        <p style={{ color: '#6f6f6f', lineHeight: 1.7, margin: '0 0 2rem', fontSize: '1rem' }}>
          Die NIS-2-Richtlinie ist in Kraft – tausende Unternehmen in Deutschland sind betroffen.
          Dieses Assessment prüft Ihre Cybersicherheits-Reife, bewertet Ihre Einstufung und zeigt Ihnen,
          wo Sie handeln müssen.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
          textAlign: 'left',
        }}>
          {[
            { icon: '⏱️', label: '~10 Minuten', sub: 'Dauer' },
            { icon: '🔒', label: 'Lokal gespeichert', sub: 'Datenschutz' },
            { icon: '📊', label: 'Sofortauswertung', sub: 'Ergebnis' },
          ].map((item) => (
            <div key={item.label} style={{
              background: '#f4f4f4',
              borderRadius: 10,
              padding: '1rem',
              border: '1px solid #e2e2e2',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1f1f1f' }}>{item.label}</div>
              <div style={{ fontSize: '0.8rem', color: '#6f6f6f' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: '#fff1f2',
          border: '1px solid #ffd6d8',
          borderRadius: 10,
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          textAlign: 'left',
          fontSize: '0.88rem',
          lineHeight: 1.55,
        }}>
          <strong style={{ color: '#e30613' }}>Was Sie erhalten:</strong>
          {' '}NIS-2-Einstufung (Essential / Important Entity) · Reifegrad-Score · Gap-Analyse · Priorisierter Maßnahmenkatalog
        </div>

        <button
          onClick={onStart}
          style={{
            width: '100%', padding: '1rem',
            background: 'linear-gradient(135deg, #e30613, #b9000d)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          Assessment starten →
        </button>

        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#6f6f6f' }}>
          Ihre Antworten werden nur lokal in Ihrem Browser gespeichert.
        </p>

        <button
          onClick={onBack}
          style={{
            marginTop: '1.25rem', background: 'none', border: 'none',
            color: '#6f6f6f', fontSize: '0.82rem', cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          ← Zurück zur Übersicht
        </button>
      </div>
    </div>
  );
}
