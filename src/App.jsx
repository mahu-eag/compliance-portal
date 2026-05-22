import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import Question      from './components/Question';
import ProgressBar   from './components/ProgressBar';
import Navigation    from './components/Navigation';
import ResultView    from './components/ResultView';
import FullResultsPage from './components/FullResultsPage';
import LeadCapture   from './components/LeadCapture';
import StartPage     from './components/StartPage';
import { sendResultEmails, isEmailConfigured } from './services/emailService';
import './App.css';

const STORAGE_KEY = 'nis2-assessment-state';

// ── Flow states ───────────────────────────────────────────────────────────
// SELECTOR → START → QUIZ → SCORE → LEAD → RESULTS

export default function App() {
  const [currentIndex,    setCurrentIndex]    = useState(0);
  const [answers,         setAnswers]         = useState({});
  const [view,            setView]            = useState('start'); // 'start' | 'quiz' | 'score' | 'lead' | 'results'
  const [contactData,     setContactData]     = useState(null);

  // ── Persistence: Load ─────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        setCurrentIndex(data.currentIndex || 0);
        const hasAnswers = data.answers && Object.keys(data.answers).length > 0;
        if (data.contactData) {
          setContactData(data.contactData);
          if (data.view === 'results') setView('results');
          else if (hasAnswers && (data.view === 'quiz' || data.view === 'score')) setView(data.view);
        } else if (hasAnswers && (data.view === 'quiz' || data.view === 'score')) {
          setView(data.view);
        }
      } catch (e) { console.error('Fehler beim Laden:', e); }
    }
  }, []);

  // ── Persistence: Save ─────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentIndex, contactData, view }));
  }, [answers, currentIndex, contactData, view]);

  // ── Quiz controls ─────────────────────────────────────────────────────
  const handleAnswerChange = (questionId, value) =>
    setAnswers(prev => ({ ...prev, [questionId]: value }));

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Start page → quiz
  const handleStartQuiz = () => setView('quiz');

  // Quiz complete → show score summary
  const handleFinish = () => setView('score');

  // Score summary CTA → show lead form
  const handleRequestFullResults = () => setView('lead');

  // Back from lead form to score summary
  const handleBackToScore = () => setView('score');

  // Lead form submitted → compute, send emails, show full results
  const handleLeadSubmit = async (data) => {
    setContactData(data);
    setView('results');

    // Score computation
    const scoredQs   = questions.filter(q => q.options.some(o => o.score !== undefined));
    const maxScore   = scoredQs.reduce((s, q) => s + Math.max(...q.options.map(o => o.score || 0)), 0);
    const achieved   = scoredQs.reduce((s, q) => {
      const opt = q.options.find(o => o.value === answers[q.id]);
      return s + (opt?.score || 0);
    }, 0);
    const percentage = maxScore > 0 ? Math.round((achieved / maxScore) * 100) : 0;

    // NIS-2 classification
    const industryOpt  = questions.find(q => q.id === 'industry')?.options.find(o => o.value === answers['industry']);
    const employeeOpt  = questions.find(q => q.id === 'employees')?.options.find(o => o.value === answers['employees']);
    const revenueOpt   = questions.find(q => q.id === 'revenue')?.options.find(o => o.value === answers['revenue']);
    const isLargeMed   = employeeOpt?.size === 'large' || employeeOpt?.size === 'medium' ||
                         revenueOpt?.size  === 'large' || revenueOpt?.size  === 'medium';

    let nis2Status = 'Nicht betroffen';
    if (industryOpt?.criticality === 'essential' && isLargeMed)      nis2Status = 'Wesentliche Einrichtung (Essential Entity)';
    else if (industryOpt?.criticality === 'important' && isLargeMed) nis2Status = 'Wichtige Einrichtung (Important Entity)';
    else if (industryOpt?.criticality && industryOpt.criticality !== 'none') nis2Status = 'Vermutlich nicht betroffen (Größenkriterium nicht erfüllt)';

    // Send emails asynchronously
    if (await isEmailConfigured()) {
      const { getRelevantMeasures }    = await import('./data/measures');
      const { generateExecutiveSummary } = await import('./utils/executiveSummary');
      const relevantMeasures = getRelevantMeasures(questions, answers);
      const scoreData        = { percentage, achievedScore: achieved, maxScore, nis2Status };
      const summary          = generateExecutiveSummary(questions, answers, relevantMeasures, scoreData);
      sendResultEmails(data, questions, answers, relevantMeasures, scoreData, summary).catch(console.error);
    }
  };

  const handleRestart = () => {
    if (window.confirm('Möchten Sie wirklich neu starten? Alle Antworten gehen verloren.')) {
      setAnswers({});
      setCurrentIndex(0);
      setView('start');
      setContactData(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // ── Shared page chrome ────────────────────────────────────────────────
  const PageShell = ({ children, fullWidth = false }) => (
    <div className="page-shell">
      <div className="site-topbar" />
      <header className="site-header">
        <div className="site-header-inner">
          <a href="https://elpix.ag" target="_blank" rel="noreferrer" className="site-logo-link">
            <img src={`${import.meta.env.BASE_URL}Logo.png`} alt="elpix AG" className="site-logo" />
          </a>
          <div className="site-header-divider" />
          <div className="site-header-title">
            <span className="site-header-badge">NIS-2</span>
            <span className="site-header-label">Readiness Assessment</span>
          </div>
        </div>
      </header>
      <main className={fullWidth ? '' : 'page-content'}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>© {new Date().getFullYear()} elpix AG · Alle Rechte vorbehalten</span>
          <a
            href="https://elpix.ag/impressum"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--elpix-gray)', textDecoration: 'none', fontSize: '0.8rem' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            Impressum
          </a>
          <span className="site-footer-note">
            Dieses Assessment dient als erste Orientierung und ersetzt keine rechtverbindliche Prüfung.
          </span>
        </div>
      </footer>
    </div>
  );

  // ── Views ─────────────────────────────────────────────────────────────

  if (view === 'start') return (
    <PageShell>
      <StartPage onStart={handleStartQuiz} onBack={() => window.location.href = '/'} />
    </PageShell>
  );

  if (view === 'results') return (
    <PageShell>
      <FullResultsPage
        questions={questions}
        answers={answers}
        contactData={contactData}
        onRestart={handleRestart}
      />
    </PageShell>
  );

  if (view === 'lead') return (
    <PageShell fullWidth>
      <LeadCapture
        onSubmit={handleLeadSubmit}
        onBack={handleBackToScore}
      />
    </PageShell>
  );

  if (view === 'score') return (
    <PageShell>
      <ResultView
        questions={questions}
        answers={answers}
        onRequestFullResults={handleRequestFullResults}
      />
    </PageShell>
  );

  // ── Quiz ──────────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex];
  const currentAnswer   = answers[currentQuestion.id];
  const canGoNext       = currentAnswer !== undefined;
  const isLast          = currentIndex === questions.length - 1;

  return (
    <PageShell>
      <div className="app-container">
        <div className="app-intro">
          <p>Bewerten Sie Ihre Cybersicherheits-Reife gemäß NIS-2-Richtlinie</p>
        </div>
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        <Question question={currentQuestion} value={currentAnswer} onChange={handleAnswerChange} />
        <Navigation
          onPrev={handlePrev} onNext={handleNext} onFinish={handleFinish}
          canGoPrev={currentIndex > 0} canGoNext={canGoNext} isLast={isLast}
        />
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'none', border: 'none', color: 'var(--elpix-gray)',
              fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline',
              padding: '0.25rem 0.5rem',
            }}
          >
            ← Zurück zur Übersicht
          </button>
        </div>
      </div>
    </PageShell>
  );
}
