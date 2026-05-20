import React from 'react';
import { getRelevantMeasures } from '../data/measures';
import { generateExecutiveSummary } from '../utils/executiveSummary';

// ─── Design Tokens ────────────────────────────────────────────────────────
const C = {
  red: '#e30613', redDark: '#b9000d', redSoft: '#fff1f2',
  black: '#1f1f1f', dark: '#2b2b2b', gray: '#6f6f6f',
  lightGray: '#f4f4f4', border: '#e2e2e2', white: '#ffffff',
};
const PRIORITY_COLOR = { high: C.red, medium: '#d97706', low: '#16a34a' };

export default function ResultView({ questions, answers, onRequestFullResults }) {

  // ── Scoring ───────────────────────────────────────────────────────────
  const scoredQs = questions.filter(q => q.options.some(o => o.score !== undefined));
  const maxScore = scoredQs.reduce((s, q) => s + Math.max(...q.options.map(o => o.score || 0)), 0);
  const achieved = scoredQs.reduce((s, q) => {
    const opt = q.options.find(o => o.value === answers[q.id]);
    return s + (opt?.score || 0);
  }, 0);
  const percentage = maxScore > 0 ? Math.round((achieved / maxScore) * 100) : 0;

  // ── NIS-2 Classification ──────────────────────────────────────────────
  const industry  = questions.find(q => q.id === 'industry')?.options.find(o => o.value === answers['industry']);
  const employees = questions.find(q => q.id === 'employees')?.options.find(o => o.value === answers['employees']);
  const revenue   = questions.find(q => q.id === 'revenue')?.options.find(o => o.value === answers['revenue']);

  const isLargeOrMedium =
    employees?.size === 'large' || employees?.size === 'medium' ||
    revenue?.size   === 'large' || revenue?.size   === 'medium';

  let nis2Status    = 'Nicht betroffen';
  let nis2Badge     = 'NICHT BETROFFEN';
  let nis2Desc      = 'Auf Basis Ihrer Angaben sind Sie voraussichtlich nicht direkt von NIS-2 erfasst.';
  let nis2BannerBg  = '#f4f4f4';
  let nis2BannerBdr = C.border;
  let nis2Color     = C.gray;

  if (industry?.criticality === 'essential' && isLargeOrMedium) {
    nis2Status   = 'Wesentliche Einrichtung';
    nis2Badge    = 'ESSENTIAL ENTITY';
    nis2Desc     = 'Sie unterliegen als wesentliche Einrichtung den strengsten NIS-2-Anforderungen, inkl. persönlicher Haftung der Geschäftsleitung und 24h-Meldepflicht.';
    nis2BannerBg = '#fff1f2';
    nis2BannerBdr= '#fca5a5';
    nis2Color    = C.red;
  } else if (industry?.criticality === 'important' && isLargeOrMedium) {
    nis2Status   = 'Wichtige Einrichtung';
    nis2Badge    = 'IMPORTANT ENTITY';
    nis2Desc     = 'Als wichtige Einrichtung sind Sie zur Umsetzung umfassender Sicherheitsmaßnahmen und Erfüllung der NIS-2-Meldepflichten verpflichtet.';
    nis2BannerBg = '#fffbeb';
    nis2BannerBdr= '#fcd34d';
    nis2Color    = '#b45309';
  } else if (industry?.criticality && industry.criticality !== 'none') {
    nis2Status   = 'Voraussichtlich nicht betroffen';
    nis2Badge    = 'GRÖSSEN­KRITERIUM';
    nis2Desc     = 'Das Größenkriterium der NIS-2-Richtlinie ist nach aktuellen Angaben noch nicht erfüllt. Lieferkettenanforderungen können dennoch relevant sein.';
    nis2BannerBg = '#f4f4f4';
    nis2BannerBdr= C.border;
    nis2Color    = C.gray;
  }

  // ── Measures & Summary ────────────────────────────────────────────────
  const relevantMeasures = getRelevantMeasures(questions, answers);
  const scoreData        = { percentage, achievedScore: achieved, maxScore, nis2Status };
  const summary          = generateExecutiveSummary(questions, answers, relevantMeasures, scoreData);

  const highPrioCount = relevantMeasures.filter(m => m.sectionPriority === 'high').length;
  const totalMeasures = relevantMeasures.reduce((s, m) => s + m.measures.length, 0);

  // ── Rating ────────────────────────────────────────────────────────────
  const ratingLabel = summary.ratingLabel;
  const ratingColor = summary.ratingColor;
  const urgency     = percentage < 40 ? 'Sofortiger Handlungsbedarf'
                    : percentage < 65 ? 'Strukturierter Handlungsbedarf'
                    : percentage < 85 ? 'Optimierungspotenzial vorhanden'
                    : 'Gut aufgestellt';
  const urgencyLevel = percentage < 40 ? 'HOCH' : percentage < 65 ? 'MITTEL' : percentage < 85 ? 'NIEDRIG' : 'MINIMAL';
  const urgencyColor = percentage < 40 ? C.red : percentage < 65 ? '#d97706' : '#16a34a';

  // ── Compact executive summary (2–3 sentences) ─────────────────────────
  const execText = [
    summary.sections[0]?.body,   // classification
    summary.sections[1]?.body,   // maturity
  ].filter(Boolean).join(' ');

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.7rem', fontWeight: 700, color: C.black }}>
          NIS-2 Readiness Assessment
        </h1>
        <p style={{ margin: 0, color: C.gray, fontSize: '0.9rem' }}>
          Ihre persönliche Auswertung – {new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* ── Classification banner ─────────────────────────────────────── */}
      <div style={{
        background: nis2BannerBg, border: `1.5px solid ${nis2BannerBdr}`,
        borderRadius: 12, padding: '1.5rem', marginBottom: '1.25rem', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block', background: nis2Color, color: C.white,
          fontSize: '0.68rem', fontWeight: 800, letterSpacing: '1px',
          padding: '0.25rem 0.8rem', borderRadius: 999, marginBottom: '0.75rem',
        }}>
          {nis2Badge}
        </div>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 700, color: nis2Color }}>
          {nis2Status}
        </h2>
        <p style={{ margin: 0, color: C.gray, fontSize: '0.92rem', lineHeight: 1.6, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          {nis2Desc}
        </p>
      </div>

      {/* ── Score + Urgency cards ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>

        {/* Score card */}
        <div style={{ background: C.lightGray, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
            Reifegrad-Score
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: ratingColor, lineHeight: 1.1 }}>
            {percentage}%
          </div>
          <div style={{
            display: 'inline-block', marginTop: '0.75rem',
            background: ratingColor, color: C.white,
            padding: '0.35rem 1.1rem', borderRadius: 999,
            fontSize: '0.85rem', fontWeight: 700,
          }}>
            {ratingLabel}
          </div>
        </div>

        {/* Urgency card */}
        <div style={{ background: C.lightGray, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
            Handlungsbedarf
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: urgencyColor, lineHeight: 1.1 }}>
            {urgencyLevel}
          </div>
          <div style={{ color: C.gray, fontSize: '0.85rem', marginTop: '0.75rem' }}>
            {urgency}
          </div>
        </div>
      </div>

      {/* ── Executive Summary (compact) ───────────────────────────────── */}
      <div style={{
        background: C.white, border: `1px solid ${C.border}`,
        borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.75rem' }}>
          Executive Summary
        </div>
        <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: '#374151', lineHeight: 1.7 }}>
          {execText}
        </p>
        {summary.sections[2]?.body && (
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151', lineHeight: 1.7 }}>
            <strong>{summary.sections[2].headline}:</strong>{' '}{summary.sections[2].body}
          </p>
        )}
        {highPrioCount > 0 && (
          <p style={{ margin: '1rem 0 0', fontSize: '0.88rem', color: C.red, fontWeight: 600 }}>
            Empfehlung: Handlungsbedarf ist{' '}
            <span style={{ color: urgencyColor }}>{urgencyLevel.toLowerCase()}</span>.{' '}
            {totalMeasures} Maßnahmen in {relevantMeasures.length} Handlungsfeldern wurden identifiziert, davon {highPrioCount} mit hoher Priorität.
          </p>
        )}
      </div>

      {/* ── Gated CTA ─────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.black} 0%, ${C.dark} 100%)`,
        borderRadius: 14, padding: '2rem',
        border: `1px solid #3a3a3a`,
      }}>
        <div style={{
          display: 'inline-block', background: `linear-gradient(135deg, ${C.red}, ${C.redDark})`,
          color: C.white, fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.65rem',
          borderRadius: 999, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.85rem',
        }}>
          Vollständiger Bericht
        </div>
        <h3 style={{ margin: '0 0 0.65rem', color: C.white, fontSize: '1.15rem' }}>
          Ihr individueller Maßnahmenkatalog
        </h3>
        <p style={{ margin: '0 0 1.25rem', color: 'rgba(255,255,255,0.72)', fontSize: '0.92rem', lineHeight: 1.65 }}>
          Erhalten Sie die vollständige Auswertung mit priorisierten Handlungsempfehlungen
          und konkreten Maßnahmen – individuell auf Ihr Unternehmen zugeschnitten.
        </p>

        {/* Preview of top topics */}
        {relevantMeasures.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.07)', borderRadius: 10,
            padding: '0.9rem 1.1rem', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              Handlungsfelder (Auswahl)
            </div>
            {relevantMeasures.slice(0, 4).map(s => (
              <div key={s.questionId} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.25rem 0' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_COLOR[s.sectionPriority], flexShrink: 0 }} />
                <span style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.82)' }}>{s.topic}</span>
              </div>
            ))}
            {relevantMeasures.length > 4 && (
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.38)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                … und {relevantMeasures.length - 4} weitere Handlungsfelder
              </div>
            )}
          </div>
        )}

        <button
          onClick={onRequestFullResults}
          style={{
            width: '100%', padding: '0.95rem',
            background: `linear-gradient(135deg, ${C.red}, ${C.redDark})`,
            color: C.white, border: 'none', borderRadius: 10,
            fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={e  => e.currentTarget.style.opacity = '0.9'}
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
