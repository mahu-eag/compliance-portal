export const questions = [
  // ===== UNTERNEHMENSPROFIL =====
  {
    id: 'industry',
    category: 'Unternehmensprofil',
    type: 'single',
    text: 'In welcher Branche / Industrie sind Sie tätig?',
    description: 'Wählen Sie die zutreffende Branche aus. Sektoren der NIS-2-Richtlinie unterscheiden zwischen "wesentlich" und "wichtig".',
    options: [
      // Wesentliche Sektoren (Anhang I)
      { value: 'energie', label: 'Energie (Strom, Gas, Öl, Wärme, Wasserstoff)', criticality: 'essential' },
      { value: 'transport', label: 'Transport (Luft, Schiene, Wasser, Straße)', criticality: 'essential' },
      { value: 'banken', label: 'Bankwesen', criticality: 'essential' },
      { value: 'finanzmarkt', label: 'Finanzmarktinfrastrukturen', criticality: 'essential' },
      { value: 'gesundheit', label: 'Gesundheitswesen', criticality: 'essential' },
      { value: 'trinkwasser', label: 'Trinkwasser', criticality: 'essential' },
      { value: 'abwasser', label: 'Abwasser', criticality: 'essential' },
      { value: 'digitale_infra', label: 'Digitale Infrastruktur (DNS, TLD, Cloud, RZ, CDN)', criticality: 'essential' },
      { value: 'ikt_dienste', label: 'Verwaltung von IKT-Diensten (B2B)', criticality: 'essential' },
      { value: 'oeffentliche_verwaltung', label: 'Öffentliche Verwaltung', criticality: 'essential' },
      { value: 'weltraum', label: 'Weltraum', criticality: 'essential' },
      // Wichtige Sektoren (Anhang II)
      { value: 'post', label: 'Post- und Kurierdienste', criticality: 'important' },
      { value: 'abfall', label: 'Abfallwirtschaft', criticality: 'important' },
      { value: 'chemie', label: 'Produktion/Verarbeitung Chemikalien', criticality: 'important' },
      { value: 'lebensmittel', label: 'Produktion/Verarbeitung/Vertrieb Lebensmittel', criticality: 'important' },
      { value: 'produktion', label: 'Verarbeitendes Gewerbe (Medizinprodukte, IT, Elektronik, Maschinenbau, Fahrzeuge)', criticality: 'important' },
      { value: 'digitale_dienste', label: 'Anbieter digitaler Dienste (Online-Marktplätze, Suchmaschinen, Soziale Netzwerke)', criticality: 'important' },
      { value: 'forschung', label: 'Forschung', criticality: 'important' },
      { value: 'sonstiges', label: 'Keine der genannten Branchen', criticality: 'none' }
    ]
  },
  {
    id: 'employees',
    category: 'Unternehmensprofil',
    type: 'single',
    text: 'Wie viele Mitarbeitende beschäftigen Sie?',
    description: 'Anzahl der Vollzeitäquivalente (FTE) gemäß EU-Empfehlung 2003/361/EG.',
    options: [
      { value: 'small', label: 'Weniger als 50 Mitarbeitende', size: 'small' },
      { value: 'medium', label: '50 bis 250 Mitarbeitende', size: 'medium' },
      { value: 'large', label: 'Mehr als 250 Mitarbeitende', size: 'large' }
    ]
  },
  {
    id: 'revenue',
    category: 'Unternehmensprofil',
    type: 'single',
    text: 'Wie viel Umsatz erwirtschaften Sie jährlich?',
    description: 'Jahresumsatz oder Jahresbilanzsumme.',
    options: [
      { value: 'rev_xs', label: 'Bis 10 Mio. € Umsatz / Bilanzsumme', size: 'small' },
      { value: 'rev_s', label: '10 bis 50 Mio. € Umsatz / bis 43 Mio. € Bilanzsumme', size: 'medium' },
      { value: 'rev_l', label: 'Mehr als 50 Mio. € Umsatz / mehr als 43 Mio. € Bilanzsumme', size: 'large' }
    ]
  },

  /*
  // ===== KAPAZITÄT & RESSOURCEN (für KI-Vorgehensmodell) =====
  {
    id: 'it_staff',
    category: 'Unternehmensprofil',
    type: 'single',
    text: 'Wie viele IT-Mitarbeitende haben Sie?',
    description: 'Vollzeitkräfte, die primär IT-Aufgaben verantworten (Systembetrieb, Infrastruktur, Support).',
    options: [
      { value: 'none',   label: 'Keine dedizierte IT – IT läuft nebenbei',       itSize: 0 },
      { value: 'mini',   label: '1 bis 2 Personen',                              itSize: 1.5 },
      { value: 'small',  label: '3 bis 5 Personen',                              itSize: 4 },
      { value: 'medium', label: '6 bis 15 Personen',                             itSize: 10 },
      { value: 'large',  label: 'Mehr als 15 Personen',                          itSize: 20 }
    ]
  },
  {
    id: 'security_staff',
    category: 'Unternehmensprofil',
    type: 'single',
    text: 'Wie viele dedizierte IT-Security-Mitarbeitende haben Sie?',
    description: 'Personen, die sich hauptsächlich mit Informationssicherheit, Compliance oder Cybersecurity befassen.',
    options: [
      { value: 'none',     label: 'Keine – Security ist Nebentätigkeit',           secSize: 0 },
      { value: 'partial',  label: 'Eine Person kümmert sich anteilig (~20–50 %)',  secSize: 0.3 },
      { value: 'one',      label: '1 Vollzeit-Security-Mitarbeitende/r',           secSize: 1 },
      { value: 'small',    label: '2 bis 3 Personen',                              secSize: 2.5 },
      { value: 'team',     label: '4 oder mehr (eigenes Security-Team)',            secSize: 5 }
    ]
  },
  {
    id: 'capacity',
    category: 'Unternehmensprofil',
    type: 'single',
    text: 'Wie viel Kapazität können Sie realistisch für das NIS-2-Projekt aufwenden?',
    description: 'Schätzen Sie die verfügbare Gesamtkapazität pro Monat – über alle beteiligten Personen summiert.',
    options: [
      { value: 'minimal',  label: 'Sehr wenig – max. 2 Personentage/Monat',       ptPerMonth: 2 },
      { value: 'low',      label: 'Begrenzt – ca. 5 Personentage/Monat',          ptPerMonth: 5 },
      { value: 'medium',   label: 'Moderat – ca. 10 Personentage/Monat',          ptPerMonth: 10 },
      { value: 'high',     label: 'Gut – ca. 20 Personentage/Monat',              ptPerMonth: 20 },
      { value: 'fulltime', label: 'Vollzeit-Ressourcen verfügbar (>20 PT/Monat)', ptPerMonth: 30 }
    ]
  },
  {
    id: 'external_support',
    category: 'Unternehmensprofil',
    type: 'single',
    text: 'Planen Sie externe Unterstützung (Berater, MSSP, Dienstleister) einzusetzen?',
    description: 'Externe Ressourcen können fehlende interne Kapazität oder Expertise ausgleichen.',
    options: [
      { value: 'none',      label: 'Nein – wir setzen alles intern um',           extSupport: 'none' },
      { value: 'selective', label: 'Selektiv – nur für spezifische Themen',       extSupport: 'selective' },
      { value: 'moderate',  label: 'Moderat – ca. 30–50 % extern',               extSupport: 'moderate' },
      { value: 'heavy',     label: 'Stark – Mehrheit wird extern begleitet',      extSupport: 'heavy' }
    ]
  },

*/

  // ===== RISIKOMANAGEMENT =====
  {
    id: 'risk_assessment',
    category: 'Risikomanagement',
    type: 'single',
    text: 'Führen Sie regelmäßige IT-Risikoanalysen durch?',
    description: 'Art. 21 (2) a) NIS-2 - Konzepte zur Risikoanalyse und Sicherheit für Informationssysteme.',
    options: [
      { value: 'yes_documented', label: 'Ja, regelmäßig und dokumentiert', score: 10 },
      { value: 'yes_partial', label: 'Ja, aber unregelmäßig', score: 5 },
      { value: 'planned', label: 'Geplant, noch nicht umgesetzt', score: 2 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },
  {
    id: 'security_policy',
    category: 'Risikomanagement',
    type: 'single',
    text: 'Existiert eine dokumentierte Informationssicherheits-Leitlinie?',
    description: 'Verbindliche Sicherheitsrichtlinien, von der Geschäftsführung verabschiedet.',
    options: [
      { value: 'yes_approved', label: 'Ja, verabschiedet und kommuniziert', score: 10 },
      { value: 'draft', label: 'Im Entwurf', score: 3 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },

  // ===== INCIDENT MANAGEMENT =====
  {
    id: 'incident_handling',
    category: 'Incident Management',
    type: 'single',
    text: 'Haben Sie einen formalen Prozess zur Behandlung von Sicherheitsvorfällen?',
    description: 'Art. 21 (2) b) NIS-2 - Bewältigung von Sicherheitsvorfällen.',
    options: [
      { value: 'yes_tested', label: 'Ja, dokumentiert und regelmäßig getestet', score: 10 },
      { value: 'yes_documented', label: 'Ja, dokumentiert', score: 7 },
      { value: 'informal', label: 'Informeller Prozess vorhanden', score: 3 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },
  {
    id: 'reporting_24h',
    category: 'Incident Management',
    type: 'single',
    text: 'Können Sie einen Sicherheitsvorfall innerhalb von 24 Stunden an die zuständige Behörde melden?',
    description: 'NIS-2 fordert eine Frühwarnung innerhalb von 24h, vollständige Meldung binnen 72h.',
    options: [
      { value: 'yes', label: 'Ja, Prozess etabliert', score: 10 },
      { value: 'partly', label: 'Teilweise', score: 5 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },

  // ===== BUSINESS CONTINUITY =====
  {
    id: 'bcm',
    category: 'Business Continuity',
    type: 'single',
    text: 'Verfügen Sie über ein Business Continuity Management (BCM)?',
    description: 'Art. 21 (2) c) - Aufrechterhaltung des Betriebs (Backup, Notfallwiederherstellung, Krisenmanagement).',
    options: [
      { value: 'yes_iso', label: 'Ja, nach ISO 22301 oder gleichwertig', score: 10 },
      { value: 'yes', label: 'Ja, dokumentiert', score: 7 },
      { value: 'partly', label: 'Teilweise vorhanden', score: 3 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },
  {
    id: 'backup',
    category: 'Business Continuity',
    type: 'single',
    text: 'Werden regelmäßige Backups erstellt und getestet?',
    description: 'Wiederherstellbarkeit nach 3-2-1-Regel.',
    options: [
      { value: 'yes_tested', label: 'Ja, automatisiert und regelmäßig getestet', score: 10 },
      { value: 'yes', label: 'Ja, aber nicht regelmäßig getestet', score: 5 },
      { value: 'no', label: 'Nein bzw. unregelmäßig', score: 0 }
    ]
  },

  // ===== LIEFERKETTE =====
  {
    id: 'supply_chain',
    category: 'Lieferkette',
    type: 'single',
    text: 'Bewerten Sie die Sicherheit Ihrer Lieferanten und Dienstleister?',
    description: 'Art. 21 (2) d) - Sicherheit der Lieferkette.',
    options: [
      { value: 'yes_systematic', label: 'Ja, systematisch mit Audits', score: 10 },
      { value: 'yes_contracts', label: 'Ja, vertraglich geregelt', score: 6 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },

  // ===== ZUGRIFFSKONTROLLE =====
  {
    id: 'mfa',
    category: 'Zugriffskontrolle',
    type: 'single',
    text: 'Setzen Sie Multi-Faktor-Authentifizierung (MFA) ein?',
    description: 'Art. 21 (2) j) - Verwendung von Multi-Faktor-Authentifizierung.',
    options: [
      { value: 'all', label: 'Ja, für alle Systeme', score: 10 },
      { value: 'critical', label: 'Ja, für kritische Systeme', score: 7 },
      { value: 'partly', label: 'Teilweise', score: 3 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },
  {
    id: 'access_control',
    category: 'Zugriffskontrolle',
    type: 'single',
    text: 'Wird ein rollenbasiertes Zugriffskonzept (RBAC) angewendet?',
    description: 'Need-to-know-Prinzip, regelmäßige Rezertifizierung.',
    options: [
      { value: 'yes_audited', label: 'Ja, mit regelmäßiger Überprüfung', score: 10 },
      { value: 'yes', label: 'Ja, etabliert', score: 6 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },

  // ===== KRYPTOGRAFIE =====
  {
    id: 'encryption',
    category: 'Kryptografie',
    type: 'single',
    text: 'Werden sensible Daten verschlüsselt (at rest und in transit)?',
    description: 'Art. 21 (2) h) - Konzepte für Kryptografie und Verschlüsselung.',
    options: [
      { value: 'yes_full', label: 'Ja, durchgängig (at rest & in transit)', score: 10 },
      { value: 'transit_only', label: 'Nur bei Übertragung', score: 5 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },

  // ===== SCHULUNG =====
  {
    id: 'training',
    category: 'Schulung & Awareness',
    type: 'single',
    text: 'Erhalten Mitarbeitende regelmäßige Sicherheitsschulungen?',
    description: 'Art. 21 (2) g) - Cybersicherheits-Hygiene und Schulungen.',
    options: [
      { value: 'yes_regular', label: 'Ja, mindestens jährlich (inkl. Phishing-Simulationen)', score: 10 },
      { value: 'yes', label: 'Ja, gelegentlich', score: 5 },
      { value: 'onboarding', label: 'Nur beim Onboarding', score: 3 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  },
  {
    id: 'management_training',
    category: 'Schulung & Awareness',
    type: 'single',
    text: 'Wurde die Geschäftsleitung in Cybersicherheit geschult?',
    description: 'Art. 20 NIS-2 - Geschäftsleitung trägt persönliche Verantwortung.',
    options: [
      { value: 'yes', label: 'Ja, dokumentierte Schulung', score: 10 },
      { value: 'planned', label: 'Geplant', score: 3 },
      { value: 'no', label: 'Nein', score: 0 }
    ]
  }
];

export const categories = [
  'Unternehmensprofil',
  'Risikomanagement',
  'Incident Management',
  'Business Continuity',
  'Lieferkette',
  'Zugriffskontrolle',
  'Kryptografie',
  'Schulung & Awareness'
];