/**
 * Generates a structured executive summary from assessment data.
 * Returns { ratingLabel, ratingColor, nis2StatusClass, sections[] }
 * where each section has { headline, body }.
 * Used by both the frontend preview and the HTML email renderer.
 */
export function generateExecutiveSummary(questions, answers, relevantMeasures, scoreData) {
  const { percentage, achievedScore, maxScore, nis2Status } = scoreData;

  const industryOpt  = questions.find(q => q.id === 'industry')?.options.find(o => o.value === answers['industry']);
  const employeeOpt  = questions.find(q => q.id === 'employees')?.options.find(o => o.value === answers['employees']);

  const ratingLabel = percentage >= 85 ? 'Ausgezeichnet'
                    : percentage >= 65 ? 'Gut'
                    : percentage >= 40 ? 'Verbesserungswürdig'
                    : 'Kritisch';

  const ratingColor = percentage >= 85 ? '#16a34a'
                    : percentage >= 65 ? '#4f8f52'
                    : percentage >= 40 ? '#d18b00'
                    : '#e30613';

  const highPrio   = relevantMeasures.filter(m => m.sectionPriority === 'high');
  const medPrio    = relevantMeasures.filter(m => m.sectionPriority === 'medium');
  const totalMeas  = relevantMeasures.reduce((s, m) => s + m.measures.length, 0);

  const topTopics  = highPrio.slice(0, 3).map(m => m.topic);
  const isEssential = nis2Status.includes('Wesentliche');
  const isImportant = nis2Status.includes('Wichtige');

  // ── Paragraph 1: NIS-2 Classification ──────────────────────────────────
  let classificationBody;
  if (isEssential) {
    classificationBody =
      `Ihr Unternehmen fällt als wesentliche Einrichtung unter die strengsten Anforderungen der NIS-2-Richtlinie. ` +
      `Dies umfasst verbindliche Sicherheitsmaßnahmen gemäß Art. 21 NIS-2, eine persönliche Haftung der Geschäftsleitung ` +
      `nach Art. 20 sowie die Pflicht zur Frühwarnung bei Sicherheitsvorfällen innerhalb von 24 Stunden. ` +
      `Behördliche Inspektionen und Sanktionen bei Nichterfüllung sind ausdrücklich vorgesehen.`;
  } else if (isImportant) {
    classificationBody =
      `Ihr Unternehmen ist als wichtige Einrichtung von der NIS-2-Richtlinie erfasst. ` +
      `Sie sind zur Umsetzung wesentlicher Sicherheitsmaßnahmen, zur Erfüllung von Meldepflichten ` +
      `und zur Benennung verantwortlicher Personen verpflichtet. ` +
      `Aufsichtsbehörden können Nachweise einfordern und bei Verstößen Sanktionen verhängen.`;
  } else if (nis2Status.includes('Größenkriterium')) {
    classificationBody =
      `Nach aktuellem Stand erfüllen Sie das Größenkriterium der NIS-2-Richtlinie noch nicht. ` +
      `Dennoch sollten Sie die regulatorische Entwicklung im Blick behalten: ` +
      `Lieferanten und Geschäftspartner, die selbst unter NIS-2 fallen, werden Sicherheitsanforderungen ` +
      `vertraglich an ihre Zulieferer weitergeben. Eine proaktive Aufstellung schützt Ihre Wettbewerbsfähigkeit.`;
  } else {
    classificationBody =
      `Auf Basis Ihrer Angaben sind Sie voraussichtlich nicht direkt von der NIS-2-Richtlinie betroffen. ` +
      `Dennoch empfehlen wir, Ihre Cybersicherheit systematisch zu stärken – ` +
      `sowohl zum Schutz Ihres Unternehmens als auch im Hinblick auf steigende Anforderungen aus Lieferketten ` +
      `und Kundenverträgen.`;
  }

  // ── Paragraph 2: Maturity Assessment ───────────────────────────────────
  let maturityBody;
  if (percentage >= 85) {
    maturityBody =
      `Mit einem Reifegrad von ${percentage} % weist Ihr Unternehmen eine hervorragende Cybersicherheitspostur auf. ` +
      `Die wesentlichen Kontrollmechanismen sind etabliert und dokumentiert. ` +
      `Ihr Fokus sollte auf der formalen Zertifizierung bestehender Praktiken und der ` +
      `kontinuierlichen Weiterentwicklung im Kontext neuer Bedrohungslagen liegen.`;
  } else if (percentage >= 65) {
    maturityBody =
      `Mit ${percentage} % Reifegrad verfügt Ihr Unternehmen über eine solide Grundlage. ` +
      `Einzelne Bereiche sind bereits gut abgedeckt, in anderen bestehen jedoch noch strukturelle Lücken. ` +
      `Mit gezielten Maßnahmen können Sie die verbleibenden Anforderungen effizient schließen ` +
      `und eine vollständige NIS-2-Konformität erreichen.`;
  } else if (percentage >= 40) {
    maturityBody =
      `Ihr Reifegrad von ${percentage} % zeigt, dass erste Maßnahmen ergriffen wurden, ` +
      `jedoch in mehreren kritischen Bereichen erhebliche Lücken bestehen. ` +
      `Ohne strukturierte Intervention besteht das Risiko von Sicherheitsvorfällen, ` +
      `regulatorischen Sanktionen und Reputationsschäden. ` +
      `Eine priorisierte Umsetzung ist dringend empfehlenswert.`;
  } else {
    maturityBody =
      `Der Reifegrad von ${percentage} % signalisiert erheblichen Handlungsbedarf. ` +
      `In nahezu allen untersuchten Bereichen bestehen grundlegende Lücken, ` +
      `die Ihr Unternehmen einem erhöhten Cyberrisiko und – sofern NIS-2 anwendbar ist – ` +
      `einem signifikanten regulatorischen Risiko aussetzen. ` +
      `Wir empfehlen, unverzüglich mit der Umsetzung der höchst priorisierten Maßnahmen zu beginnen.`;
  }

  // ── Paragraph 3: Top Risk Areas ────────────────────────────────────────
  let riskBody = '';
  if (highPrio.length > 0) {
    const listed = topTopics.join(', ');
    const more   = highPrio.length > 3 ? ` sowie ${highPrio.length - 3} weitere Bereiche` : '';
    riskBody =
      `Die kritischsten Handlungsfelder mit unmittelbarem Handlungsbedarf sind: ${listed}${more}. ` +
      `Diese Bereiche weisen die größten Abweichungen vom geforderten Sicherheitsniveau auf ` +
      `und sollten priorisiert adressiert werden.`;
  } else if (medPrio.length > 0) {
    riskBody =
      `In den untersuchten Bereichen bestehen vereinzelte Lücken mit mittlerer Priorität. ` +
      `Eine strukturierte Weiterentwicklung in diesen Feldern ist empfehlenswert, ` +
      `um das Sicherheitsniveau nachhaltig zu stabilisieren.`;
  } else {
    riskBody =
      `In den untersuchten Bereichen wurden keine kritischen Lücken identifiziert. ` +
      `Wir empfehlen, den aktuellen Stand zu dokumentieren und regelmäßig zu überprüfen.`;
  }

  // ── Paragraph 4: Impact & Consequence ──────────────────────────────────
  let impactBody;
  if (isEssential || isImportant) {
    if (percentage < 50) {
      impactBody =
        `Bei wesentlichen und wichtigen Einrichtungen können Verstöße gegen NIS-2 ` +
        `zu Bußgeldern von bis zu 10 Mio. € (wesentlich) bzw. 7 Mio. € (wichtig) oder 2 % des weltweiten Jahresumsatzes führen. ` +
        `Darüber hinaus haftet die Geschäftsleitung persönlich für die Einhaltung. ` +
        `Ein Sicherheitsvorfall ohne angemessene Schutzmaßnahmen kann zudem zu Betriebsunterbrechungen, ` +
        `Datenverlust und nachhaltigem Vertrauensverlust führen.`;
    } else {
      impactBody =
        `Auch bei einem soliden Reifegrad bleibt das regulatorische Risiko für betroffene Einrichtungen bestehen. ` +
        `Die Schließung der verbleibenden Lücken reduziert nicht nur das Haftungsrisiko für die Geschäftsleitung, ` +
        `sondern stärkt auch die operative Resilienz Ihres Unternehmens gegenüber Cyberangriffen.`;
    }
  } else {
    impactBody =
      `Eine robuste Cybersicherheitsstrategie schützt Ihr Unternehmen vor finanziellen Schäden durch Cyberangriffe, ` +
      `die laut aktuellen Studien im Mittelstand durchschnittlich sechsstellige Beträge verursachen. ` +
      `Darüber hinaus sichert eine nachgewiesene Sicherheitsreife Ihre Position als vertrauenswürdiger ` +
      `Geschäftspartner und Lieferant.`;
  }

  // ── Paragraph 5: Recommended Next Steps ────────────────────────────────
  const nextStepsBody =
    totalMeas > 0
      ? `Auf Basis dieser Analyse wurden ${totalMeas} konkrete Maßnahmen in ${relevantMeasures.length} Handlungsfeldern identifiziert` +
        (highPrio.length > 0 ? `, davon ${highPrio.length} mit hoher Priorität` : '') +
        `. Die vollständige Auswertung mit priorisierten Handlungsempfehlungen, Aufwandsschätzungen ` +
        `und einem Umsetzungs-Zeitplan erhalten Sie in der detaillierten Ergebnisübersicht. ` +
        `Das elpix-Team steht Ihnen für eine persönliche Beratung gerne zur Verfügung.`
      : `Ihr Unternehmen hat in den bewerteten Bereichen bereits ein hohes Niveau erreicht. ` +
        `Das elpix-Team berät Sie gerne zu weiterführenden Maßnahmen und Zertifizierungsoptionen.`;

  return {
    ratingLabel,
    ratingColor,
    sections: [
      { headline: 'NIS-2 Einstufung & regulatorische Bedeutung', body: classificationBody },
      { headline: 'Aktueller Reifegrad',                          body: maturityBody },
      { headline: 'Kritische Handlungsfelder',                    body: riskBody },
      { headline: 'Risiken und Handlungskonsequenzen',            body: impactBody },
      { headline: 'Empfohlene nächste Schritte',                  body: nextStepsBody },
    ],
  };
}
