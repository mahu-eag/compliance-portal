import React, { useState, useEffect, useRef } from 'react';
import { questions } from './data/questions';
import Question from './components/Question';
import ProgressBar from './components/ProgressBar';
import Navigation from './components/Navigation';
import ResultView from './components/ResultView';
import LeadCapture from './components/LeadCapture';
import FullResultsPage from './components/FullResultsPage';
import { sendResultEmails, isEmailConfigured } from './services/emailService';
import {
  classifyRisk,
  calcMaturityScore,
  identifyGaps,
  getMaturityRating,
  getActionNeed,
  RISK_META,
} from './utils/scoring';
import { getMeasuresForAssessment } from './data/measures';
import './elpix.css';
import './App.css';

const STORAGE_KEY = 'eu-ai-act-assessment-state';

function WelcomeScreen({ onStart }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{
        background: 'var(--elpix-white)',
        borderRadius: 16,
        padding: '3rem 2.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        border: '1px solid var(--elpix-border)',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'var(--elpix-red)',
          color: '#fff',
          fontWeight: 800,
          fontSize: '0.8rem',
          letterSpacing: '1.5px',
          padding: '0.3rem 1rem',
          borderRadius: 999,
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
        }}>
          EU AI Act · Readiness Assessment
        </div>
        <h1 style={{ fontSize: '2rem', margin: '0 0 1rem', lineHeight: 1.3 }}>
          Wie gut ist Ihr Unternehmen<br />auf den EU AI Act vorbereitet?
        </h1>
        <p style={{ color: 'var(--elpix-gray)', lineHeight: 1.7, margin: '0 0 2rem', fontSize: '1rem' }}>
          Der EU AI Act ist in Kraft – und die ersten Pflichten gelten bereits ab Februar 2025.
          Dieses Assessment analysiert Ihre KI-Systeme, bewertet Ihre Risiken und zeigt Ihnen,
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
              background: 'var(--elpix-light-gray)',
              borderRadius: 10,
              padding: '1rem',
              border: '1px solid var(--elpix-border)',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--elpix-gray)' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--elpix-red-soft)',
          border: '1px solid #ffd6d8',
          borderRadius: 10,
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          textAlign: 'left',
          fontSize: '0.88rem',
          lineHeight: 1.55,
        }}>
          <strong style={{ color: 'var(--elpix-red)' }}>Was Sie erhalten:</strong>
          {' '}Risikoeinstufung nach EU AI Act · Reifegrad-Score · Gap-Analyse · Priorisierter Maßnahmenplan
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={onStart}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          Assessment starten →
        </button>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: 'var(--elpix-gray)' }}>
          Ihre Antworten werden nur lokal in Ihrem Browser gespeichert.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const loadSaved = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  };

  const [screen, setScreen] = useState(() => {
    const d = loadSaved();
    if (d.screen === 'results' && d.contactData) return 'results';
    if (d.screen && d.screen !== 'welcome') return d.screen;
    return 'welcome';
  });
  const [currentIndex, setCurrentIndex] = useState(() => loadSaved().currentIndex ?? 0);
  const [answers, setAnswers] = useState(() => loadSaved().answers || {});
  const [contactData, setContactData] = useState(() => loadSaved().contactData || null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentIndex, screen, contactData }));
  }, [answers, currentIndex, screen, contactData]);

  const currentQuestion = questions[currentIndex];
  const currentPhase = currentQuestion?.phase ?? 1;

  const handleAnswerChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const currentAnswer = answers[currentQuestion?.id];
  const hasAnswer = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === 'multi') {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };
  const handleFinish = () => setScreen('score');

  const handleRestart = () => {
    if (window.confirm('Möchten Sie wirklich neu starten? Alle Antworten gehen verloren.')) {
      setAnswers({});
      setCurrentIndex(0);
      setContactData(null);
      setScreen('welcome');
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleRequestFullResults = () => setScreen('lead');
  const handleBackToScore = () => setScreen('score');

  const handleLeadSubmit = async (data) => {
    setContactData(data);
    setScreen('results');

    const riskLevel  = classifyRisk(answers);
    const maturity   = calcMaturityScore(answers);
    const gaps       = identifyGaps(answers, riskLevel);
    const rating     = getMaturityRating(maturity);
    const actionNeed = getActionNeed(riskLevel, maturity);
    const riskMeta   = RISK_META[riskLevel] || RISK_META.minimal;
    const allMeasures = getMeasuresForAssessment(riskLevel, gaps);

    const scoreData = { riskLevel, riskMeta, maturity, rating, actionNeed, gaps, allMeasures };

    const summary = `Ihr Unternehmen weist eine Risikoeinstufung „${riskMeta.label}" unter dem EU AI Act auf. ` +
      `Der Gesamtreifegrad liegt bei ${maturity}% (${rating.label}). ` +
      (gaps.length > 0
        ? `Es bestehen ${gaps.length} Compliance-Lücken, davon ${gaps.filter(g => g.prio === 'hoch').length} mit hoher Priorität.`
        : 'Es wurden keine wesentlichen Compliance-Lücken identifiziert.');

    if (await isEmailConfigured()) {
      sendResultEmails(data, answers, scoreData, summary).catch(console.error);
    }
  };

  // ── Page Shell ─────────────────────────────────────────────────────────────
  const PageShell = ({ children }) => (
    <div className="page-shell">
      <div className="site-topbar" />
      <header className="site-header">
        <div className="site-header-inner">
          <a href="https://elpix.ag" target="_blank" rel="noreferrer" className="site-logo-link">
            <img src={`${import.meta.env.BASE_URL}Logo.png`} alt="elpix AG" className="site-logo" />
          </a>
          <div className="site-header-divider" />
          <div className="site-header-title">
            <span className="site-header-badge">EU AI Act</span>
            <span className="site-header-label">Readiness Assessment</span>
          </div>
        </div>
      </header>
      <main className="page-content">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>© {new Date().getFullYear()} elpix AG · Alle Rechte vorbehalten</span>
          <span className="site-footer-note">
            Dieses Assessment dient als erste Orientierung und ersetzt keine rechtverbindliche Prüfung.
          </span>
        </div>
      </footer>
    </div>
  );

  // ── Screens ────────────────────────────────────────────────────────────────
  if (screen === 'results') {
    return (
      <PageShell>
        <FullResultsPage
          answers={answers}
          contactData={contactData}
          onRestart={handleRestart}
        />
      </PageShell>
    );
  }

  if (screen === 'lead') {
    return (
      <PageShell>
        <LeadCapture onSubmit={handleLeadSubmit} onBack={handleBackToScore} />
      </PageShell>
    );
  }

  if (screen === 'score') {
    return (
      <PageShell>
        <ResultView answers={answers} onRequestFullResults={handleRequestFullResults} />
      </PageShell>
    );
  }

  if (screen === 'welcome') {
    return (
      <PageShell>
        <WelcomeScreen onStart={() => setScreen('quiz')} />
      </PageShell>
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="app-container">
        <ProgressBar
          currentIndex={currentIndex}
          total={questions.length}
          currentPhase={currentPhase}
        />
        <Question
          question={currentQuestion}
          answer={answers[currentQuestion?.id]}
          onChange={handleAnswerChange}
        />
        <Navigation
          onPrev={handlePrev}
          onNext={handleNext}
          onFinish={handleFinish}
          isFirst={currentIndex === 0}
          isLast={currentIndex === questions.length - 1}
          canNext={hasAnswer()}
        />
        <p style={{
          textAlign: 'center',
          color: 'var(--elpix-gray)',
          fontSize: '0.82rem',
          margin: 0,
        }}>
          Frage {currentIndex + 1} von {questions.length}
        </p>
      </div>
    </PageShell>
  );
}
