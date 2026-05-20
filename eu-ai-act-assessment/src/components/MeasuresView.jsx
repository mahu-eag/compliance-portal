import React from 'react';
import { classifyRisk, identifyGaps } from '../utils/scoring';
import { getMeasuresForAssessment } from '../data/measures';

const HORIZON_META = {
  kurzfristig:  { label: '0–3 Monate',    color: 'var(--elpix-red)',  icon: '🚨' },
  mittelfristig: { label: '3–12 Monate',  color: '#e67e22',           icon: '📋' },
  strategisch:  { label: '> 12 Monate',   color: '#27ae60',           icon: '🏗️' },
};

const EFFORT_COLOR = { Niedrig: '#27ae60', Mittel: '#e67e22', Hoch: '#e30613' };

function MeasureCard({ m }) {
  const hm = HORIZON_META[m.horizon] || {};
  return (
    <div style={{
      background: 'var(--elpix-white)',
      border: '1px solid var(--elpix-border)',
      borderLeft: `4px solid ${hm.color}`,
      borderRadius: '0 8px 8px 0',
      padding: '1rem 1.25rem',
      marginBottom: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.4rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--elpix-black)' }}>
          {m.title}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
          <span style={{
            background: EFFORT_COLOR[m.effort] || '#999',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.15rem 0.5rem',
            borderRadius: 999,
          }}>
            Aufwand: {m.effort}
          </span>
        </div>
      </div>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.88rem', color: 'var(--elpix-gray)', lineHeight: 1.55 }}>
        {m.description}
      </p>
      <div style={{ fontSize: '0.8rem', color: 'var(--elpix-gray)' }}>
        <strong>Verantwortlich:</strong> {m.owner}
      </div>
    </div>
  );
}

export default function MeasuresView({ answers, onRestart, onBack }) {
  const riskLevel = classifyRisk(answers);
  const gaps = identifyGaps(answers, riskLevel);
  const allMeasures = getMeasuresForAssessment(riskLevel, gaps);

  const byHorizon = (h) => allMeasures.filter((m) => m.horizon === h);
  const kurzfristig = byHorizon('kurzfristig');
  const mittelfristig = byHorizon('mittelfristig');
  const strategisch = byHorizon('strategisch');

  const handlePrint = () => window.print();

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'var(--elpix-white)',
        border: '1px solid var(--elpix-border)',
        borderRadius: 12,
        padding: '2rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.5rem' }}>Ihr EU AI Act Maßnahmenplan</h1>
            <p style={{ margin: 0, color: 'var(--elpix-gray)', fontSize: '0.9rem' }}>
              {allMeasures.length} priorisierte Maßnahmen · erstellt am {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
            <button className="btn btn-secondary" onClick={onBack}>← Zurück zur Auswertung</button>
            <button className="btn btn-export btn-large" onClick={handlePrint}>⬇ Als PDF speichern</button>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginTop: '1.5rem',
        }}>
          {[
            { h: 'kurzfristig',   count: kurzfristig.length,   ...HORIZON_META.kurzfristig },
            { h: 'mittelfristig', count: mittelfristig.length,  ...HORIZON_META.mittelfristig },
            { h: 'strategisch',   count: strategisch.length,    ...HORIZON_META.strategisch },
          ].map((row) => (
            <div key={row.h} style={{
              background: 'var(--elpix-light-gray)',
              border: `2px solid ${row.color}`,
              borderRadius: 10,
              padding: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>{row.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: row.color }}>{row.count}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--elpix-gray)', fontWeight: 600 }}>
                {row.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kurzfristig */}
      {kurzfristig.length > 0 && (
        <div className="measure-block" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid var(--elpix-red)',
          }}>
            <span style={{ fontSize: '1.4rem' }}>🚨</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--elpix-red)' }}>Sofortmaßnahmen (0–3 Monate)</h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--elpix-gray)' }}>
                Diese Maßnahmen sollten umgehend gestartet werden
              </p>
            </div>
          </div>
          {kurzfristig.map((m) => <MeasureCard key={m.id} m={m} />)}
        </div>
      )}

      {/* Mittelfristig */}
      {mittelfristig.length > 0 && (
        <div className="measure-block" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e67e22',
          }}>
            <span style={{ fontSize: '1.4rem' }}>📋</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#e67e22' }}>Mittelfristige Maßnahmen (3–12 Monate)</h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--elpix-gray)' }}>
                Strukturierter Aufbau von Compliance-Strukturen
              </p>
            </div>
          </div>
          {mittelfristig.map((m) => <MeasureCard key={m.id} m={m} />)}
        </div>
      )}

      {/* Strategisch */}
      {strategisch.length > 0 && (
        <div className="measure-block" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #27ae60',
          }}>
            <span style={{ fontSize: '1.4rem' }}>🏗️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#27ae60' }}>Strategische Maßnahmen (&gt; 12 Monate)</h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--elpix-gray)' }}>
                Langfristiger Aufbau eines AI Governance Frameworks
              </p>
            </div>
          </div>
          {strategisch.map((m) => <MeasureCard key={m.id} m={m} />)}
        </div>
      )}

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1e1e, #2b2b2b)',
        color: '#fff',
        borderRadius: 12,
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
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

      <div style={{ textAlign: 'center' }} className="no-print">
        <button className="btn btn-secondary" onClick={onRestart}>↺ Neu starten</button>
      </div>
    </div>
  );
}
