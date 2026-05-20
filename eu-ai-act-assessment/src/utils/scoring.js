import { questions } from '../data/questions';

// ── Risk classification ────────────────────────────────────────────────────

export function classifyRisk(answers) {
  // Prohibited check
  if (answers.prohibited_ai === 'yes') return 'prohibited';

  // Count high-risk domains
  const highRiskDomains = answers.high_risk_domains || [];
  const hasHighRisk =
    highRiskDomains.length > 0 &&
    !highRiskDomains.includes('none_high');

  // HR / employment AI
  const internalAI = answers.ai_internal || [];
  const hasHRHighRisk =
    internalAI.includes('hr_recruiting') || internalAI.includes('hr_performance');

  // Finance / credit
  const customerAI = answers.ai_customer || [];
  const hasFinanceHighRisk =
    customerAI.includes('credit_scoring') || answers.ai_internal?.includes('finance_risk');

  // Medical / autonomous / critical infra
  const opAI = answers.ai_operational || [];
  const hasOpHighRisk =
    opAI.includes('critical_infra') || opAI.includes('autonomous') || opAI.includes('medical_device');

  if (hasHighRisk || hasHRHighRisk || hasFinanceHighRisk || hasOpHighRisk) return 'high';

  // Limited risk
  const limitedRisk = answers.limited_risk || [];
  const hasLimited = limitedRisk.length > 0 && !limitedRisk.includes('none_limited');
  const hasLimitedCustomer =
    customerAI.includes('chatbot') || customerAI.includes('synthetic_media');

  if (hasLimited || hasLimitedCustomer) return 'limited';

  // No AI usage
  if (answers.ai_usage === 'no') return 'minimal_no_ai';

  return 'minimal';
}

// ── Maturity score (0–100) ─────────────────────────────────────────────────

const MATURITY_QUESTIONS = [
  'documentation',
  'data_quality',
  'monitoring',
  'human_oversight',
  'governance',
  'transparency',
  'ai_inventory_exists',
  'risk_assessment',
  'compliance_team',
  'supplier_risk',
  'ai_literacy',
];

export function calcMaturityScore(answers) {
  let total = 0;
  let max = 0;
  MATURITY_QUESTIONS.forEach((qId) => {
    const q = questions.find((x) => x.id === qId);
    if (!q) return;
    const maxScore = Math.max(...q.options.map((o) => o.score ?? 0));
    max += maxScore;
    const val = answers[qId];
    const opt = q.options.find((o) => o.value === val);
    total += opt?.score ?? 0;
  });
  return max > 0 ? Math.round((total / max) * 100) : 0;
}

// ── Per-area scores (0–3 each) ─────────────────────────────────────────────

export function calcAreaScores(answers) {
  const area = (ids) => {
    let s = 0, mx = 0;
    ids.forEach((id) => {
      const q = questions.find((x) => x.id === id);
      if (!q) return;
      const maxScore = Math.max(...q.options.map((o) => o.score ?? 0));
      mx += maxScore;
      const opt = q.options.find((o) => o.value === answers[id]);
      s += opt?.score ?? 0;
    });
    return mx > 0 ? Math.round((s / mx) * 100) : 0;
  };

  return {
    dokumentation: area(['documentation', 'ai_inventory_exists']),
    daten: area(['data_quality']),
    monitoring: area(['monitoring']),
    oversight: area(['human_oversight']),
    governance: area(['governance', 'compliance_team', 'risk_assessment']),
    transparenz: area(['transparency']),
    lieferkette: area(['supplier_risk']),
    aiLiteracy: area(['ai_literacy']),
  };
}

// ── Gaps (list of gap objects) ─────────────────────────────────────────────

export function identifyGaps(answers, riskLevel) {
  const gaps = [];

  const score = (id) => {
    const q = questions.find((x) => x.id === id);
    const opt = q?.options.find((o) => o.value === answers[id]);
    return opt?.score ?? 0;
  };

  if (score('documentation') < 2)
    gaps.push({ id: 'doc', label: 'Fehlende technische Dokumentation', prio: riskLevel === 'high' ? 'hoch' : 'mittel', area: 'Dokumentation' });

  if (score('data_quality') < 2)
    gaps.push({ id: 'data', label: 'Unzureichende Daten-Governance', prio: 'hoch', area: 'Daten' });

  if (score('monitoring') < 2)
    gaps.push({ id: 'mon', label: 'Kein systematisches KI-Monitoring', prio: riskLevel === 'high' ? 'hoch' : 'mittel', area: 'Monitoring' });

  if (score('human_oversight') < 2)
    gaps.push({ id: 'hov', label: 'Human Oversight nicht ausreichend definiert', prio: 'hoch', area: 'Oversight' });

  if (score('governance') < 2)
    gaps.push({ id: 'gov', label: 'Fehlende KI-Governance-Strukturen', prio: 'hoch', area: 'Governance' });

  if (score('transparency') < 2)
    gaps.push({ id: 'trans', label: 'Unzureichende Transparenz gegenüber Nutzern', prio: 'mittel', area: 'Transparenz' });

  if (score('ai_inventory_exists') < 2)
    gaps.push({ id: 'inv', label: 'Kein vollständiges KI-Inventar', prio: 'hoch', area: 'Inventar' });

  if (score('risk_assessment') < 2)
    gaps.push({ id: 'risk', label: 'Fehlende systematische Risikobewertung', prio: 'hoch', area: 'Risiko' });

  if (score('compliance_team') < 2)
    gaps.push({ id: 'team', label: 'Keine klaren Compliance-Verantwortlichkeiten', prio: 'mittel', area: 'Organisation' });

  if (score('supplier_risk') < 2)
    gaps.push({ id: 'sup', label: 'KI-Drittanbieterrisiken nicht gemanagt', prio: 'mittel', area: 'Lieferkette' });

  if (score('ai_literacy') < 2)
    gaps.push({ id: 'lit', label: 'AI Literacy der Mitarbeitenden zu gering', prio: 'niedrig', area: 'Schulung' });

  if (answers.prohibited_ai === 'unsure')
    gaps.push({ id: 'proh', label: 'Mögliche verbotene KI-Praktiken – Klärungsbedarf!', prio: 'hoch', area: 'Verbote' });

  return gaps;
}

// ── Risk label helpers ─────────────────────────────────────────────────────

export const RISK_META = {
  prohibited: {
    label: 'Verbotenes Risiko',
    color: '#7f0000',
    bg: '#fff0f0',
    badge: 'VERBOTEN',
    summary: 'Ihr Unternehmen setzt möglicherweise KI-Systeme ein, die nach Art. 5 EU AI Act verboten sind. Sofortiger Handlungsbedarf.',
  },
  high: {
    label: 'Hohes Risiko',
    color: '#b30000',
    bg: '#fff3f3',
    badge: 'HIGH RISK',
    summary: 'Sie setzen Hochrisiko-KI-Systeme (Anhang III) ein. Umfangreiche Compliance-Pflichten gelten ab August 2026.',
  },
  limited: {
    label: 'Begrenztes Risiko',
    color: '#e67e22',
    bg: '#fff8f0',
    badge: 'LIMITED RISK',
    summary: 'Ihre KI-Systeme unterliegen Transparenzpflichten (Art. 50). Nutzer müssen informiert werden, dass sie mit KI interagieren.',
  },
  minimal: {
    label: 'Minimales Risiko',
    color: '#27ae60',
    bg: '#f0fff4',
    badge: 'MINIMAL RISK',
    summary: 'Ihre KI-Systeme haben minimales Risiko. Freiwillige Verhaltenskodizes und DSGVO-Compliance sind dennoch empfehlenswert.',
  },
  minimal_no_ai: {
    label: 'Kein KI-Einsatz',
    color: '#7f8c8d',
    bg: '#f4f4f4',
    badge: 'KEIN KI-EINSATZ',
    summary: 'Sie setzen aktuell keine KI ein. Dennoch sollten Sie die Entwicklung im Blick behalten und sich frühzeitig vorbereiten.',
  },
};

export function getMaturityRating(score) {
  if (score >= 80) return { label: 'Gut aufgestellt', cls: 'rating-good' };
  if (score >= 55) return { label: 'In Entwicklung', cls: 'rating-medium' };
  if (score >= 30) return { label: 'Grundlagen fehlen', cls: 'rating-critical' };
  return { label: 'Kritisch', cls: 'rating-critical' };
}

export function getActionNeed(riskLevel, maturityScore) {
  if (riskLevel === 'prohibited') return 'hoch';
  if (riskLevel === 'high' && maturityScore < 50) return 'hoch';
  if (riskLevel === 'high' && maturityScore < 75) return 'mittel';
  if (riskLevel === 'limited' && maturityScore < 40) return 'mittel';
  if (riskLevel === 'minimal_no_ai') return 'gering';
  if (maturityScore >= 75) return 'gering';
  return 'mittel';
}
