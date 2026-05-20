// EU AI Act – Maßnahmenkatalog (nach Priorität und Zeitraum)

export const measures = [
  // ── KURZFRISTIG (0–3 Monate) ──────────────────────────────────────────────
  {
    id: 'm1',
    horizon: 'kurzfristig',
    prio: 'hoch',
    title: 'KI-Inventar erstellen',
    description:
      'Erstellen Sie eine vollständige Liste aller eingesetzten und geplanten KI-Systeme. Erfassen Sie: Name, Anbieter, Zweck, betroffene Personen, Risikoeinstufung.',
    effort: 'Mittel',
    owner: 'IT / Datenschutz',
    gapIds: ['inv'],
    riskLevels: ['prohibited', 'high', 'limited', 'minimal'],
  },
  {
    id: 'm2',
    horizon: 'kurzfristig',
    prio: 'hoch',
    title: 'Erste Risikobewertung durchführen',
    description:
      'Bewerten Sie alle KI-Systeme gemäß EU AI Act Risikokategorien. Identifizieren Sie sofort: verbotene Praktiken, Hochrisiko-Systeme und Transparenzpflichten.',
    effort: 'Hoch',
    owner: 'Compliance / Legal',
    gapIds: ['risk', 'proh'],
    riskLevels: ['prohibited', 'high', 'limited'],
  },
  {
    id: 'm3',
    horizon: 'kurzfristig',
    prio: 'hoch',
    title: 'Verbotene KI-Praktiken prüfen und abstellen',
    description:
      'Prüfen Sie unmittelbar, ob Systeme verbotene Praktiken umsetzen (Social Scoring, manipulative KI, Echtzeit-Biometrie im öffentlichen Raum). Diese sind seit Februar 2025 untersagt.',
    effort: 'Hoch',
    owner: 'Legal / Geschäftsführung',
    gapIds: ['proh'],
    riskLevels: ['prohibited'],
  },
  {
    id: 'm4',
    horizon: 'kurzfristig',
    prio: 'hoch',
    title: 'Compliance-Verantwortliche benennen',
    description:
      'Benennen Sie einen AI Compliance Verantwortlichen. Definieren Sie klare Rollen für Legal, IT, Business und Datenschutz. Schaffen Sie eine Eskalationsstruktur.',
    effort: 'Niedrig',
    owner: 'Geschäftsführung',
    gapIds: ['team', 'gov'],
    riskLevels: ['prohibited', 'high', 'limited'],
  },
  {
    id: 'm5',
    horizon: 'kurzfristig',
    prio: 'mittel',
    title: 'Transparenzpflichten für Chatbots umsetzen',
    description:
      'Kennzeichnen Sie alle KI-gestützten Chatbots und virtuellen Assistenten als KI. Art. 50 EU AI Act gilt ab August 2025. Nutzer müssen klar informiert werden.',
    effort: 'Niedrig',
    owner: 'IT / Marketing',
    gapIds: ['trans'],
    riskLevels: ['limited', 'high'],
  },
  {
    id: 'm6',
    horizon: 'kurzfristig',
    prio: 'mittel',
    title: 'AI Literacy Basis-Schulung starten',
    description:
      'Starten Sie mit einer Basis-Schulung zu EU AI Act und KI-Risiken für alle Mitarbeitenden, die mit KI-Systemen arbeiten. Art. 4 fordert angemessene AI Literacy.',
    effort: 'Mittel',
    owner: 'HR / L&D',
    gapIds: ['lit'],
    riskLevels: ['prohibited', 'high', 'limited', 'minimal'],
  },

  // ── MITTELFRISTIG (3–12 Monate) ───────────────────────────────────────────
  {
    id: 'm7',
    horizon: 'mittelfristig',
    prio: 'hoch',
    title: 'Technische Dokumentation für Hochrisiko-KI aufbauen',
    description:
      'Erstellen Sie die gemäß Art. 11 geforderte technische Dokumentation für alle Hochrisiko-KI-Systeme: Systemzweck, Architektur, Daten, Testprotokolle, Leistungsmetriken, Risiken.',
    effort: 'Hoch',
    owner: 'IT / Compliance',
    gapIds: ['doc'],
    riskLevels: ['high'],
  },
  {
    id: 'm8',
    horizon: 'mittelfristig',
    prio: 'hoch',
    title: 'Risikomanagementsystem implementieren',
    description:
      'Implementieren Sie ein kontinuierliches Risikomanagementsystem (Art. 9): Risikoidentifikation, -analyse, -minderung und -überwachung für alle Hochrisiko-KI-Systeme.',
    effort: 'Hoch',
    owner: 'Risk Management / IT',
    gapIds: ['risk', 'mon'],
    riskLevels: ['high'],
  },
  {
    id: 'm9',
    horizon: 'mittelfristig',
    prio: 'hoch',
    title: 'Human Oversight Prozesse definieren',
    description:
      'Definieren Sie klare Human-in-the-Loop/Human-on-the-Loop Prozesse (Art. 14). Mitarbeitende müssen KI-Entscheidungen verstehen, überwachen und überstimmen können.',
    effort: 'Mittel',
    owner: 'Operations / IT',
    gapIds: ['hov'],
    riskLevels: ['high', 'limited'],
  },
  {
    id: 'm10',
    horizon: 'mittelfristig',
    prio: 'hoch',
    title: 'Daten-Governance für KI aufbauen',
    description:
      'Implementieren Sie eine KI-spezifische Daten-Governance (Art. 10): Datenherkunft, Qualitätsprüfung, Bias-Analyse, Repräsentativität und Dokumentation aller Trainingsdaten.',
    effort: 'Hoch',
    owner: 'Data / IT',
    gapIds: ['data'],
    riskLevels: ['high'],
  },
  {
    id: 'm11',
    horizon: 'mittelfristig',
    prio: 'mittel',
    title: 'KI-Monitoring System einrichten',
    description:
      'Richten Sie ein Post-Market Monitoring System ein (Art. 72): Kontinuierliche Überwachung von KI-Leistung, Drift, Anomalien und unerwarteten Verhaltensweisen.',
    effort: 'Hoch',
    owner: 'IT / Operations',
    gapIds: ['mon'],
    riskLevels: ['high', 'limited'],
  },
  {
    id: 'm12',
    horizon: 'mittelfristig',
    prio: 'mittel',
    title: 'Lieferantenverträge auf KI-Compliance aktualisieren',
    description:
      'Ergänzen Sie alle Verträge mit KI-Drittanbietern um EU AI Act-konforme Klauseln: Transparenz, Dokumentationspflichten, Haftung und Compliance-Nachweise.',
    effort: 'Mittel',
    owner: 'Legal / Procurement',
    gapIds: ['sup'],
    riskLevels: ['high', 'limited', 'minimal'],
  },
  {
    id: 'm13',
    horizon: 'mittelfristig',
    prio: 'mittel',
    title: 'Konformitätsbewertung für Hochrisiko-KI vorbereiten',
    description:
      'Bereiten Sie die Konformitätsbewertung (Art. 43) vor: Selbstbewertung oder Drittpartei-Prüfung, Konformitätserklärung (Art. 47) und CE-Kennzeichnung (Art. 48).',
    effort: 'Hoch',
    owner: 'Legal / Compliance',
    gapIds: ['doc', 'risk'],
    riskLevels: ['high'],
  },

  // ── STRATEGISCH (> 12 Monate) ─────────────────────────────────────────────
  {
    id: 'm14',
    horizon: 'strategisch',
    prio: 'hoch',
    title: 'AI Governance Framework etablieren',
    description:
      'Bauen Sie ein vollständiges AI Governance Framework auf: AI Policy, Ethics Guidelines, Review Boards, Eskalationspfade, regelmäßige Audits und kontinuierliche Verbesserung.',
    effort: 'Hoch',
    owner: 'Geschäftsführung / Compliance',
    gapIds: ['gov', 'team'],
    riskLevels: ['prohibited', 'high', 'limited'],
  },
  {
    id: 'm15',
    horizon: 'strategisch',
    prio: 'mittel',
    title: 'AI Compliance in SDLC integrieren',
    description:
      'Integrieren Sie EU AI Act Anforderungen in den Software Development Lifecycle (SDLC): AI-by-design, Compliance-Gates, automatisierte Prüfungen in der CI/CD-Pipeline.',
    effort: 'Hoch',
    owner: 'IT / Engineering',
    gapIds: ['doc', 'data'],
    riskLevels: ['high'],
  },
  {
    id: 'm16',
    horizon: 'strategisch',
    prio: 'mittel',
    title: 'Regelmäßige AI Act Compliance Audits einführen',
    description:
      'Führen Sie jährliche interne oder externe Audits aller KI-Systeme durch. Verankern Sie KI-Compliance als festen Bestandteil des Risikomanagements.',
    effort: 'Mittel',
    owner: 'Internal Audit / Compliance',
    gapIds: ['risk', 'gov'],
    riskLevels: ['high', 'limited'],
  },
  {
    id: 'm17',
    horizon: 'strategisch',
    prio: 'niedrig',
    title: 'AI Literacy Programm ausbauen',
    description:
      'Entwickeln Sie ein unternehmensweites AI Literacy Programm mit rollenspezifischen Schulungen, E-Learning-Modulen und regelmäßigen Updates zu neuen KI-Regulierungen.',
    effort: 'Mittel',
    owner: 'HR / L&D',
    gapIds: ['lit'],
    riskLevels: ['prohibited', 'high', 'limited', 'minimal'],
  },
];

export function getMeasuresForAssessment(riskLevel, gaps) {
  const gapIds = gaps.map((g) => g.id);
  return measures.filter((m) => {
    const riskMatch = m.riskLevels.includes(riskLevel);
    const gapMatch = m.gapIds.some((id) => gapIds.includes(id));
    return riskMatch && (gapMatch || m.prio === 'hoch');
  });
}
