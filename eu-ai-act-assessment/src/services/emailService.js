const MAIL_API = import.meta.env.DEV
  ? 'http://localhost:3001/api/send-email'
  : '/api/send-email';

export async function isEmailConfigured() {
  try {
    const healthUrl = import.meta.env.DEV ? 'http://localhost:3001/api/health' : '/api/health';
    const res = await fetch(healthUrl, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

function buildCustomerHTML(contactData, answers, scoreData, summary) {
  const { riskLevel, riskMeta, maturity, rating, actionNeed, gaps, allMeasures } = scoreData;

  const actionColors = { hoch: '#e30613', mittel: '#e67e22', gering: '#27ae60' };
  const actionColor  = actionColors[actionNeed] || '#999';

  const byHorizon = h => allMeasures.filter(m => m.horizon === h);
  const kurzfristig  = byHorizon('kurzfristig');
  const mittelfristig = byHorizon('mittelfristig');
  const strategisch  = byHorizon('strategisch');

  const topGaps = [...gaps]
    .sort((a, b) => ({ hoch: 0, mittel: 1, niedrig: 2 }[a.prio] - { hoch: 0, mittel: 1, niedrig: 2 }[b.prio]))
    .slice(0, 8);

  const prioBg = { hoch: '#fef2f2', mittel: '#fffbeb', niedrig: '#f0fdf4' };
  const prioColor = { hoch: '#b91c1c', mittel: '#b45309', niedrig: '#15803d' };

  const measureRows = (list) => list.map(m => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1f1f1f;font-weight:600;">${m.title}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#6f6f6f;">${m.description}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#6f6f6f;white-space:nowrap;">${m.owner}</td>
    </tr>
  `).join('');

  const measureSection = (title, color, list) => list.length === 0 ? '' : `
    <h3 style="margin:24px 0 8px;font-size:15px;color:${color};">${title} (${list.length})</h3>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e2e2e2;border-radius:8px;overflow:hidden;margin-bottom:16px;">
      <thead>
        <tr style="background:${color};color:#fff;">
          <th style="padding:8px 12px;text-align:left;font-size:12px;font-weight:700;">Maßnahme</th>
          <th style="padding:8px 12px;text-align:left;font-size:12px;font-weight:700;">Beschreibung</th>
          <th style="padding:8px 12px;text-align:left;font-size:12px;font-weight:700;">Verantwortlich</th>
        </tr>
      </thead>
      <tbody>${measureRows(list)}</tbody>
    </table>
  `;

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Ihr EU AI Act Readiness Assessment</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1f1f1f,#2b2b2b);border-radius:12px 12px 0 0;padding:32px;text-align:center;">
          <div style="display:inline-block;background:#e30613;color:#fff;font-size:11px;font-weight:800;letter-spacing:1.5px;padding:4px 14px;border-radius:999px;text-transform:uppercase;margin-bottom:16px;">
            EU AI ACT · READINESS ASSESSMENT
          </div>
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Ihre persönliche Auswertung</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.6);font-size:14px;">
            Erstellt am ${new Date().toLocaleDateString('de-DE')} für ${contactData.name}
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e2e2e2;border-top:none;">

          <p style="margin:0 0 20px;font-size:16px;color:#1f1f1f;line-height:1.6;">
            Guten Tag ${contactData.name},<br><br>
            vielen Dank für die Teilnahme an unserem EU AI Act Readiness Assessment.
            Hier ist Ihre vollständige Auswertung.
          </p>

          <!-- Kontaktdaten -->
          <div style="background:#f4f4f4;border-radius:10px;padding:16px 20px;margin-bottom:24px;border:1px solid #e2e2e2;">
            <div style="font-size:11px;font-weight:700;color:#6f6f6f;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Ihre Angaben</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                ${[
                  ['Name',        contactData.name],
                  ['Unternehmen', contactData.company || '—'],
                  ['E-Mail',      contactData.email],
                  ['Telefon',     contactData.phone || '—'],
                ].map(([label, val]) => `
                  <td style="padding:0 8px 0 0;vertical-align:top;width:25%;">
                    <div style="background:#fff;border-radius:7px;padding:10px 12px;border:1px solid #e2e2e2;">
                      <div style="font-size:10px;color:#aaa;font-weight:700;text-transform:uppercase;margin-bottom:3px;">${label}</div>
                      <div style="font-size:13px;color:#1f1f1f;">${val}</div>
                    </div>
                  </td>`).join('')}
              </tr>
            </table>
          </div>

          <!-- Score Cards -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td width="33%" style="padding:0 6px 0 0;">
                <div style="background:#f4f4f4;border:1px solid #e2e2e2;border-radius:10px;padding:16px;text-align:center;">
                  <div style="font-size:11px;font-weight:700;color:#6f6f6f;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Reifegrad</div>
                  <div style="font-size:32px;font-weight:800;color:#e30613;line-height:1;">${maturity}%</div>
                  <div style="font-size:12px;color:#6f6f6f;margin-top:4px;">${rating.label}</div>
                </div>
              </td>
              <td width="33%" style="padding:0 3px;">
                <div style="background:#f4f4f4;border:1px solid #e2e2e2;border-radius:10px;padding:16px;text-align:center;">
                  <div style="font-size:11px;font-weight:700;color:#6f6f6f;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Handlungsbedarf</div>
                  <div style="font-size:22px;font-weight:800;color:${actionColor};text-transform:uppercase;line-height:1;">${actionNeed}</div>
                </div>
              </td>
              <td width="33%" style="padding:0 0 0 6px;">
                <div style="background:#f4f4f4;border:1px solid #e2e2e2;border-radius:10px;padding:16px;text-align:center;">
                  <div style="font-size:11px;font-weight:700;color:#6f6f6f;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Maßnahmen</div>
                  <div style="font-size:32px;font-weight:800;color:#e30613;line-height:1;">${allMeasures.length}</div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Risk Banner -->
          <div style="background:${riskMeta.bg};border:2px solid ${riskMeta.color};border-radius:10px;padding:16px;margin-bottom:24px;text-align:center;">
            <div style="display:inline-block;background:${riskMeta.color};color:#fff;font-size:11px;font-weight:800;padding:3px 12px;border-radius:999px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
              ${riskMeta.badge}
            </div>
            <div style="font-size:18px;font-weight:700;color:${riskMeta.color};margin-bottom:6px;">${riskMeta.label}</div>
            <div style="font-size:13px;color:#6f6f6f;line-height:1.5;">${riskMeta.summary}</div>
          </div>

          <!-- Executive Summary -->
          <div style="background:#f4f4f4;border:1px solid #e2e2e2;border-radius:10px;padding:20px;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:700;color:#e30613;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">Executive Summary</div>
            <p style="margin:0 0 10px;font-size:14px;color:#1f1f1f;line-height:1.65;">${summary}</p>
          </div>

          <!-- Top Gaps -->
          ${topGaps.length > 0 ? `
          <h2 style="margin:0 0 12px;font-size:17px;color:#1f1f1f;">Top Compliance-Risiken</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e2e2;border-radius:8px;overflow:hidden;margin-bottom:24px;">
            <thead>
              <tr style="background:#e30613;color:#fff;">
                <th style="padding:8px 12px;text-align:left;font-size:12px;font-weight:700;">#</th>
                <th style="padding:8px 12px;text-align:left;font-size:12px;font-weight:700;">Compliance-Risiko</th>
                <th style="padding:8px 12px;text-align:left;font-size:12px;font-weight:700;">Bereich</th>
                <th style="padding:8px 12px;text-align:left;font-size:12px;font-weight:700;">Priorität</th>
              </tr>
            </thead>
            <tbody>
              ${topGaps.map((g, i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'};">
                <td style="padding:10px 12px;font-size:13px;color:#6f6f6f;font-weight:700;">${i + 1}</td>
                <td style="padding:10px 12px;font-size:13px;color:#1f1f1f;font-weight:600;">${g.label}</td>
                <td style="padding:10px 12px;font-size:12px;color:#6f6f6f;">${g.area}</td>
                <td style="padding:10px 12px;">
                  <span style="background:${prioBg[g.prio]};color:${prioColor[g.prio]};font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;text-transform:uppercase;">${g.prio}</span>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
          ` : ''}

          <!-- Measures -->
          <h2 style="margin:0 0 8px;font-size:17px;color:#1f1f1f;">Ihr Maßnahmenplan</h2>
          ${measureSection('Sofortmaßnahmen (0–3 Monate)', '#e30613', kurzfristig)}
          ${measureSection('Mittelfristige Maßnahmen (3–12 Monate)', '#e67e22', mittelfristig)}
          ${measureSection('Strategische Maßnahmen (> 12 Monate)', '#27ae60', strategisch)}

          <!-- CTA -->
          <div style="background:linear-gradient(135deg,#1f1f1f,#2b2b2b);border-radius:10px;padding:24px;text-align:center;margin-top:24px;">
            <h3 style="margin:0 0 8px;color:#fff;font-size:17px;">Unterstützung bei der Umsetzung</h3>
            <p style="margin:0 0 16px;color:rgba(255,255,255,0.7);font-size:13px;line-height:1.55;">
              elpix begleitet Unternehmen auf dem Weg zur EU AI Act Compliance.
            </p>
            <a href="https://elpix.ag" style="display:inline-block;background:#e30613;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
              Beratungsgespräch anfragen →
            </a>
          </div>

          <p style="margin:24px 0 0;font-size:12px;color:#aaa;text-align:center;line-height:1.6;">
            Dieses Assessment dient als erste Orientierung und ersetzt keine rechtverbindliche Prüfung.<br>
            © ${new Date().getFullYear()} elpix AG · Alle Rechte vorbehalten
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildInternalHTML(contactData, answers, scoreData) {
  const { riskLevel, riskMeta, maturity, rating, actionNeed, gaps } = scoreData;
  const rows = [
    ['Name', contactData.name],
    ['Unternehmen', contactData.company],
    ['E-Mail', contactData.email],
    ['Telefon', contactData.phone],
    ['Risikoeinstufung', riskMeta.label],
    ['Reifegrad', `${maturity}% (${rating.label})`],
    ['Handlungsbedarf', actionNeed.toUpperCase()],
    ['Compliance-Lücken', `${gaps.length} (davon ${gaps.filter(g => g.prio === 'hoch').length} hoch)`],
    ['Datum', new Date().toLocaleString('de-DE')],
  ];

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><title>Neue Assessment-Anfrage</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f4;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e2e2e2;overflow:hidden;">
    <div style="background:#e30613;padding:20px 24px;">
      <h2 style="margin:0;color:#fff;font-size:18px;">Neue EU AI Act Assessment-Anfrage</h2>
    </div>
    <div style="padding:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${rows.map(([k, v]) => `
        <tr>
          <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#6f6f6f;width:40%;border-bottom:1px solid #f0f0f0;">${k}</td>
          <td style="padding:8px 12px;font-size:13px;color:#1f1f1f;border-bottom:1px solid #f0f0f0;">${v}</td>
        </tr>`).join('')}
      </table>
    </div>
  </div>
</body>
</html>`;
}

export async function sendResultEmails(contactData, answers, scoreData, summary) {
  const customerHTML = buildCustomerHTML(contactData, answers, scoreData, summary);
  const internalHTML = buildInternalHTML(contactData, answers, scoreData);

  const res = await fetch(MAIL_API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to:              contactData.email,
      toName:          contactData.name,
      subject:         `Ihr EU AI Act Readiness Assessment – ${scoreData.riskMeta.label}`,
      html:            customerHTML,
      ccInternal:      true,
      internalSubject: `[EU AI Act Lead] ${contactData.name}${contactData.company ? ' · ' + contactData.company : ''} – ${scoreData.maturity}% / ${scoreData.riskMeta.label}`,
      internalHtml:    customerHTML,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return { success: true };
}
