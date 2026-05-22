import React from 'react';

const C = {
  red: '#e30613', redDark: '#b9000d',
  black: '#1f1f1f', dark: '#2b2b2b', gray: '#6f6f6f',
  lightGray: '#f4f4f4', border: '#e2e2e2', white: '#ffffff',
};

const ASSESSMENTS = [
  {
    id: 'eu-ai-act',
    badge: 'EU AI Act',
    title: 'EU AI Act Readiness Assessment',
    description: 'Analysieren Sie Ihre KI-Systeme, bewerten Sie Ihre Risiken und erfahren Sie, welche Pflichten der EU AI Act für Ihr Unternehmen bedeutet.',
    duration: '~10 Min.',
    tags: ['Risikoeinstufung', 'Gap-Analyse', 'Maßnahmenplan'],
    href: 'http://localhost:5173',
    available: true,
  },
  {
    id: 'nis2',
    badge: 'NIS-2',
    title: 'NIS-2 Readiness Assessment',
    description: 'Prüfen Sie Ihre Cybersicherheits-Reife gemäß NIS-2-Richtlinie und erhalten Sie einen priorisierten Maßnahmenkatalog für Ihr Unternehmen.',
    duration: '~10 Min.',
    tags: ['Einstufung', 'Reifegrad-Score', 'Maßnahmenkatalog'],
    href: null, // internal navigation
    available: true,
  },
  {
    id: 'dora',
    badge: 'DORA',
    title: 'DORA Readiness Assessment',
    description: 'Digital Operational Resilience Act – Prüfen Sie Ihre operative Resilienz im Finanzsektor.',
    duration: 'Demnächst',
    tags: ['ICT-Risiko', 'Incident Reporting', 'Drittanbieter'],
    href: null,
    available: false,
  },
];

export default function AssessmentSelector({ onSelectNis2 }) {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-block',
          background: C.black, color: C.white,
          fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1.5px',
          padding: '0.3rem 1rem', borderRadius: 999, marginBottom: '1.25rem',
          textTransform: 'uppercase',
        }}>
          elpix · Compliance Assessments
        </div>
        <h1 style={{ margin: '0 0 0.75rem', fontSize: '2rem', fontWeight: 800, color: C.black, lineHeight: 1.25 }}>
          Welches Assessment möchten<br />Sie durchführen?
        </h1>
        <p style={{ margin: 0, color: C.gray, fontSize: '1rem', lineHeight: 1.65, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          Wählen Sie das passende Compliance-Assessment für Ihr Unternehmen.
          Alle Auswertungen sind kostenlos und dauern ca. 10 Minuten.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ASSESSMENTS.map((a) => {
          const isAvailable = a.available;
          const handleClick = () => {
            if (!isAvailable) return;
            if (a.href) window.location.href = a.href;
            else onSelectNis2();
          };

          return (
            <div
              key={a.id}
              onClick={handleClick}
              style={{
                background: C.white,
                border: `1.5px solid ${isAvailable ? C.border : '#ebebeb'}`,
                borderRadius: 14,
                padding: '1.5rem 1.75rem',
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                cursor: isAvailable ? 'pointer' : 'default',
                opacity: isAvailable ? 1 : 0.55,
                transition: 'border-color 0.15s, box-shadow 0.15s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => { if (isAvailable) { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.boxShadow = '0 4px 16px rgba(227,6,19,0.1)'; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isAvailable ? C.border : '#ebebeb'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; }}
            >
              {/* Badge */}
              <div style={{
                flexShrink: 0,
                width: 72, height: 72, borderRadius: 14,
                background: isAvailable ? `linear-gradient(135deg, ${C.red}, ${C.redDark})` : C.lightGray,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  color: isAvailable ? C.white : C.gray,
                  fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.5px',
                  textAlign: 'center', lineHeight: 1.3,
                }}>
                  {a.badge}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: C.black }}>
                    {a.title}
                  </h2>
                  {!isAvailable && (
                    <span style={{
                      background: C.lightGray, color: C.gray,
                      fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.55rem',
                      borderRadius: 999, letterSpacing: '0.3px',
                    }}>
                      DEMNÄCHST
                    </span>
                  )}
                </div>
                <p style={{ margin: '0 0 0.65rem', color: C.gray, fontSize: '0.87rem', lineHeight: 1.6 }}>
                  {a.description}
                </p>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{
                    background: C.lightGray, color: C.gray,
                    fontSize: '0.72rem', fontWeight: 600, padding: '0.18rem 0.6rem', borderRadius: 6,
                  }}>
                    ⏱ {a.duration}
                  </span>
                  {a.tags.map(t => (
                    <span key={t} style={{
                      background: '#fff1f2', color: C.red,
                      border: `1px solid #fecdd3`,
                      fontSize: '0.72rem', fontWeight: 600, padding: '0.18rem 0.6rem', borderRadius: 6,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              {isAvailable && (
                <div style={{
                  flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
                  background: C.lightGray, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.gray, fontSize: '1rem', fontWeight: 700,
                }}>
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ textAlign: 'center', color: C.gray, fontSize: '0.78rem', marginTop: '1.75rem' }}>
        Alle Assessments sind kostenlos · Ihre Daten bleiben vertraulich · Keine Registrierung erforderlich
      </p>
    </div>
  );
}
