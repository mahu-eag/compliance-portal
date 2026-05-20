import React, { useState, useMemo } from 'react';
import { getRelevantMeasures } from '../data/measures';
import { generateExecutiveSummary } from '../utils/executiveSummary';

// ─── Design Tokens ────────────────────────────────────────────────────────
const C = {
  red: '#e30613', redDark: '#b9000d', redSoft: '#fff1f2',
  black: '#1f1f1f', dark: '#2b2b2b', gray: '#6f6f6f',
  lightGray: '#f4f4f4', border: '#e2e2e2', white: '#ffffff',
};
const PRIORITY_COLOR = { high: C.red, medium: '#d97706', low: '#16a34a' };
const typeLabels     = { tech: '🛠 Technisch', org: '📋 Organisatorisch', change: '👥 Change & Adoption' };
const priorityLabels = { high: 'Hoch', medium: 'Mittel', low: 'Niedrig' };
const deliveryLabels = { intern: '🏠 Intern', extern: '🤝 Extern', both: '🏠🤝 Intern & Extern' };

// ─── Measure Section Card ─────────────────────────────────────────────────
function SectionCard({ section, idx }) {
  const [open, setOpen] = useState(false);
  const prio     = section.sectionPriority;
  const scorePct = Math.round((section.achievedScore / section.maxScore) * 100);

  return (
    <div style={{ background: C.white, borderRadius: 12, marginBottom: '0.85rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.1rem 1.4rem', cursor: 'pointer', userSelect: 'none', gap: '1rem' }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
          <div style={{ width: 5, borderRadius: 4, alignSelf: 'stretch', background: PRIORITY_COLOR[prio], flexShrink: 0, minHeight: 44 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.gray, marginBottom: '0.15rem' }}>{section.category}</div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: C.black }}>
              <span style={{ display: 'inline-block', background: C.lightGray, color: C.gray, fontSize: '0.75rem', padding: '0.05rem 0.4rem', borderRadius: 4, marginRight: '0.4rem', fontWeight: 600 }}>#{idx + 1}</span>
              {section.topic}
            </h3>
            <div style={{ fontSize: '0.82rem', color: C.gray, marginTop: '0.15rem' }}>Aktuell: <em>{section.currentAnswer}</em> · {section.achievedScore}/{section.maxScore} Punkte</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <div>
            <div style={{ height: 4, background: C.border, borderRadius: 4, overflow: 'hidden', width: 80 }}>
              <div style={{ height: '100%', width: `${scorePct}%`, background: PRIORITY_COLOR[prio], borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: C.gray, marginTop: 2 }}>{scorePct}% erreicht</div>
          </div>
          <div style={{ padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, background: PRIORITY_COLOR[prio] + '18', color: PRIORITY_COLOR[prio], border: `1px solid ${PRIORITY_COLOR[prio]}44` }}>
            {priorityLabels[prio]}
          </div>
          <span style={{ background: C.lightGray, color: C.gray, fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: 999, fontWeight: 600 }}>{section.measures.length} Maßnahmen</span>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.lightGray, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>▼</div>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '1rem 1.4rem 1.4rem' }}>
          <div style={{ display: 'grid', gap: '0.65rem' }}>
            {section.measures.map((m, i) => {
              const bc = m.type === 'tech' ? '#3b82f6' : m.type === 'org' ? '#8b5cf6' : '#ec4899';
              return (
                <div key={i} style={{ background: C.lightGray, borderRadius: 8, borderLeft: `3px solid ${bc}`, padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: 4, background: bc + '22', color: m.type === 'tech' ? '#1d4ed8' : m.type === 'org' ? '#6d28d9' : '#be185d', border: `1px solid ${bc}44`, fontWeight: 500 }}>{typeLabels[m.type]}</span>
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: 4, background: PRIORITY_COLOR[m.priority] + '22', color: PRIORITY_COLOR[m.priority], border: `1px solid ${PRIORITY_COLOR[m.priority]}44`, fontWeight: 500 }}>{priorityLabels[m.priority]}</span>
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: 4, background: '#55555522', color: C.gray, border: '1px solid #55555544', fontWeight: 500 }}>{deliveryLabels[m.delivery]}</span>
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: 4, background: '#55555522', color: C.gray, border: '1px solid #55555544', fontWeight: 500 }}>⏱ {m.effortPT} PT</span>
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: 4, background: '#55555522', color: C.gray, border: '1px solid #55555544', fontWeight: 500 }}>📅 {m.durationWeeks} Wo.</span>
                  </div>
                  <div style={{ margin: '0.1rem 0 0.25rem', fontSize: '0.95rem', fontWeight: 700, color: C.black }}>{m.title}</div>
                  <p style={{ margin: 0, fontSize: '0.87rem', color: C.gray, lineHeight: 1.55 }}>{m.description}</p>
                  {m.dependsOn?.length > 0 && <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>⛓ Voraussetzung: {m.dependsOn.join(' → ')}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function FullResultsPage({ questions, answers, contactData, onRestart }) {

  // ── Scoring ───────────────────────────────────────────────────────────
  const scoredQs   = questions.filter(q => q.options.some(o => o.score !== undefined));
  const maxScore   = scoredQs.reduce((s, q) => s + Math.max(...q.options.map(o => o.score || 0)), 0);
  const achieved   = scoredQs.reduce((s, q) => {
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

  let nis2Status = 'Nicht betroffen';
  let nis2Class  = 'status-none';
  if (industry?.criticality === 'essential' && isLargeOrMedium)      { nis2Status = 'Wesentliche Einrichtung (Essential Entity)'; nis2Class = 'status-essential'; }
  else if (industry?.criticality === 'important' && isLargeOrMedium) { nis2Status = 'Wichtige Einrichtung (Important Entity)';    nis2Class = 'status-important'; }
  else if (industry?.criticality && industry.criticality !== 'none')  { nis2Status = 'Vermutlich nicht betroffen (Größenkriterium nicht erfüllt)'; nis2Class = 'status-low'; }

  const relevantMeasures = useMemo(() => getRelevantMeasures(questions, answers), [questions, answers]);
  const scoreData        = { percentage, achievedScore: achieved, maxScore, nis2Status };
  const summary          = generateExecutiveSummary(questions, answers, relevantMeasures, scoreData);

  const highPrioCount  = relevantMeasures.filter(m => m.sectionPriority === 'high').length;
  const totalMeasures  = relevantMeasures.reduce((s, m) => s + m.measures.length, 0);
  const totalEffort    = relevantMeasures.reduce((s, sec) => s + sec.measures.reduce((ss, m) => ss + (m.effortPT || 0), 0), 0);

  const [filterType,     setFilterType]     = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filterFn = m =>
    (filterType     === 'all' || m.type     === filterType) &&
    (filterPriority === 'all' || m.priority === filterPriority);

  const ratingClass = summary.ratingLabel === 'Ausgezeichnet' ? 'rating-excellent'
    : summary.ratingLabel === 'Gut'                           ? 'rating-good'
    : summary.ratingLabel === 'Verbesserungswürdig'           ? 'rating-medium'
    : 'rating-critical';

  const FilterBtn = ({ value, label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding: '0.35rem 0.85rem', border: `1px solid ${active ? C.red : C.border}`,
      background: active ? C.red : C.white, color: active ? C.white : C.black,
      borderRadius: 999, cursor: 'pointer', fontSize: '0.82rem', fontWeight: active ? 600 : 500,
      transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color: C.black }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }} className="no-print">
          <div style={{ fontSize: '0.85rem', color: C.gray }}>
            Vollständige Auswertung · {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.print()}
              style={{ padding: '0.6rem 1.2rem', background: C.black, color: C.white, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
            >
              PDF herunterladen
            </button>
            <a
              href="mailto:infosec@elpix.ag?subject=Beratungsgespräch NIS-2 Assessment"
              style={{ padding: '0.6rem 1.2rem', background: C.red, color: C.white, borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              Beratungsgespräch anfragen
            </a>
          </div>
        </div>

        {/* ── Welcome Banner ───────────────────────────────────────────────── */}
        {contactData && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            border: '1px solid #bbf7d0', borderRadius: 12,
            padding: '1rem 1.4rem', marginBottom: '1.5rem',
          }}>
            <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.95rem' }}>
              Willkommen, {contactData.name}{contactData.company ? ` · ${contactData.company}` : ''}
            </div>
            <div style={{ color: '#166534', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Ihre vollständige Auswertung wurde an <strong>{contactData.email}</strong> gesendet.
              Das elpix-Team meldet sich in Kürze bei Ihnen.
            </div>
          </div>
        )}

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(135deg, ${C.black} 0%, ${C.dark} 100%)`,
          color: C.white, borderRadius: 14, padding: '2rem 2.5rem', marginBottom: '2rem',
        }}>
          <div style={{ display: 'inline-block', background: `linear-gradient(135deg, ${C.red}, ${C.redDark})`, color: C.white, fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: 999, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            NIS-2 Readiness Assessment
          </div>
          <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.7rem', fontWeight: 700 }}>Ihre vollständige Auswertung</h1>
          <p style={{ margin: '0 0 1.5rem', opacity: 0.85, fontSize: '1rem', lineHeight: 1.6 }}>
            Individuelle Handlungsempfehlungen auf Basis Ihrer Antworten – priorisiert nach Risikorelevanz.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { value: `${percentage}%`,        label: 'Reifegrad',         red: true },
              { value: relevantMeasures.length,  label: 'Handlungsfelder' },
              { value: totalMeasures,            label: 'Maßnahmen gesamt' },
              { value: highPrioCount,            label: 'Hohe Priorität',   red: highPrioCount > 0 },
              { value: `${totalEffort} PT`,      label: 'Gesamtaufwand' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', padding: '0.9rem 1.4rem', borderRadius: 10, minWidth: 100, border: '1px solid rgba(255,255,255,0.15)' }}>
                <span style={{ display: 'block', fontSize: '1.9rem', fontWeight: 700, color: s.red ? '#fca5a5' : C.white }}>{s.value}</span>
                <span style={{ fontSize: '0.82rem', opacity: 0.8 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── NIS-2 Status + Score ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className={`status-banner ${nis2Class}`} style={{ margin: 0, borderRadius: 12 }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem', opacity: 0.9 }}>NIS-2 Klassifizierung</h2>
            <p className="status-label" style={{ fontSize: '1.1rem' }}>{nis2Status}</p>
          </div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="score-circle" style={{ width: 100, height: 100, flexShrink: 0 }}>
              <span className="score-percentage" style={{ fontSize: '1.8rem' }}>{percentage}%</span>
              <span className="score-label">{achieved}/{maxScore} P.</span>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '0.4rem' }}>Reifegrad</div>
              <div className={`rating-badge ${ratingClass}`} style={{ display: 'inline-block' }}>{summary.ratingLabel}</div>
              <div style={{ fontSize: '0.82rem', color: C.gray, marginTop: '0.5rem' }}>Cybersicherheitsreifegrad</div>
            </div>
          </div>
        </div>

        {/* ── Executive Summary ─────────────────────────────────────────────── */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `2px solid ${C.border}` }}>
            <div style={{ width: 4, height: 28, background: C.red, borderRadius: 4, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vertraulich</div>
              <h2 style={{ margin: 0, fontSize: '1.3rem', color: C.black }}>Executive Summary</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {summary.sections.map((sec, i) => (
              <div key={i} style={{ padding: '1.25rem', background: C.lightGray, borderRadius: 10, borderLeft: `3px solid ${i === 0 ? C.red : i === 2 ? '#d97706' : C.border}` }}>
                <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.82rem', fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {sec.headline}
                </h4>
                <p style={{ margin: 0, fontSize: '0.93rem', color: '#374151', lineHeight: 1.7 }}>
                  {sec.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Answers Summary ───────────────────────────────────────────────── */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 4, height: 28, background: C.black, borderRadius: 4, flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: C.black }}>Antwortübersicht</h2>
          </div>
          {Array.from(new Set(questions.map(q => q.category))).map(cat => (
            <div key={cat} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: C.red, borderBottom: `2px solid ${C.border}`, paddingBottom: '0.4rem', marginBottom: '0.5rem', fontSize: '1rem' }}>{cat}</h3>
              {questions.filter(q => q.category === cat).map(q => {
                const ans = q.options.find(o => o.value === answers[q.id]);
                return (
                  <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: `1px solid ${C.border}`, gap: '1rem' }}>
                    <span style={{ color: C.gray, flex: 1, fontSize: '0.93rem' }}>{q.text}</span>
                    <span style={{ fontWeight: 600, color: C.black, textAlign: 'right', flex: 1, fontSize: '0.93rem' }}>{ans?.label || '—'}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Measures ─────────────────────────────────────────────────────── */}
        {relevantMeasures.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 4, height: 28, background: C.red, borderRadius: 4, flexShrink: 0 }} />
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: C.black }}>Maßnahmenkatalog</h2>
                <div style={{ fontSize: '0.82rem', color: C.gray, marginTop: '0.15rem' }}>Klicken Sie auf einen Bereich, um die Maßnahmen einzusehen.</div>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', background: C.lightGray, borderRadius: 10, padding: '1rem 1.2rem', marginBottom: '1.5rem', border: `1px solid ${C.border}` }} className="no-print">
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: C.gray, marginRight: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Typ:</span>
                {[{v:'all',l:'Alle'},{v:'tech',l:'🛠 Technisch'},{v:'org',l:'📋 Organisatorisch'},{v:'change',l:'👥 Change'}].map(({ v, l }) => (
                  <FilterBtn key={v} value={v} label={l} active={filterType === v} onClick={() => setFilterType(v)} />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: C.gray, marginRight: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Priorität:</span>
                {[{v:'all',l:'Alle'},{v:'high',l:'🔴 Hoch'},{v:'medium',l:'🟡 Mittel'},{v:'low',l:'🟢 Niedrig'}].map(({ v, l }) => (
                  <FilterBtn key={v} value={v} label={l} active={filterPriority === v} onClick={() => setFilterPriority(v)} />
                ))}
              </div>
            </div>

            <section>
              {relevantMeasures.map((section, idx) => {
                const filtered = section.measures.filter(filterFn);
                if (filtered.length === 0) return null;
                return <SectionCard key={section.questionId} section={{ ...section, measures: filtered }} idx={idx} />;
              })}
            </section>
          </div>
        )}

        {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(135deg, ${C.lightGray}, #e8eaed)`,
          border: `1px solid ${C.border}`, borderRadius: 14, padding: '2rem',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem',
        }}>
          <div>
            <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', color: C.black }}>Nächster Schritt: Persönliche Beratung</h3>
            <p style={{ margin: 0, color: C.gray, fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 480 }}>
              Das elpix-Team analysiert Ihre Situation und entwickelt gemeinsam mit Ihnen einen
              individuellen Umsetzungsplan. Vereinbaren Sie ein unverbindliches Erstgespräch.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="mailto:infosec@elpix.ag?subject=Beratungsgespräch NIS-2 Assessment"
              style={{ padding: '0.85rem 1.5rem', background: C.red, color: C.white, borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', display: 'inline-block' }}
            >
              Beratungsgespräch anfragen
            </a>
            <button
              onClick={onRestart}
              style={{ padding: '0.85rem 1.5rem', background: C.white, color: C.black, border: `2px solid ${C.border}`, borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}
            >
              Assessment neu starten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
