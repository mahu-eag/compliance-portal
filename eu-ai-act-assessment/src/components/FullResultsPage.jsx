import React from 'react';
import {
  classifyRisk,
  calcMaturityScore,
  calcAreaScores,
  identifyGaps,
  getMaturityRating,
  getActionNeed,
  RISK_META,
} from '../utils/scoring';
import { getMeasuresForAssessment } from '../data/measures';
import { questions } from '../data/questions';

const C = {
  red: '#e30613', redDark: '#b9000d', redSoft: '#fff1f2',
  black: '#1f1f1f', dark: '#2b2b2b', gray: '#6f6f6f',
  lightGray: '#f4f4f4', border: '#e2e2e2', white: '#ffffff',
};

const HORIZON_META = {
  kurzfristig:  { label: '0–3 Monate',   color: C.red,      icon: '🚨', heading: 'Sofortmaßnahmen (0–3 Monate)',               sub: 'Diese Maßnahmen sollten umgehend gestartet werden' },
  mittelfristig: { label: '3–12 Monate', color: '#e67e22',  icon: '📋', heading: 'Mittelfristige Maßnahmen (3–12 Monate)',      sub: 'Strukturierter Aufbau von Compliance-Strukturen' },
  strategisch:  { label: '> 12 Monate',  color: '#27ae60',  icon: '🏗️', heading: 'Strategische Maßnahmen (> 12 Monate)',         sub: 'Langfristiger Aufbau eines AI Governance Frameworks' },
};

const EFFORT_COLOR = { Niedrig: '#27ae60', Mittel: '#e67e22', Hoch: C.red };
const PRIO_COLOR   = { hoch: C.red, mittel: '#e67e22', niedrig: '#27ae60' };

function ScoreBar({ label, value }) {
  const color = value >= 70 ? '#27ae60' : value >= 40 ? '#e67e22' : C.red;
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.25rem' }}>
        <span style={{ color: C.gray }}>{label}</span>
        <span style={{ fontWeight: 600, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

function PrioBadge({ prio }) {
  return (
    <span style={{
      background: PRIO_COLOR[prio] || '#999',
      color: '#fff',
      fontSize: '0.72rem',
      fontWeight: 700,
      padding: '0.15rem 0.55rem',
      borderRadius: 999,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}>
      {prio}
    </span>
  );
}

function MeasureCard({ m }) {
  const hm = HORIZON_META[m.horizon] || {};
  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${hm.color}`,
      borderRadius: '0 8px 8px 0',
      padding: '1rem 1.25rem',
      marginBottom: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.4rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: C.black }}>{m.title}</div>
        <span style={{
          background: EFFORT_COLOR[m.effort] || '#999',
          color: '#fff',
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '0.15rem 0.5rem',
          borderRadius: 999,
          flexShrink: 0,
        }}>
          Aufwand: {m.effort}
        </span>
      </div>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.88rem', color: C.gray, lineHeight: 1.55 }}>
        {m.description}
      </p>
      <div style={{ fontSize: '0.8rem', color: C.gray }}>
        <strong>Verantwortlich:</strong> {m.owner}
      </div>
    </div>
  );
}

function MeasureSection({ horizon, measures }) {
  const hm = HORIZON_META[horizon];
  if (!measures.length) return null;
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        marginBottom: '1rem', paddingBottom: '0.5rem',
        borderBottom: `2px solid ${hm.color}`,
      }}>
        <span style={{ fontSize: '1.4rem' }}>{hm.icon}</span>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.15rem', color: hm.color }}>{hm.heading}</h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: C.gray }}>{hm.sub}</p>
        </div>
      </div>
      {measures.map(m => <MeasureCard key={m.id} m={m} />)}
    </div>
  );
}

export default function FullResultsPage({ answers, contactData, onRestart }) {
  const riskLevel  = classifyRisk(answers);
  const maturity   = calcMaturityScore(answers);
  const areas      = calcAreaScores(answers);
  const gaps       = identifyGaps(answers, riskLevel);
  const rating     = getMaturityRating(maturity);
  const actionNeed = getActionNeed(riskLevel, maturity);
  const meta       = RISK_META[riskLevel] || RISK_META.minimal;
  const allMeasures = getMeasuresForAssessment(riskLevel, gaps);

  const byHorizon = h => allMeasures.filter(m => m.horizon === h);

  const actionColors = { hoch: C.red, mittel: '#e67e22', gering: '#27ae60' };

  const useCases = [];
  const internalAI = answers.ai_internal || [];
  const customerAI = answers.ai_customer || [];
  const opAI       = answers.ai_operational || [];

  if (!internalAI.includes('none_internal')) {
    internalAI.filter(v => !v.startsWith('none')).forEach(v => {
      const q = questions.find(x => x.id === 'ai_internal');
      const opt = q?.options.find(o => o.value === v);
      if (opt) useCases.push({ label: opt.label, domain: 'Intern' });
    });
  }
  if (!customerAI.includes('none_customer')) {
    customerAI.filter(v => !v.startsWith('none')).forEach(v => {
      const q = questions.find(x => x.id === 'ai_customer');
      const opt = q?.options.find(o => o.value === v);
      if (opt) useCases.push({ label: opt.label, domain: 'Kundeninteraktion' });
    });
  }
  if (!opAI.includes('none_operational')) {
    opAI.filter(v => !v.startsWith('none')).forEach(v => {
      const q = questions.find(x => x.id === 'ai_operational');
      const opt = q?.options.find(o => o.value === v);
      if (opt) useCases.push({ label: opt.label, domain: 'Operativ' });
    });
  }

  const handlePrint = () => window.print();

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
        marginBottom: '1.5rem',
      }} className="no-print">
        <button className="btn btn-export btn-large" onClick={handlePrint}>
          ⬇ Als PDF speichern
        </button>
        <a
          href="https://elpix.ag"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          Beratungsgespräch anfragen →
        </a>
      </div>

      {/* Welcome banner */}
      {contactData?.name && (
        <div style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: '1.5rem',
          marginBottom: '1.5rem',
          borderLeft: `4px solid ${C.red}`,
        }}>
          <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem', color: C.black }}>
            Ihre persönliche EU AI Act Auswertung
          </h2>
          <p style={{ margin: 0, color: C.gray, fontSize: '0.92rem' }}>
            Erstellt für <strong style={{ color: C.black }}>{contactData.name}</strong>
            {contactData.company ? ` · ${contactData.company}` : ''}{' '}
            · {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      )}

      {/* Risk Classification Banner */}
      <div style={{
        background: meta.bg,
        border: `2px solid ${meta.color}`,
        borderRadius: 12,
        padding: '1.5rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block', background: meta.color, color: '#fff',
          fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px',
          padding: '0.25rem 0.9rem', borderRadius: 999, marginBottom: '0.75rem',
          textTransform: 'uppercase',
        }}>
          {meta.badge}
        </div>
        <h2 style={{ margin: '0 0 0.5rem', color: meta.color, fontSize: '1.4rem' }}>{meta.label}</h2>
        <p style={{ margin: 0, color: C.dark, fontSize: '0.95rem', lineHeight: 1.55 }}>{meta.summary}</p>
      </div>

      {/* Hero Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: C.lightGray, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
            Reifegrad-Score
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, color: C.red, lineHeight: 1 }}>{maturity}%</div>
          <div style={{ marginTop: '0.5rem' }}>
            <span className={`rating-badge ${rating.cls}`}>{rating.label}</span>
          </div>
        </div>
        <div style={{ background: C.lightGray, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
            Handlungsbedarf
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: actionColors[actionNeed] || '#999', lineHeight: 1, textTransform: 'uppercase' }}>
            {actionNeed}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: C.gray }}>
            {actionNeed === 'hoch' && 'Sofortiger Handlungsbedarf'}
            {actionNeed === 'mittel' && 'Maßnahmen zeitnah einleiten'}
            {actionNeed === 'gering' && 'Grundlagen vorhanden'}
          </div>
        </div>
        <div style={{ background: C.lightGray, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
            Maßnahmen
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, color: C.red, lineHeight: 1 }}>{allMeasures.length}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: C.gray }}>Empfohlene Schritte</div>
        </div>
      </div>

      {/* Executive Summary */}
      <div style={{ background: C.lightGray, borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem', border: `1px solid ${C.border}` }}>
        <h3 style={{ margin: '0 0 1rem', color: C.red, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Executive Summary
        </h3>
        <p style={{ margin: '0 0 0.75rem', lineHeight: 1.65, fontSize: '0.95rem' }}>
          Ihr Unternehmen weist eine <strong>Risikoeinstufung „{meta.label}"</strong> unter dem EU AI Act auf.
          Der Gesamtreifegrad liegt bei <strong>{maturity}%</strong> ({rating.label}).
          {useCases.length > 0
            ? ` Es wurden ${useCases.length} KI-Use-Cases identifiziert.`
            : ' Aktuell sind keine relevanten KI-Systeme im Einsatz.'}
        </p>
        <p style={{ margin: '0 0 0.75rem', lineHeight: 1.65, fontSize: '0.95rem' }}>
          {gaps.length > 0
            ? `Es bestehen ${gaps.length} Compliance-Lücken, davon ${gaps.filter(g => g.prio === 'hoch').length} mit hoher Priorität.`
            : 'Es wurden keine wesentlichen Compliance-Lücken identifiziert.'}
          {' '}Der EU AI Act ist für Sie teilweise bereits in Kraft (Verbote seit Feb. 2025, Hochrisiko-Anforderungen ab Aug. 2026).
        </p>
        <p style={{ margin: 0, lineHeight: 1.65, fontSize: '0.95rem' }}>
          <strong>Empfehlung:</strong> Handlungsbedarf ist <strong style={{ color: actionColors[actionNeed] }}>{actionNeed}</strong>.
          {actionNeed === 'hoch' && ' Wir empfehlen dringend ein strukturiertes EU AI Act Compliance Projekt.'}
          {actionNeed === 'mittel' && ' Ein begleitetes Compliance-Projekt ist empfehlenswert.'}
          {actionNeed === 'gering' && ' Regelmäßige Überprüfung und Weiterentwicklung des bestehenden Frameworks ist sinnvoll.'}
        </p>
      </div>

      {/* Area Scores */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem', color: C.red, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Reifegrad je Bereich
        </h3>
        <ScoreBar label="Dokumentation & Inventar" value={areas.dokumentation} />
        <ScoreBar label="Daten-Governance"          value={areas.daten} />
        <ScoreBar label="Monitoring"                value={areas.monitoring} />
        <ScoreBar label="Human Oversight"           value={areas.oversight} />
        <ScoreBar label="Governance & Compliance"   value={areas.governance} />
        <ScoreBar label="Transparenz"               value={areas.transparenz} />
        <ScoreBar label="Lieferkette / Drittanbieter" value={areas.lieferkette} />
        <ScoreBar label="AI Literacy"               value={areas.aiLiteracy} />
      </div>

      {/* Use Cases */}
      {useCases.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: C.red, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
            Identifizierte KI-Use-Cases
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.5rem' }}>
            {useCases.map((uc, i) => (
              <div key={i} style={{
                background: C.white, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: '0.65rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem',
              }}>
                <span style={{
                  background: '#fff1f2', color: C.red,
                  fontSize: '0.72rem', fontWeight: 700,
                  padding: '0.1rem 0.4rem', borderRadius: 4, flexShrink: 0,
                }}>
                  {uc.domain}
                </span>
                <span style={{ color: C.black }}>{uc.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Gaps */}
      {gaps.length > 0 && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', color: C.red, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Alle Compliance-Risiken ({gaps.length})
          </h3>
          {gaps.sort((a, b) => ({ hoch: 0, mittel: 1, niedrig: 2 }[a.prio] - { hoch: 0, mittel: 1, niedrig: 2 }[b.prio])).map((gap, i) => (
            <div key={gap.id} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem 0',
              borderBottom: i < gaps.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: C.red, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
              }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.15rem' }}>{gap.label}</div>
                <div style={{ fontSize: '0.8rem', color: C.gray }}>{gap.area}</div>
              </div>
              <PrioBadge prio={gap.prio} />
            </div>
          ))}
        </div>
      )}

      {/* Measures */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.3rem' }}>Ihr EU AI Act Maßnahmenplan</h2>
            <p style={{ margin: 0, color: C.gray, fontSize: '0.9rem' }}>
              {allMeasures.length} priorisierte Maßnahmen
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {(['kurzfristig', 'mittelfristig', 'strategisch']).map(h => {
            const hm = HORIZON_META[h];
            const count = byHorizon(h).length;
            return (
              <div key={h} style={{
                background: C.lightGray, border: `2px solid ${hm.color}`,
                borderRadius: 10, padding: '1rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{hm.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: hm.color }}>{count}</div>
                <div style={{ fontSize: '0.8rem', color: C.gray, fontWeight: 600 }}>{hm.label}</div>
              </div>
            );
          })}
        </div>

        <MeasureSection horizon="kurzfristig"   measures={byHorizon('kurzfristig')} />
        <MeasureSection horizon="mittelfristig"  measures={byHorizon('mittelfristig')} />
        <MeasureSection horizon="strategisch"    measures={byHorizon('strategisch')} />
      </div>

      {/* Bottom CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1e1e, #2b2b2b)',
        color: '#fff', borderRadius: 12, padding: '2rem',
        textAlign: 'center', marginBottom: '1.5rem',
      }} className="no-print">
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem' }}>Brauchen Sie Unterstützung bei der Umsetzung?</h3>
        <p style={{ margin: '0 0 1.25rem', opacity: 0.8, fontSize: '0.92rem', lineHeight: 1.55 }}>
          elpix begleitet Unternehmen auf dem Weg zur EU AI Act Compliance – von der ersten Bestandsaufnahme
          bis zur vollständigen Implementierung. Sprechen Sie mit unseren Experten.
        </p>
        <a
          href="https://elpix.ag"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary btn-large"
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          Beratungsgespräch anfragen →
        </a>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }} className="no-print">
        <button className="btn btn-secondary" onClick={onRestart}>↺ Neu starten</button>
      </div>
    </div>
  );
}
