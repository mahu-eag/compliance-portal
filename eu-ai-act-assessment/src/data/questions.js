// EU AI Act Readiness Assessment – Fragenstruktur
// Phasen: Kontext → Use Cases → Risiko → Reifegrad → Gap → Maßnahmen

export const questions = [

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: UNTERNEHMENSKONTEXT
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'industry',
    phase: 1,
    category: 'Unternehmenskontext',
    type: 'single',
    text: 'In welcher Branche ist Ihr Unternehmen tätig?',
    description: 'Die Branche beeinflusst das regulatorische Umfeld und die Wahrscheinlichkeit von Hochrisiko-KI-Anwendungen.',
    options: [
      { value: 'finanz',      label: 'Finanzdienstleistungen / Versicherungen',  weight: 3 },
      { value: 'health',      label: 'Gesundheit / Medizin / Pharma',             weight: 3 },
      { value: 'oeffentlich', label: 'Öffentliche Verwaltung / Behörden',         weight: 3 },
      { value: 'bildung',     label: 'Bildung / Forschung',                       weight: 2 },
      { value: 'industrie',   label: 'Industrie / Produktion / Logistik',         weight: 2 },
      { value: 'handel',      label: 'Handel / E-Commerce',                       weight: 1 },
      { value: 'it',          label: 'IT / Software / Technologie',               weight: 2 },
      { value: 'hr',          label: 'Personal / Recruiting / HR',                weight: 2 },
      { value: 'media',       label: 'Medien / Marketing / Kommunikation',        weight: 1 },
      { value: 'sonstiges',   label: 'Sonstiges',                                 weight: 1 },
    ],
  },
  {
    id: 'company_size',
    phase: 1,
    category: 'Unternehmenskontext',
    type: 'single',
    text: 'Wie groß ist Ihr Unternehmen?',
    description: 'Die Unternehmensgröße beeinflusst Compliance-Ressourcen und Fristen unter dem EU AI Act.',
    options: [
      { value: 'micro',  label: 'Kleinstunternehmen (< 10 Mitarbeitende)',         weight: 0 },
      { value: 'small',  label: 'Kleinunternehmen (10–49 Mitarbeitende)',          weight: 1 },
      { value: 'medium', label: 'Mittelständisches Unternehmen (50–249 Mitarb.)', weight: 2 },
      { value: 'large',  label: 'Großunternehmen (250+ Mitarbeitende)',            weight: 3 },
    ],
  },
  {
    id: 'markets',
    phase: 1,
    category: 'Unternehmenskontext',
    type: 'single',
    text: 'In welchen Märkten sind Sie aktiv?',
    description: 'Der EU AI Act gilt für alle Unternehmen, die KI-Systeme im EU-Raum einsetzen oder bereitstellen.',
    options: [
      { value: 'eu_only',    label: 'Ausschließlich EU / EWR',                    weight: 2 },
      { value: 'eu_global',  label: 'EU / EWR und international',                 weight: 3 },
      { value: 'non_eu',     label: 'Kein EU-Geschäft (rein außereuropäisch)',     weight: 0 },
    ],
  },
  {
    id: 'reg_environment',
    phase: 1,
    category: 'Unternehmenskontext',
    type: 'single',
    text: 'Wie stark reguliert ist Ihr Geschäftsfeld bereits?',
    description: 'Bereits regulierte Branchen (z. B. Finanz, Health) unterliegen zusätzlichen Anforderungen durch den EU AI Act.',
    options: [
      { value: 'high',   label: 'Stark reguliert (z. B. BaFin, FDA, MDR)',        weight: 3 },
      { value: 'medium', label: 'Moderat reguliert (z. B. DSGVO, ISO-Normen)',    weight: 2 },
      { value: 'low',    label: 'Wenig reguliert',                                weight: 1 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: KI-USE-CASE INVENTAR
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ai_usage',
    phase: 2,
    category: 'KI-Use-Case-Inventar',
    type: 'single',
    text: 'Setzt Ihr Unternehmen aktuell KI-Systeme ein oder plant dies in den nächsten 12 Monaten?',
    description: 'KI-Systeme umfassen Chatbots, Empfehlungsalgorithmen, Bilderkennungssysteme, prädiktive Analysen, automatisierte Entscheidungssysteme u. v. m.',
    options: [
      { value: 'yes_active',  label: 'Ja, wir nutzen KI bereits aktiv',            weight: 3 },
      { value: 'yes_planned', label: 'Ja, wir planen KI-Einsatz in 12 Monaten',    weight: 2 },
      { value: 'pilot',       label: 'Wir sind in der Pilotphase / Evaluierung',    weight: 2 },
      { value: 'no',          label: 'Nein, kein KI-Einsatz geplant',              weight: 0 },
    ],
  },
  {
    id: 'ai_internal',
    phase: 2,
    category: 'KI-Use-Case-Inventar',
    type: 'multi',
    text: 'Welche internen KI-Anwendungen nutzen oder planen Sie?',
    description: 'Wählen Sie alle zutreffenden internen Bereiche aus.',
    options: [
      { value: 'hr_recruiting',    label: 'HR / Recruiting: Bewerberauswahl, Personalentscheidungen',    weight: 3 },
      { value: 'hr_performance',   label: 'HR: Leistungsbewertung / Mitarbeiter-Monitoring',             weight: 3 },
      { value: 'finance_risk',     label: 'Finance: Kreditbewertung / Risikoanalyse',                    weight: 3 },
      { value: 'it_security',      label: 'IT: Cybersecurity / Anomalieerkennung',                       weight: 1 },
      { value: 'process_auto',     label: 'Prozessautomatisierung / RPA mit KI',                         weight: 1 },
      { value: 'document_ai',      label: 'Dokumentenverarbeitung / intelligente Suche',                 weight: 1 },
      { value: 'none_internal',    label: 'Keine internen KI-Anwendungen',                              weight: 0 },
    ],
  },
  {
    id: 'ai_customer',
    phase: 2,
    category: 'KI-Use-Case-Inventar',
    type: 'multi',
    text: 'Welche kundenseitigen KI-Anwendungen setzen Sie ein?',
    description: 'Wählen Sie alle zutreffenden Kundenkontakt-Bereiche aus.',
    options: [
      { value: 'chatbot',          label: 'Chatbot / virtueller Assistent (Kundenservice)',              weight: 1 },
      { value: 'recommendation',   label: 'Empfehlungssysteme (Produkte, Inhalte)',                      weight: 1 },
      { value: 'personalization',  label: 'Personalisierung / dynamische Preisgestaltung',               weight: 2 },
      { value: 'credit_scoring',   label: 'Kreditscoring / Bonitätsprüfung für Kunden',                  weight: 3 },
      { value: 'fraud_detection',  label: 'Betrugserkennung / Identitätsprüfung',                        weight: 2 },
      { value: 'deepfake_content', label: 'Synthetische Medien / Deepfake-Erkennung',                    weight: 2 },
      { value: 'none_customer',    label: 'Keine kundenseitigen KI-Anwendungen',                         weight: 0 },
    ],
  },
  {
    id: 'ai_operational',
    phase: 2,
    category: 'KI-Use-Case-Inventar',
    type: 'multi',
    text: 'Welche operativen KI-Systeme sind im Einsatz?',
    description: 'Operative KI umfasst Systeme in Produktion, Logistik, Qualitätssicherung und kritischer Infrastruktur.',
    options: [
      { value: 'predictive_maint', label: 'Predictive Maintenance / vorausschauende Wartung',            weight: 2 },
      { value: 'quality_ctrl',     label: 'Qualitätskontrolle / visuelle Inspektion',                    weight: 2 },
      { value: 'supply_chain',     label: 'Supply Chain Optimierung',                                    weight: 1 },
      { value: 'critical_infra',   label: 'Steuerung kritischer Infrastruktur',                          weight: 3 },
      { value: 'autonomous',       label: 'Autonome Fahrzeuge / Robotik',                                weight: 3 },
      { value: 'medical_device',   label: 'Medizinprodukt / klinische KI',                               weight: 3 },
      { value: 'none_operational', label: 'Keine operativen KI-Systeme',                                 weight: 0 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: RISIKO-KLASSIFIZIERUNG
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'prohibited_ai',
    phase: 3,
    category: 'Risiko-Klassifizierung',
    type: 'single',
    text: 'Nutzen Sie KI für Echtzeit-Biometrie, Social Scoring oder manipulative Systeme?',
    description: 'Verbotene KI-Praktiken (Art. 5 EU AI Act): Echtzeit-biometrische Überwachung im öffentlichen Raum, Social Scoring durch Behörden, unbewusste Manipulation von Personen, Ausnutzung von Schwächen.',
    options: [
      { value: 'yes',     label: 'Ja, solche Systeme sind im Einsatz oder geplant',  weight: 10, risk: 'prohibited' },
      { value: 'unsure',  label: 'Unsicher / muss geprüft werden',                   weight: 5,  risk: 'high' },
      { value: 'no',      label: 'Nein, definitiv nicht',                             weight: 0,  risk: 'none' },
    ],
  },
  {
    id: 'high_risk_domains',
    phase: 3,
    category: 'Risiko-Klassifizierung',
    type: 'multi',
    text: 'In welchen Hochrisiko-Bereichen (Anhang III EU AI Act) setzen Sie KI ein?',
    description: 'Hochrisiko-KI (Anhang III) betrifft: Biometrie, kritische Infrastruktur, Bildung, Beschäftigung, wesentliche Dienstleistungen, Strafverfolgung, Migration, Justiz.',
    options: [
      { value: 'biometric',   label: 'Biometrie / Identifikation von Personen',                          weight: 3, risk: 'high' },
      { value: 'infra',       label: 'Kritische Infrastruktur (Energie, Wasser, Verkehr)',               weight: 3, risk: 'high' },
      { value: 'education',   label: 'Bildung / Beurteilung von Schülern/Studierenden',                  weight: 3, risk: 'high' },
      { value: 'employment',  label: 'Beschäftigung / Personalentscheidungen',                           weight: 3, risk: 'high' },
      { value: 'services',    label: 'Wesentliche Dienste (Kredit, Sozialleistungen, Versicherungen)',   weight: 3, risk: 'high' },
      { value: 'law_enforce', label: 'Strafverfolgung / Polizeiarbeit',                                  weight: 3, risk: 'high' },
      { value: 'migration',   label: 'Migration / Asyl / Grenzkontrolle',                                weight: 3, risk: 'high' },
      { value: 'justice',     label: 'Justiz / Rechtspflege',                                            weight: 3, risk: 'high' },
      { value: 'none_high',   label: 'Keiner der genannten Bereiche',                                    weight: 0, risk: 'none' },
    ],
  },
  {
    id: 'limited_risk',
    phase: 3,
    category: 'Risiko-Klassifizierung',
    type: 'multi',
    text: 'Welche Systeme mit begrenztem Risiko (Transparenzpflicht) betreiben Sie?',
    description: 'Begrenzte-Risiko-Systeme müssen Nutzer informieren, dass sie mit KI interagieren (z. B. Chatbots, KI-generierte Texte/Bilder).',
    options: [
      { value: 'chatbot_limited',  label: 'Chatbots oder virtuelle Agenten im Kundenkontakt',           weight: 2, risk: 'limited' },
      { value: 'synthetic_media',  label: 'KI-generierte Texte, Bilder, Videos, Audio',                 weight: 2, risk: 'limited' },
      { value: 'emotion_recog',    label: 'Emotionserkennung in Geschäftsprozessen',                     weight: 2, risk: 'limited' },
      { value: 'deepfake_gen',     label: 'Deepfake-Erzeugung (z. B. für Marketing)',                    weight: 2, risk: 'limited' },
      { value: 'none_limited',     label: 'Keine solchen Systeme',                                       weight: 0, risk: 'none' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: REIFEGRAD-ANALYSE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'documentation',
    phase: 4,
    category: 'Reifegrad-Analyse',
    type: 'single',
    text: 'Wie ist der Dokumentationsstand Ihrer KI-Systeme?',
    description: 'Der EU AI Act fordert technische Dokumentation (Art. 11), Gebrauchsanweisungen und Konformitätserklärungen für Hochrisiko-KI.',
    options: [
      { value: 'none',     label: 'Keine Dokumentation vorhanden',                                       score: 0 },
      { value: 'partial',  label: 'Teilweise dokumentiert (interne Wikis, informelle Dokumente)',         score: 1 },
      { value: 'formal',   label: 'Formale Dokumentation, aber nicht EU AI Act-konform',                  score: 2 },
      { value: 'full',     label: 'Vollständige, strukturierte technische Dokumentation',                  score: 3 },
    ],
  },
  {
    id: 'data_quality',
    phase: 4,
    category: 'Reifegrad-Analyse',
    type: 'single',
    text: 'Wie stellen Sie die Qualität Ihrer Trainingsdaten sicher?',
    description: 'Art. 10 EU AI Act fordert Daten-Governance, Qualitätsprüfung, Repräsentativität und Dokumentation von Trainingsdaten.',
    options: [
      { value: 'none',     label: 'Keine systematische Datenqualitätsprüfung',                           score: 0 },
      { value: 'basic',    label: 'Grundlegende Prüfungen (z. B. Vollständigkeit)',                       score: 1 },
      { value: 'partial',  label: 'Teilweise Governance (Datenverantwortliche, Prozesse)',                score: 2 },
      { value: 'full',     label: 'Vollständige Daten-Governance inkl. Bias-Prüfung',                     score: 3 },
    ],
  },
  {
    id: 'monitoring',
    phase: 4,
    category: 'Reifegrad-Analyse',
    type: 'single',
    text: 'Wie überwachen Sie Ihre KI-Systeme im Betrieb?',
    description: 'Art. 9 EU AI Act fordert ein Risikomanagementsystem; Art. 72 Monitoring nach dem Inverkehrbringen – Leistung und unerwartetes Verhalten müssen erkannt werden.',
    options: [
      { value: 'none',       label: 'Kein Monitoring vorhanden',                                         score: 0 },
      { value: 'manual',     label: 'Manuelle, stichprobenartige Überprüfungen',                         score: 1 },
      { value: 'automated',  label: 'Teilautomatisiertes Monitoring (z. B. Dashboards)',                  score: 2 },
      { value: 'full',       label: 'Vollständiges Post-Market Monitoring mit Alerting',                  score: 3 },
    ],
  },
  {
    id: 'human_oversight',
    phase: 4,
    category: 'Reifegrad-Analyse',
    type: 'single',
    text: 'Wie ist menschliche Aufsicht über KI-Entscheidungen geregelt?',
    description: 'Art. 14 EU AI Act: Menschen müssen KI-Systeme verstehen, überwachen und ggf. außer Kraft setzen können (Human-in-the-Loop / Human-on-the-Loop).',
    options: [
      { value: 'none',      label: 'Keine menschliche Aufsicht, voll automatisierte Entscheidungen',     score: 0 },
      { value: 'informal',  label: 'Informelle Aufsicht ohne klare Prozesse',                            score: 1 },
      { value: 'partial',   label: 'Aufsicht definiert, aber nicht systematisch umgesetzt',               score: 2 },
      { value: 'full',      label: 'Klare Human-Oversight-Prozesse, dokumentiert und etabliert',          score: 3 },
    ],
  },
  {
    id: 'governance',
    phase: 4,
    category: 'Reifegrad-Analyse',
    type: 'single',
    text: 'Wie ist KI-Governance in Ihrem Unternehmen verankert?',
    description: 'Governance umfasst: Verantwortlichkeiten, Richtlinien, Risikoausschüsse, AI Literacy, Ethics Boards und Eskalationspfade.',
    options: [
      { value: 'none',      label: 'Keine KI-Governance definiert',                                      score: 0 },
      { value: 'informal',  label: 'Ad-hoc Verantwortlichkeiten, keine formalen Strukturen',             score: 1 },
      { value: 'partial',   label: 'Richtlinien vorhanden, Rollen teilweise definiert',                  score: 2 },
      { value: 'full',      label: 'Vollständiges AI Governance Framework etabliert',                    score: 3 },
    ],
  },
  {
    id: 'transparency',
    phase: 4,
    category: 'Reifegrad-Analyse',
    type: 'single',
    text: 'Wie transparent kommunizieren Sie KI-Einsatz gegenüber Kunden / Nutzern?',
    description: 'Art. 13 EU AI Act: Hochrisiko-KI muss transparent sein. Art. 50: Chatbots und KI-generierte Inhalte müssen als solche gekennzeichnet werden.',
    options: [
      { value: 'none',     label: 'Keine Transparenz / keine Kennzeichnung',                             score: 0 },
      { value: 'partial',  label: 'Sporadische Hinweise, nicht systematisch',                            score: 1 },
      { value: 'most',     label: 'Meiste KI-Systeme gekennzeichnet, Prozess im Aufbau',                 score: 2 },
      { value: 'full',     label: 'Vollständige Transparenz und Kennzeichnung etabliert',                 score: 3 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: GAP-ANALYSE / ORGANISATION
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ai_inventory_exists',
    phase: 5,
    category: 'Gap-Analyse',
    type: 'single',
    text: 'Haben Sie ein vollständiges Inventar aller KI-Systeme im Unternehmen?',
    description: 'Ein KI-Inventar ist die Basis für EU AI Act Compliance – ohne vollständige Übersicht können Risiken nicht systematisch bewertet werden.',
    options: [
      { value: 'no',       label: 'Nein, kein Inventar vorhanden',                                      score: 0 },
      { value: 'partial',  label: 'Teilweises Inventar (nicht vollständig)',                             score: 1 },
      { value: 'yes',      label: 'Ja, vollständiges KI-Inventar',                                      score: 3 },
    ],
  },
  {
    id: 'risk_assessment',
    phase: 5,
    category: 'Gap-Analyse',
    type: 'single',
    text: 'Führen Sie systematische Risikobewertungen für KI-Systeme durch?',
    description: 'Art. 9 EU AI Act: Risikomanagementsystem ist Pflicht für Hochrisiko-KI. Dies umfasst Identifikation, Analyse, Bewertung und Mitigierung von Risiken.',
    options: [
      { value: 'no',       label: 'Nein, keine Risikobewertungen',                                      score: 0 },
      { value: 'informal', label: 'Informelle / unstrukturierte Bewertungen',                            score: 1 },
      { value: 'partial',  label: 'Formale Prozesse in Teilen vorhanden',                                score: 2 },
      { value: 'yes',      label: 'Ja, systematische Risikobewertungen etabliert',                      score: 3 },
    ],
  },
  {
    id: 'compliance_team',
    phase: 5,
    category: 'Gap-Analyse',
    type: 'single',
    text: 'Gibt es dedizierte Verantwortliche für KI-Compliance im Unternehmen?',
    description: 'Klare Verantwortlichkeiten sind essenziell: AI Compliance Officer, Legal, Risk Management, IT und Business müssen koordiniert arbeiten.',
    options: [
      { value: 'no',        label: 'Nein, niemand ist explizit verantwortlich',                         score: 0 },
      { value: 'informal',  label: 'Informell (z. B. IT-Leiter „nebenbei")',                             score: 1 },
      { value: 'partial',   label: 'Teilweise definiert (z. B. Datenschutzbeauftragter mitbeauftragt)', score: 2 },
      { value: 'dedicated', label: 'Dedizierter AI Compliance Verantwortlicher',                         score: 3 },
    ],
  },
  {
    id: 'supplier_risk',
    phase: 5,
    category: 'Gap-Analyse',
    type: 'single',
    text: 'Wie managen Sie KI-Risiken bei Drittanbietern und Lieferanten?',
    description: 'Viele Unternehmen nutzen KI über Drittanbieter (z. B. Microsoft Copilot, AWS, externe Software). Der EU AI Act verpflichtet Anwender, auch bei Drittanbieter-KI Compliance sicherzustellen.',
    options: [
      { value: 'no',       label: 'Kein Management von KI-Drittanbieterrisiken',                        score: 0 },
      { value: 'basic',    label: 'Grundlegende Vertragsklauseln ohne KI-Fokus',                        score: 1 },
      { value: 'partial',  label: 'KI-Anforderungen in einigen Lieferantenverträgen',                   score: 2 },
      { value: 'full',     label: 'Vollständiges Drittanbieter-KI-Risikomanagement',                    score: 3 },
    ],
  },
  {
    id: 'ai_literacy',
    phase: 5,
    category: 'Gap-Analyse',
    type: 'single',
    text: 'Wie ist das KI-Bewusstsein (AI Literacy) Ihrer Mitarbeitenden?',
    description: 'Art. 4 EU AI Act: Unternehmen müssen ausreichende AI Literacy ihrer Mitarbeitenden sicherstellen. Dies umfasst Grundkenntnisse, Risikobewusstsein und Schulungen.',
    options: [
      { value: 'none',     label: 'Kaum vorhanden, keine Schulungen',                                   score: 0 },
      { value: 'basic',    label: 'Grundlegendes Bewusstsein, vereinzelte Schulungen',                   score: 1 },
      { value: 'moderate', label: 'Moderates Bewusstsein, strukturierte Schulungen geplant',             score: 2 },
      { value: 'high',     label: 'Hohes AI Literacy-Niveau, regelmäßige Trainings',                    score: 3 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: MASSNAHMEN & ZEITPLAN
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'timeline_pressure',
    phase: 6,
    category: 'Maßnahmenplanung',
    type: 'single',
    text: 'Wie stark ist der Zeitdruck für EU AI Act Compliance in Ihrem Unternehmen?',
    description: 'Verbote gelten ab Feb 2025, Hochrisiko-Anforderungen ab Aug 2026. General-Purpose AI (GPAI) Regeln gelten ab Aug 2025.',
    options: [
      { value: 'urgent',   label: 'Dringend – wir haben aktive Hochrisiko-KI-Systeme',                  weight: 3 },
      { value: 'high',     label: 'Hoch – Systeme in Entwicklung / Pilotphase',                         weight: 2 },
      { value: 'moderate', label: 'Moderat – KI geplant aber noch nicht aktiv',                         weight: 1 },
      { value: 'low',      label: 'Niedrig – nur minimales KI-Exposure',                                weight: 0 },
    ],
  },
  {
    id: 'resources',
    phase: 6,
    category: 'Maßnahmenplanung',
    type: 'single',
    text: 'Welche Ressourcen stehen für EU AI Act Compliance zur Verfügung?',
    description: 'Compliance erfordert Zeit, Budget und Expertise – sowohl intern als auch für externe Beratung.',
    options: [
      { value: 'none',     label: 'Keine dedizierten Ressourcen',                                        weight: 0 },
      { value: 'limited',  label: 'Begrenzte Ressourcen (< 20% einer Vollzeitstelle)',                   weight: 1 },
      { value: 'partial',  label: 'Teilweise Ressourcen (Bestandteile bestehender Rollen)',              weight: 2 },
      { value: 'full',     label: 'Dedizierte Ressourcen (eigenes Team oder Beauftragter)',               weight: 3 },
    ],
  },
  {
    id: 'external_support',
    phase: 6,
    category: 'Maßnahmenplanung',
    type: 'single',
    text: 'Wie stehen Sie zu externer Unterstützung bei der EU AI Act Compliance?',
    description: 'Externe Experten können Geschwindigkeit, Qualität und Sicherheit im Compliance-Prozess deutlich erhöhen.',
    options: [
      { value: 'yes_now',    label: 'Ja, wir suchen aktiv externe Unterstützung',                       weight: 3 },
      { value: 'yes_later',  label: 'Ja, aber erst später / nach interner Analyse',                     weight: 2 },
      { value: 'unsure',     label: 'Unsicher / offen für Optionen',                                    weight: 2 },
      { value: 'no',         label: 'Nein, wir wollen es intern lösen',                                 weight: 1 },
    ],
  },
];

export const PHASES = [
  { id: 1, label: 'Unternehmenskontext',  icon: '🏢' },
  { id: 2, label: 'KI-Use-Cases',         icon: '🤖' },
  { id: 3, label: 'Risiko-Klassifizierung', icon: '⚠️' },
  { id: 4, label: 'Reifegrad',            icon: '📊' },
  { id: 5, label: 'Gap-Analyse',          icon: '🔍' },
  { id: 6, label: 'Maßnahmenplanung',     icon: '🎯' },
];
