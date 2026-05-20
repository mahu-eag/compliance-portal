// Maßnahmenkatalog pro Frage-ID
//
// Neue Felder je Maßnahme:
//   effort:       Aufwand in Personentagen (PT) – Basiswert für mittleres Unternehmen (50–250 MA)
//   delivery:     'intern' | 'extern' | 'both'  – Empfehlung zur Durchführung
//   durationWeeks: Realistische Durchführungsdauer in Wochen (inkl. Abstimmung, Iterationen)
//   dependsOn:    Array von Maßnahmen-Titeln, die vorher abgeschlossen sein sollten
//
// Alle Werte werden in getRelevantMeasures() anhand des Unternehmensprofils skaliert.

export const measures = {
  risk_assessment: {
    topic: 'Risikoanalyse etablieren',
    measures: [
      {
        title: 'Methodik festlegen (z. B. ISO/IEC 27005, BSI 200-3)',
        type: 'org', priority: 'high',
        description: 'Definieren Sie eine einheitliche Methodik zur Identifikation, Bewertung und Behandlung von IT-Risiken.',
        effort: 5,
        delivery: 'both',
        durationWeeks: 3,
        dependsOn: []
      },
      {
        title: 'Asset-Inventar aufbauen',
        type: 'tech', priority: 'high',
        description: 'Vollständiges Inventar aller Informationswerte (Systeme, Daten, Prozesse) als Grundlage der Risikoanalyse.',
        effort: 8,
        delivery: 'intern',
        durationWeeks: 4,
        dependsOn: ['Methodik festlegen (z. B. ISO/IEC 27005, BSI 200-3)']
      },
      {
        title: 'Risiko-Workshops mit Fachbereichen',
        type: 'change', priority: 'high',
        description: 'Beziehen Sie Fachbereiche aktiv ein – Risiken werden dort identifiziert, wo Prozesse stattfinden. Schafft zudem Akzeptanz.',
        effort: 6,
        delivery: 'both',
        durationWeeks: 4,
        dependsOn: ['Asset-Inventar aufbauen']
      },
      {
        title: 'Risikoregister einführen',
        type: 'org', priority: 'medium',
        description: 'Zentrale Dokumentation aller identifizierten Risiken mit Bewertung, Maßnahmen und Verantwortlichen.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Risiko-Workshops mit Fachbereichen']
      },
      {
        title: 'Regelmäßiger Review-Zyklus',
        type: 'org', priority: 'medium',
        description: 'Mindestens jährliche Wiederholung sowie anlassbezogen bei größeren Veränderungen.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: ['Risikoregister einführen']
      },
      {
        title: 'Management-Reporting etablieren',
        type: 'change', priority: 'medium',
        description: 'Risiken regelmäßig an die Geschäftsleitung berichten – schafft Sichtbarkeit und Verbindlichkeit.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Risikoregister einführen']
      }
    ]
  },

  security_policy: {
    topic: 'Informationssicherheits-Leitlinie',
    measures: [
      {
        title: 'Leitlinie erstellen oder finalisieren',
        type: 'org', priority: 'high',
        description: 'Inhalte: Geltungsbereich, Schutzziele, Verantwortlichkeiten, Verbindlichkeit, Sanktionen.',
        effort: 5,
        delivery: 'both',
        durationWeeks: 4,
        dependsOn: []
      },
      {
        title: 'Verabschiedung durch Geschäftsleitung',
        type: 'org', priority: 'high',
        description: 'Formelle Inkraftsetzung – ohne Management-Commitment keine Wirksamkeit.',
        effort: 1,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: ['Leitlinie erstellen oder finalisieren']
      },
      {
        title: 'Untergeordnete Richtlinien ableiten',
        type: 'org', priority: 'medium',
        description: 'Z. B. Passwort-, Clean-Desk-, Mobile-Device- oder Cloud-Nutzungsrichtlinie.',
        effort: 8,
        delivery: 'both',
        durationWeeks: 6,
        dependsOn: ['Verabschiedung durch Geschäftsleitung']
      },
      {
        title: 'Kommunikationsplan & Awareness-Kampagne',
        type: 'change', priority: 'high',
        description: 'Mitarbeitende müssen Inhalt und Bedeutung kennen. Kick-off, Intranet-Beiträge, Townhall, FAQ.',
        effort: 4,
        delivery: 'intern',
        durationWeeks: 3,
        dependsOn: ['Verabschiedung durch Geschäftsleitung']
      },
      {
        title: 'Verpflichtende Kenntnisnahme dokumentieren',
        type: 'change', priority: 'medium',
        description: 'Z. B. via E-Learning-Plattform mit Bestätigungs-Log – schafft Verbindlichkeit.',
        effort: 3,
        delivery: 'both',
        durationWeeks: 3,
        dependsOn: ['Kommunikationsplan & Awareness-Kampagne']
      },
      {
        title: 'Jährliche Überprüfung & Aktualisierung',
        type: 'org', priority: 'low',
        description: 'Anpassung an neue Bedrohungslagen, Technologien und regulatorische Anforderungen.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Leitlinie erstellen oder finalisieren']
      }
    ]
  },

  incident_handling: {
    topic: 'Incident-Response-Prozess',
    measures: [
      {
        title: 'Incident-Response-Plan dokumentieren',
        type: 'org', priority: 'high',
        description: 'Phasen nach NIST: Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned.',
        effort: 8,
        delivery: 'both',
        durationWeeks: 5,
        dependsOn: []
      },
      {
        title: 'CSIRT/Incident-Response-Team benennen',
        type: 'org', priority: 'high',
        description: 'Klare Rollen und Verantwortlichkeiten, inkl. Stellvertreter und 24/7-Erreichbarkeit für kritische Fälle.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Incident-Response-Plan dokumentieren']
      },
      {
        title: 'Kommunikations- und Eskalationsmatrix',
        type: 'org', priority: 'high',
        description: 'Wer informiert wen, wann und wie? Inkl. externer Stellen (Behörden, Kunden, Dienstleister).',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['CSIRT/Incident-Response-Team benennen']
      },
      {
        title: 'Tabletop-Übungen mind. jährlich',
        type: 'change', priority: 'high',
        description: 'Trockenübungen mit realistischen Szenarien – schult Reaktionsfähigkeit und schafft Routine.',
        effort: 4,
        delivery: 'both',
        durationWeeks: 2,
        dependsOn: ['Kommunikations- und Eskalationsmatrix']
      },
      {
        title: 'Technische Tools (SIEM, SOAR, Ticketing)',
        type: 'tech', priority: 'medium',
        description: 'Werkzeuge zur Erkennung, Dokumentation und Bearbeitung von Sicherheitsvorfällen.',
        effort: 20,
        delivery: 'both',
        durationWeeks: 12,
        dependsOn: ['Incident-Response-Plan dokumentieren']
      },
      {
        title: 'Lessons-Learned-Kultur etablieren',
        type: 'change', priority: 'medium',
        description: 'Nach jedem Vorfall strukturiertes Review – ohne Schuldzuweisung, mit Fokus auf Verbesserung.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Tabletop-Übungen mind. jährlich']
      },
      {
        title: 'Playbooks für Standard-Szenarien',
        type: 'tech', priority: 'medium',
        description: 'Vorgefertigte Reaktionspläne für Phishing, Ransomware, DDoS, Datenabfluss etc.',
        effort: 6,
        delivery: 'both',
        durationWeeks: 4,
        dependsOn: ['Incident-Response-Plan dokumentieren']
      }
    ]
  },

  reporting_24h: {
    topic: 'Meldepflichten NIS-2 (24h/72h/1 Monat)',
    measures: [
      {
        title: 'Meldewege identifizieren und dokumentieren',
        type: 'org', priority: 'high',
        description: 'Zuständige Behörde (in DE: BSI), Meldeportal, erforderliche Inhalte und Formate.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: []
      },
      {
        title: 'Meldetemplates vorbereiten',
        type: 'org', priority: 'high',
        description: 'Vorgefertigte Templates für Frühwarnung (24h), vollständige Meldung (72h), Abschlussbericht (1 Monat).',
        effort: 3,
        delivery: 'both',
        durationWeeks: 2,
        dependsOn: ['Meldewege identifizieren und dokumentieren']
      },
      {
        title: 'Klare Verantwortlichkeit & Stellvertretung',
        type: 'org', priority: 'high',
        description: 'Wer darf melden, wer entscheidet? Auch außerhalb der Bürozeiten und im Urlaub klar geregelt.',
        effort: 1,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: ['Meldewege identifizieren und dokumentieren']
      },
      {
        title: 'Rechtliche Abstimmung vorab klären',
        type: 'org', priority: 'medium',
        description: 'Abstimmung mit Datenschutz und Rechtsabteilung – DSGVO-Meldungen ggf. parallel notwendig.',
        effort: 3,
        delivery: 'extern',
        durationWeeks: 2,
        dependsOn: ['Meldewege identifizieren und dokumentieren']
      },
      {
        title: 'Trockenübung Meldeprozess',
        type: 'change', priority: 'medium',
        description: 'Simulieren Sie eine Meldung im Rahmen einer Tabletop-Übung – inklusive Zeitmessung.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: ['Meldetemplates vorbereiten', 'Klare Verantwortlichkeit & Stellvertretung']
      },
      {
        title: 'Schulung der Entscheidungsträger',
        type: 'change', priority: 'medium',
        description: 'Geschäftsleitung und IT-Verantwortliche müssen Meldepflichten und persönliche Haftung kennen.',
        effort: 2,
        delivery: 'both',
        durationWeeks: 1,
        dependsOn: ['Rechtliche Abstimmung vorab klären']
      }
    ]
  },

  bcm: {
    topic: 'Business Continuity Management',
    measures: [
      {
        title: 'Business Impact Analyse (BIA) durchführen',
        type: 'org', priority: 'high',
        description: 'Kritische Geschäftsprozesse, MTPD, RTO und RPO ermitteln.',
        effort: 10,
        delivery: 'both',
        durationWeeks: 6,
        dependsOn: []
      },
      {
        title: 'Notfallhandbuch erstellen',
        type: 'org', priority: 'high',
        description: 'Dokumentierte Wiederanlaufpläne für kritische Systeme und Prozesse.',
        effort: 10,
        delivery: 'both',
        durationWeeks: 6,
        dependsOn: ['Business Impact Analyse (BIA) durchführen']
      },
      {
        title: 'Krisenstab-Struktur etablieren',
        type: 'org', priority: 'high',
        description: 'Krisenstab benennen, Räumlichkeiten/Tools (auch out-of-band) definieren, Alarmierung regeln.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Business Impact Analyse (BIA) durchführen']
      },
      {
        title: 'Notfall- und Wiederanlaufübungen',
        type: 'change', priority: 'high',
        description: 'Mind. jährliche Übungen – inkl. Ausfallszenarien (Ransomware, Stromausfall, Standortausfall).',
        effort: 5,
        delivery: 'both',
        durationWeeks: 2,
        dependsOn: ['Notfallhandbuch erstellen', 'Krisenstab-Struktur etablieren']
      },
      {
        title: 'Zertifizierung nach ISO 22301 prüfen',
        type: 'org', priority: 'low',
        description: 'Insbesondere für wesentliche Einrichtungen oder Lieferanten kritischer Sektoren empfehlenswert.',
        effort: 30,
        delivery: 'extern',
        durationWeeks: 24,
        dependsOn: ['Notfallhandbuch erstellen', 'Notfall- und Wiederanlaufübungen']
      },
      {
        title: 'Mitarbeiterkommunikation im Krisenfall',
        type: 'change', priority: 'medium',
        description: 'Alternative Kommunikationswege (Messenger, Telefonkette) etablieren und bekannt machen.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Krisenstab-Struktur etablieren']
      },
      {
        title: 'Lieferanten-Notfallpläne abstimmen',
        type: 'org', priority: 'medium',
        description: 'Kritische Lieferanten in eigenes BCM einbeziehen – inkl. Eskalationskontakte.',
        effort: 4,
        delivery: 'intern',
        durationWeeks: 4,
        dependsOn: ['Notfallhandbuch erstellen']
      }
    ]
  },

  backup: {
    topic: 'Backup & Restore',
    measures: [
      {
        title: '3-2-1-Regel umsetzen',
        type: 'tech', priority: 'high',
        description: '3 Kopien, 2 verschiedene Medien, 1 davon offsite/offline (Air-Gap, Immutable).',
        effort: 5,
        delivery: 'intern',
        durationWeeks: 3,
        dependsOn: []
      },
      {
        title: 'Immutable / Air-Gapped Backups',
        type: 'tech', priority: 'high',
        description: 'Schutz gegen Ransomware – Backups dürfen nicht durch kompromittierte Konten löschbar sein.',
        effort: 8,
        delivery: 'both',
        durationWeeks: 4,
        dependsOn: ['3-2-1-Regel umsetzen']
      },
      {
        title: 'Regelmäßige Wiederherstellungstests',
        type: 'tech', priority: 'high',
        description: 'Mind. quartalsweise vollständige Restore-Tests – Backup ohne Restore-Test ist kein Backup.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Immutable / Air-Gapped Backups']
      },
      {
        title: 'Backup-Konzept dokumentieren',
        type: 'org', priority: 'medium',
        description: 'Welche Systeme? Welche Frequenz? Aufbewahrung? RPO/RTO? Verantwortlichkeiten?',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['3-2-1-Regel umsetzen']
      },
      {
        title: 'Monitoring & Alerting für Backups',
        type: 'tech', priority: 'medium',
        description: 'Automatisierte Überwachung von Backup-Jobs, Eskalation bei Fehlschlägen.',
        effort: 4,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Immutable / Air-Gapped Backups']
      },
      {
        title: 'Verschlüsselung der Backups',
        type: 'tech', priority: 'medium',
        description: 'Auch Backups müssen at-rest verschlüsselt sein, insbesondere bei Cloud- oder Offsite-Storage.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['3-2-1-Regel umsetzen']
      }
    ]
  },

  supply_chain: {
    topic: 'Lieferantensicherheit',
    measures: [
      {
        title: 'Lieferanten-Inventar mit Kritikalitätsbewertung',
        type: 'org', priority: 'high',
        description: 'Welche Lieferanten verarbeiten Daten, haben Systemzugang oder sind betriebskritisch?',
        effort: 5,
        delivery: 'intern',
        durationWeeks: 3,
        dependsOn: []
      },
      {
        title: 'Sicherheitsanforderungen vertraglich verankern',
        type: 'org', priority: 'high',
        description: 'Mindestanforderungen, Audit-Rechte, Meldepflichten bei Vorfällen, Sub-Unternehmer-Regelung.',
        effort: 5,
        delivery: 'extern',
        durationWeeks: 6,
        dependsOn: ['Lieferanten-Inventar mit Kritikalitätsbewertung']
      },
      {
        title: 'Lieferanten-Self-Assessments',
        type: 'org', priority: 'medium',
        description: 'Standardisierte Fragebögen (z. B. VdS, TISAX, ISO 27001) für regelmäßige Bewertung.',
        effort: 4,
        delivery: 'intern',
        durationWeeks: 4,
        dependsOn: ['Lieferanten-Inventar mit Kritikalitätsbewertung']
      },
      {
        title: 'Audits bei kritischen Lieferanten',
        type: 'org', priority: 'medium',
        description: 'Vor-Ort- oder Remote-Audits, Zertifikatsprüfung (ISO 27001, SOC 2).',
        effort: 8,
        delivery: 'both',
        durationWeeks: 6,
        dependsOn: ['Lieferanten-Self-Assessments']
      },
      {
        title: 'Onboarding-Prozess Security',
        type: 'change', priority: 'medium',
        description: 'Security-Check fester Teil des Beschaffungs-/Onboarding-Prozesses – nicht nachgelagert.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Lieferanten-Inventar mit Kritikalitätsbewertung']
      },
      {
        title: 'Notfall- und Exit-Strategien',
        type: 'org', priority: 'medium',
        description: 'Was tun bei Ausfall oder Insolvenz eines kritischen Lieferanten? Datenrückgabe geregelt?',
        effort: 4,
        delivery: 'both',
        durationWeeks: 3,
        dependsOn: ['Sicherheitsanforderungen vertraglich verankern']
      },
      {
        title: 'Awareness im Einkauf',
        type: 'change', priority: 'low',
        description: 'Einkauf für Sicherheitsanforderungen sensibilisieren – „günstig" darf kein alleiniges Kriterium sein.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: ['Onboarding-Prozess Security']
      }
    ]
  },

  mfa: {
    topic: 'Multi-Faktor-Authentifizierung',
    measures: [
      {
        title: 'MFA-Strategie & Roadmap',
        type: 'org', priority: 'high',
        description: 'Stufenweise Einführung: zuerst Admin-Konten, dann Remote-Zugänge, dann alle Mitarbeitenden.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: []
      },
      {
        title: 'Phishing-resistente Verfahren bevorzugen',
        type: 'tech', priority: 'high',
        description: 'FIDO2/Passkeys statt SMS-OTP – moderne Verfahren bieten deutlich höheren Schutz.',
        effort: 5,
        delivery: 'both',
        durationWeeks: 4,
        dependsOn: ['MFA-Strategie & Roadmap']
      },
      {
        title: 'MFA für alle privilegierten Konten',
        type: 'tech', priority: 'high',
        description: 'Admin-, Service- und Notfallkonten zwingend mit MFA absichern – unabhängig vom Standort.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['MFA-Strategie & Roadmap']
      },
      {
        title: 'MFA für Cloud- und Remote-Zugänge',
        type: 'tech', priority: 'high',
        description: 'M365, VPN, RDP-Gateways, SaaS-Dienste – Mindeststandard, nicht „nice to have".',
        effort: 5,
        delivery: 'intern',
        durationWeeks: 3,
        dependsOn: ['MFA für alle privilegierten Konten']
      },
      {
        title: 'User-Communication & Schulung',
        type: 'change', priority: 'high',
        description: 'Frühzeitige Information, Anleitungen, FAQ, Hotline – sonst entstehen Frust und Workarounds.',
        effort: 4,
        delivery: 'intern',
        durationWeeks: 3,
        dependsOn: ['MFA-Strategie & Roadmap']
      },
      {
        title: 'Self-Service für Token-Reset',
        type: 'tech', priority: 'medium',
        description: 'Reduziert Support-Aufwand und sorgt für Akzeptanz, ohne Sicherheit zu kompromittieren.',
        effort: 4,
        delivery: 'both',
        durationWeeks: 3,
        dependsOn: ['MFA für Cloud- und Remote-Zugänge']
      },
      {
        title: 'Notfall-Zugangsverfahren („Break-Glass")',
        type: 'org', priority: 'medium',
        description: 'Dokumentierte Notfall-Konten, sicher hinterlegt, mit Monitoring auf Nutzung.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: ['MFA für alle privilegierten Konten']
      }
    ]
  },

  access_control: {
    topic: 'Zugriffskonzept (RBAC)',
    measures: [
      {
        title: 'Rollen- und Berechtigungskonzept',
        type: 'org', priority: 'high',
        description: 'Definition von Rollen entlang von Stellenbeschreibungen, Trennung von Funktionen (SoD).',
        effort: 10,
        delivery: 'both',
        durationWeeks: 6,
        dependsOn: []
      },
      {
        title: 'Least-Privilege-Prinzip',
        type: 'tech', priority: 'high',
        description: 'Standardrechte minimal – Erweiterungen nur bei nachgewiesenem Bedarf, dokumentiert.',
        effort: 5,
        delivery: 'intern',
        durationWeeks: 3,
        dependsOn: ['Rollen- und Berechtigungskonzept']
      },
      {
        title: 'Joiner-Mover-Leaver-Prozess',
        type: 'org', priority: 'high',
        description: 'Automatisiertes On-/Offboarding inkl. Berechtigungsänderungen bei Rollenwechsel.',
        effort: 8,
        delivery: 'both',
        durationWeeks: 5,
        dependsOn: ['Rollen- und Berechtigungskonzept']
      },
      {
        title: 'Rezertifizierung (mind. jährlich)',
        type: 'org', priority: 'medium',
        description: 'Führungskräfte bestätigen turnusmäßig die Berechtigungen ihrer Mitarbeitenden.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Joiner-Mover-Leaver-Prozess']
      },
      {
        title: 'Privileged Access Management (PAM)',
        type: 'tech', priority: 'medium',
        description: 'Tool-gestützte Verwaltung administrativer Konten inkl. Session-Recording.',
        effort: 15,
        delivery: 'both',
        durationWeeks: 10,
        dependsOn: ['Least-Privilege-Prinzip']
      },
      {
        title: 'Identity Governance Tool',
        type: 'tech', priority: 'low',
        description: 'IGA-Lösungen (z. B. SailPoint, Omada, One Identity) für größere Umgebungen sinnvoll.',
        effort: 40,
        delivery: 'extern',
        durationWeeks: 20,
        dependsOn: ['Privileged Access Management (PAM)', 'Joiner-Mover-Leaver-Prozess']
      },
      {
        title: 'Akzeptanz bei Führungskräften',
        type: 'change', priority: 'medium',
        description: 'Rezertifizierung darf nicht als „Klick-Übung" wahrgenommen werden – Bedeutung kommunizieren.',
        effort: 2,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: ['Rezertifizierung (mind. jährlich)']
      }
    ]
  },

  encryption: {
    topic: 'Verschlüsselung',
    measures: [
      {
        title: 'Kryptografie-Richtlinie',
        type: 'org', priority: 'high',
        description: 'Vorgaben zu erlaubten Algorithmen, Schlüssellängen, Verfahren (BSI TR-02102 als Referenz).',
        effort: 4,
        delivery: 'both',
        durationWeeks: 3,
        dependsOn: []
      },
      {
        title: 'Festplatten-/Geräteverschlüsselung',
        type: 'tech', priority: 'high',
        description: 'BitLocker, FileVault, LUKS für alle Endgeräte – inkl. mobiler Geräte (MDM).',
        effort: 6,
        delivery: 'intern',
        durationWeeks: 4,
        dependsOn: ['Kryptografie-Richtlinie']
      },
      {
        title: 'TLS 1.2+ für alle Übertragungen',
        type: 'tech', priority: 'high',
        description: 'Veraltete Protokolle (SSLv3, TLS 1.0/1.1) abschalten, HSTS aktivieren.',
        effort: 4,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Kryptografie-Richtlinie']
      },
      {
        title: 'Verschlüsselung von Backups & Archiven',
        type: 'tech', priority: 'high',
        description: 'At-rest-Verschlüsselung auch für Sicherungsmedien und langfristige Archivierung.',
        effort: 4,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Kryptografie-Richtlinie']
      },
      {
        title: 'Schlüsselmanagement (KMS/HSM)',
        type: 'tech', priority: 'medium',
        description: 'Zentrale Verwaltung, sichere Aufbewahrung, dokumentierter Schlüsselwechsel und -wiederherstellung.',
        effort: 12,
        delivery: 'both',
        durationWeeks: 8,
        dependsOn: ['Festplatten-/Geräteverschlüsselung', 'TLS 1.2+ für alle Übertragungen']
      },
      {
        title: 'E-Mail-Verschlüsselung für sensible Inhalte',
        type: 'tech', priority: 'medium',
        description: 'S/MIME, PGP oder sichere Datenraum-Lösung für vertrauliche Kommunikation.',
        effort: 5,
        delivery: 'both',
        durationWeeks: 3,
        dependsOn: ['Kryptografie-Richtlinie']
      },
      {
        title: 'Krypto-Agilität & Post-Quantum-Roadmap',
        type: 'org', priority: 'low',
        description: 'Strategische Vorbereitung auf Migration zu Post-Quantum-Verfahren.',
        effort: 5,
        delivery: 'extern',
        durationWeeks: 4,
        dependsOn: ['Schlüsselmanagement (KMS/HSM)']
      }
    ]
  },

  training: {
    topic: 'Awareness & Schulung',
    measures: [
      {
        title: 'Awareness-Programm aufbauen',
        type: 'org', priority: 'high',
        description: 'Jahresplan mit Themen, Zielgruppen, Formaten und KPIs – nicht nur „einmal im Jahr E-Learning".',
        effort: 6,
        delivery: 'both',
        durationWeeks: 4,
        dependsOn: []
      },
      {
        title: 'Mind. jährliche verpflichtende Schulung',
        type: 'change', priority: 'high',
        description: 'Inkl. Nachweis und Eskalation bei Nicht-Teilnahme. Pflichtmodul im LMS.',
        effort: 5,
        delivery: 'both',
        durationWeeks: 4,
        dependsOn: ['Awareness-Programm aufbauen']
      },
      {
        title: 'Phishing-Simulationen',
        type: 'tech', priority: 'high',
        description: 'Regelmäßige Simulationen mit anschließender Lerneinheit – Quote messen, ohne anzuprangern.',
        effort: 4,
        delivery: 'both',
        durationWeeks: 3,
        dependsOn: ['Awareness-Programm aufbauen']
      },
      {
        title: 'Zielgruppen-spezifische Inhalte',
        type: 'change', priority: 'medium',
        description: 'Entwickler, Einkauf, HR, Geschäftsleitung haben unterschiedliche Risiken und Bedarfe.',
        effort: 6,
        delivery: 'both',
        durationWeeks: 4,
        dependsOn: ['Awareness-Programm aufbauen']
      },
      {
        title: 'Onboarding-Schulung verpflichtend',
        type: 'org', priority: 'high',
        description: 'Sicherheitsschulung als Bestandteil der ersten Arbeitswoche, vor Erteilung sensibler Zugriffe.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Awareness-Programm aufbauen']
      },
      {
        title: 'Sicherheits-Multiplikatoren („Champions")',
        type: 'change', priority: 'medium',
        description: 'Botschafter in Fachbereichen schaffen niedrigschwellige Anlaufstellen und Akzeptanz.',
        effort: 4,
        delivery: 'intern',
        durationWeeks: 3,
        dependsOn: ['Mind. jährliche verpflichtende Schulung']
      },
      {
        title: 'Positive Sicherheitskultur fördern',
        type: 'change', priority: 'medium',
        description: 'Melden von Vorfällen belohnen statt sanktionieren – „No-Blame-Culture" leben.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 4,
        dependsOn: ['Sicherheits-Multiplikatoren („Champions")']
      },
      {
        title: 'KPIs & Wirksamkeitsmessung',
        type: 'org', priority: 'low',
        description: 'Phishing-Klickrate, Meldequote, Schulungsabschluss – Awareness messbar machen.',
        effort: 3,
        delivery: 'intern',
        durationWeeks: 2,
        dependsOn: ['Phishing-Simulationen', 'Mind. jährliche verpflichtende Schulung']
      }
    ]
  },

  management_training: {
    topic: 'Schulung der Geschäftsleitung',
    measures: [
      {
        title: 'Maßgeschneidertes Executive-Briefing',
        type: 'change', priority: 'high',
        description: 'Kompakt, business-relevant: NIS-2-Pflichten, Haftung, strategische Risiken – keine reine Technik.',
        effort: 3,
        delivery: 'both',
        durationWeeks: 2,
        dependsOn: []
      },
      {
        title: 'Persönliche Haftung thematisieren',
        type: 'org', priority: 'high',
        description: 'Art. 20 NIS-2: Geschäftsleitung haftet persönlich – muss bekannt und verstanden sein.',
        effort: 1,
        delivery: 'extern',
        durationWeeks: 1,
        dependsOn: ['Maßgeschneidertes Executive-Briefing']
      },
      {
        title: 'Teilnahme dokumentieren',
        type: 'org', priority: 'high',
        description: 'Schulungsnachweise verbindlich aufbewahren – im Ernstfall haftungsrelevant.',
        effort: 1,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: ['Maßgeschneidertes Executive-Briefing']
      },
      {
        title: 'Regelmäßige Updates (mind. jährlich)',
        type: 'change', priority: 'medium',
        description: 'Bedrohungslage und Regulatorik ändern sich – einmalige Schulung reicht nicht.',
        effort: 2,
        delivery: 'both',
        durationWeeks: 1,
        dependsOn: ['Maßgeschneidertes Executive-Briefing']
      },
      {
        title: 'Krisenstab-/Tabletop-Übung mit Geschäftsleitung',
        type: 'change', priority: 'high',
        description: 'Praxisnahe Erfahrung der eigenen Rolle im Ernstfall – schafft Verständnis und Commitment.',
        effort: 4,
        delivery: 'both',
        durationWeeks: 2,
        dependsOn: ['Persönliche Haftung thematisieren']
      },
      {
        title: 'Cybersicherheit als regelmäßiger Vorstandsagenda-Punkt',
        type: 'org', priority: 'medium',
        description: 'Monatliches/quartalsweises Reporting an die Geschäftsleitung etablieren.',
        effort: 1,
        delivery: 'intern',
        durationWeeks: 1,
        dependsOn: ['Maßgeschneidertes Executive-Briefing']
      }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Kontext-Helpers: Unternehmensprofil aus den Antworten ableiten
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Liest das Unternehmensprofil aus den Assessment-Antworten aus.
 * Gibt ein Objekt zurück:
 *   size:        'small' | 'medium' | 'large'
 *   criticality: 'essential' | 'important' | 'none'
 *   industry:    string (value aus questions)
 */
function deriveProfile(questions, answers) {
  const employeeQ = questions.find(q => q.id === 'employees');
  const revenueQ  = questions.find(q => q.id === 'revenue');
  const industryQ = questions.find(q => q.id === 'industry');

  const employeeOpt = employeeQ?.options.find(o => o.value === answers['employees']);
  const revenueOpt  = revenueQ?.options.find(o => o.value === answers['revenue']);
  const industryOpt = industryQ?.options.find(o => o.value === answers['industry']);

  // Größe: das Maximum aus Mitarbeiter- und Umsatzgröße
  const sizeOrder = { small: 0, medium: 1, large: 2 };
  const empSize = employeeOpt?.size ?? 'small';
  const revSize = revenueOpt?.size ?? 'small';
  const size = sizeOrder[empSize] >= sizeOrder[revSize] ? empSize : revSize;

  return {
    size,                                          // 'small' | 'medium' | 'large'
    criticality: industryOpt?.criticality ?? 'none', // 'essential' | 'important' | 'none'
    industry: industryOpt?.value ?? 'sonstiges'
  };
}

/**
 * Skaliert den Aufwand (Personentage) und die Dauer (Wochen)
 * abhängig von Unternehmensgröße und Branchenkritikalität.
 *
 * Faktoren:
 *   Größe small   → 0.6×  (weniger Systeme, weniger Stakeholder)
 *   Größe medium  → 1.0×  (Basiswert)
 *   Größe large   → 1.8×  (mehr Systeme, mehr Abstimmung)
 *
 *   Kritikalität essential → +25 % zusätzlich (strengere Anforderungen, mehr Dokumentation)
 *   Kritikalität important → +10 % zusätzlich
 */
function scaleEffort(basePt, baseWeeks, profile) {
  const sizeFactor = { small: 0.6, medium: 1.0, large: 1.8 }[profile.size] ?? 1.0;
  const critFactor = { essential: 1.25, important: 1.10, none: 1.0 }[profile.criticality] ?? 1.0;

  const factor = sizeFactor * critFactor;
  return {
    effortPT: Math.round(basePt * factor),
    durationWeeks: Math.round(baseWeeks * Math.sqrt(factor)) // Dauer skaliert weniger aggressiv
  };
}

/**
 * Passt die delivery-Empfehlung kontextabhängig an.
 *
 * Kleine Unternehmen haben oft keine eigene IT-Sicherheitsabteilung →
 * 'intern' wird zu 'both', da externe Unterstützung wahrscheinlich sinnvoll ist.
 *
 * Wesentliche Einrichtungen sollten für regulatorisch kritische Themen
 * externe Expertise (Auditoren, Anwälte) hinzuziehen.
 */
function adjustDelivery(baseDelivery, profile) {
  if (profile.size === 'small' && baseDelivery === 'intern') {
    return 'both'; // Kleine Unternehmen profitieren oft von externer Unterstützung
  }
  if (profile.criticality === 'essential' && baseDelivery === 'intern') {
    return 'both'; // Wesentliche Einrichtungen benötigen i. d. R. externe Validierung
  }
  return baseDelivery;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hauptfunktion
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Liefert kontextualisierte Maßnahmen für Fragen, die nicht mit Maximum
 * beantwortet wurden. Alle Aufwands- und Dauerangaben sind an das
 * Unternehmensprofil angepasst.
 */
export function getRelevantMeasures(questions, answers) {
  const profile = deriveProfile(questions, answers);
  const result  = [];

  questions.forEach(q => {
    if (!measures[q.id]) return;

    const scoredOptions = q.options.filter(o => o.score !== undefined);
    if (scoredOptions.length === 0) return;

    const maxScore     = Math.max(...scoredOptions.map(o => o.score));
    const answer       = answers[q.id];
    const selected     = q.options.find(o => o.value === answer);
    const achievedScore = selected?.score ?? 0;

    if (achievedScore < maxScore) {
      const gap = maxScore - achievedScore;
      let sectionPriority = 'low';
      if (gap >= maxScore * 0.7) sectionPriority = 'high';
      else if (gap >= maxScore * 0.3) sectionPriority = 'medium';

      // Maßnahmen kontextualisieren
      const contextualizedMeasures = measures[q.id].measures.map(m => {
        const { effortPT, durationWeeks } = scaleEffort(m.effort, m.durationWeeks, profile);
        const delivery = adjustDelivery(m.delivery, profile);
        return {
          ...m,
          effortPT,
          durationWeeks,
          delivery
        };
      });

      result.push({
        questionId: q.id,
        category: q.category,
        question: q.text,
        currentAnswer: selected?.label || 'Nicht beantwortet',
        achievedScore,
        maxScore,
        sectionPriority,
        topic: measures[q.id].topic,
        measures: contextualizedMeasures,
        // Profil-Kontext für die View
        profile
      });
    }
  });

  // Sortierung: high > medium > low
  const order = { high: 0, medium: 1, low: 2 };
  return result.sort((a, b) => order[a.sectionPriority] - order[b.sectionPriority]);
}