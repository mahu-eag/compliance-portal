import React from 'react';
import {
  classifyRisk,
  calcMaturityScore,
  identifyGaps,
  getMaturityRating,
  getActionNeed,
  RISK_META,
} from '../utils/scoring';

const C = {
  red: '#e30613', redDark: '#b9000d',
  black: '#1f1f1f', dark: '#2b2b2b', gray: '#6f6f6f',
  lightGray: '#f4f4f4', border: '#e2e2e2', white: '#ffffff',
};

const PRIO_COLOR = { hoch: C.red, mittel: '#e67e22', niedrig: '#27ae60' };

export default function ResultView({ answers, onRequestFullResults }) {
  const riskLevel  = classifyRisk(answers);
  const maturity   = calcMaturityScore(answers);
  const gaps       = identifyGaps(answers, riskLevel);
  const rating     = getMaturityRating(maturity);
  const actionNeed = getActionNeed(riskLevel, maturity);
  const meta       = RISK_META[riskLevel] || RISK_META.minimal;

  const actionColors = { hoch: C.red, mittel: '#e67e22', gering: '#27ae60' };

  const topGaps = [...gaps].sort((a, b) => {
    const p = { hoch: 0, mittel: 1, niedrig: 2 };
    return p[a.prio] - p[b.prio];
  }).slice(0, 4);

  const actionLabel = {
    hoch:   'Sofortiger Handlungsbedarf',
    mittel: 'Maßnahmen zeitnah einleiten',
    gering: 'Grundlagen vorhanden',
  }[actionNeed] || '';

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.7rem', fontWeight: 700, color: C.black }}>
          EU AI Act Readiness Assessment
        </h1>
        <p style={{ margin: 0, color: C.gray, fontSize: '0.9rem' }}>
          Ihre persönliche Auswertung – {new Date().toLocaleDateString('de-DE')}
        </p>
      </div>

      {/* Risk Classification Banner */}
      <div style={{
        background: meta.bg,
        border: `1.5px solid ${meta.color}`,
        borderRadius: 12,
        padding: '1.5rem',
        marginBottom: '1.25rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: meta.color,
          color: '#fff',
          fontWeight: 800,
          fontSize: '0.68rem',
          letterSpacing: '1px',
          padding: '0.25rem 0.8rem',
          borderRadius: 999,
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
        }}>
          {meta.badge}
        </div>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 700, color: meta.color }}>
          {meta.label}
        </h2>
        <p style={{ margin: 0, color: C.gray, fontSize: '0.92rem', lineHeight: 1.6, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          {meta.summary}
        </p>
      </div>

      {/* Score + Action cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: C.lightGray, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
            Reifegrad-Score
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: C.red, lineHeight: 1.1 }}>
            {maturity}%
          </div>
          <div style={{
            display: 'inline-block', marginTop: '0.75rem',
            background: C.red, color: C.white,
            padding: '0.35rem 1.1rem', borderRadius: 999,
            fontSize: '0.85rem', fontWeight: 700,
          }}>
            {rating.label}
          </div>
        </div>
        <div style={{ background: C.lightGray, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
            Handlungsbedarf
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: actionColors[actionNeed] || '#999', lineHeight: 1.1, textTransform: 'uppercase' }}>
            {actionNeed}
          </div>
          <div style={{ color: C.gray, fontSize: '0.85rem', marginTop: '0.75rem' }}>
            {actionLabel}
          </div>
        </div>
      </div>

      {/* Executive Summary (compact) */}
      <div style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.75rem' }}>
          Executive Summary
        </div>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: '#374151', lineHeight: 1.7 }}>
          Ihr Unternehmen weist eine <strong>Risikoeinstufung „{meta.label}"</strong> unter dem EU AI Act auf.
          Der Gesamtreifegrad liegt bei <strong>{maturity}%</strong> ({rating.label}).
        </p>
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151', lineHeight: 1.7 }}>
          {gaps.length > 0
            ? `Es bestehen ${gaps.length} Compliance-Lücken, davon ${gaps.filter(g => g.prio === 'hoch').length} mit hoher Priorität.`
            : 'Es wurden keine wesentlichen Compliance-Lücken identifiziert.'}{' '}
          <strong>Empfehlung:</strong> Handlungsbedarf ist{' '}
          <strong style={{ color: actionColors[actionNeed] }}>{actionNeed}</strong>.
          {actionNeed === 'hoch' && ' Wir empfehlen dringend ein strukturiertes EU AI Act Compliance Projekt.'}
          {actionNeed === 'mittel' && ' Ein begleitetes Compliance-Projekt ist empfehlenswert.'}
          {actionNeed === 'gering' && ' Regelmäßige Überprüfung des bestehenden Frameworks ist sinnvoll.'}
        </p>
      </div>

      {/* Gated CTA */}
      <div style={{
        background: `linear-gradient(135deg, ${C.black} 0%, ${C.dark} 100%)`,
        borderRadius: 14,
        padding: '2rem',
        border: '1px solid #3a3a3a',
      }}>
        <div style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${C.red}, ${C.redDark})`,
          color: C.white,
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: '0.2rem 0.65rem',
          borderRadius: 999,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: '0.85rem',
        }}>
          Vollständiger Bericht
        </div>
        <h3 style={{ margin: '0 0 0.65rem', color: C.white, fontSize: '1.15rem' }}>
          Ihr individueller Maßnahmenkatalog
        </h3>
        <p style={{ margin: '0 0 1.25rem', color: 'rgba(255,255,255,0.72)', fontSize: '0.92rem', lineHeight: 1.65 }}>
          Erhalten Sie die vollständige Auswertung mit priorisierten Handlungsempfehlungen,
          Gap-Analyse und konkretem Maßnahmenplan – individuell auf Ihr Unternehmen zugeschnitten.
        </p>

        {topGaps.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            borderRadius: 10,
            padding: '0.9rem 1.1rem',
            marginBottom: '1.25rem',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              Identifizierte Compliance-Risiken (Auswahl)
            </div>
            {topGaps.map((gap) => (
              <div key={gap.id} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.25rem 0' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIO_COLOR[gap.prio] || '#999', flexShrink: 0 }} />
                <span style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.82)' }}>{gap.label}</span>
              </div>
            ))}
            {gaps.length > 4 && (
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.38)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                … und {gaps.length - 4} weitere Compliance-Risiken
              </div>
            )}
          </div>
        )}

        <button
          onClick={onRequestFullResults}
          style={{
            width: '100%',
            padding: '0.95rem',
            background: `linear-gradient(135deg, ${C.red}, ${C.redDark})`,
            color: C.white,
            border: 'none',
            borderRadius: 10,
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          Vollständige Analyse freischalten →
        </button>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '0.65rem', marginBottom: 0 }}>
          Kostenlos · Ihre Daten bleiben vertraulich
        </p>
      </div>
    </div>
  );
}
