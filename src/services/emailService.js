// ─── E-Mail Service ───────────────────────────────────────────────────────
//
// Sendet E-Mails über den lokalen Mail-Server (server.js).
// Starten Sie diesen parallel zum Vite Dev-Server:
//
//   Terminal 1:  npm run dev
//   Terminal 2:  node server.js
//
// Für den Produktionsbetrieb: node server.js dauerhaft als Dienst laufen
// lassen (z. B. pm2, systemd oder als separater Prozess auf dem Server).
// ─────────────────────────────────────────────────────────────────────────

const MAIL_API = import.meta.env.DEV
  ? 'http://localhost:3001/api/send-email'
  : '/api/send-email';
const ELPIX_EMAIL = 'infosec@elpix.ag';
const EMAIL_SUBJECT = 'Ihr NIS-2 Readiness Assessment – Vollständige Auswertung';

// ─── Prüfen ob Mail-Server erreichbar ist ────────────────────────────────
export async function isEmailConfigured() {
  try {
    const healthUrl = import.meta.env.DEV ? 'http://localhost:3001/api/health' : '/api/health';
    const res = await fetch(healthUrl, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Priority helpers ─────────────────────────────────────────────────────
function prioColor(p)  { return p === 'high' ? '#FF4338' : p === 'medium' ? '#d97706' : '#16a34a'; }
function prioLabel(p)  { return p === 'high' ? 'Hoch'    : p === 'medium' ? 'Mittel'  : 'Niedrig'; }
function typeLabel(t)  { return t === 'tech' ? 'Technisch' : t === 'org' ? 'Organisatorisch' : 'Change & Adoption'; }

// ─── Kunden-E-Mail (vollständiger Bericht) ───────────────────────────────
function buildCustomerHTML(contactData, questions, answers, relevantMeasures, scoreData, summary) {
  const { name, company, email, phone } = contactData;
  const { percentage, achievedScore, maxScore, nis2Status } = scoreData;

  const ratingLabel = summary?.ratingLabel ?? (
    percentage >= 85 ? 'Ausgezeichnet' : percentage >= 65 ? 'Gut' :
    percentage >= 40 ? 'Verbesserungswürdig' : 'Kritisch'
  );
  const ratingColor = percentage >= 85 ? '#16a34a' : percentage >= 65 ? '#4f8f52' :
                      percentage >= 40 ? '#d18b00' : '#FF4338';

  const totalMeasures = relevantMeasures.reduce((s, m) => s + m.measures.length, 0);
  const highPrioCount = relevantMeasures.filter(m => m.sectionPriority === 'high').length;
  const totalEffort   = relevantMeasures.reduce((s, sec) => s + sec.measures.reduce((ss, m) => ss + (m.effortPT || 0), 0), 0);

  const summaryHTML = summary?.sections?.map(sec => `
    <div style="margin-bottom:1.25rem;padding:1rem 1.2rem;background:#f9fafb;border-radius:8px;border-left:3px solid #FF4338;">
      <div style="font-size:0.72rem;font-weight:700;color:#FF4338;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem;">${sec.headline}</div>
      <p style="margin:0;font-size:0.9rem;color:#374151;line-height:1.7;">${sec.body}</p>
    </div>`).join('') ?? '';

  const measureRows = relevantMeasures.slice(0, 8).map(s => `
    <tr>
      <td style="padding:0.65rem 0.8rem;border-bottom:1px solid #e2e2e2;font-size:0.87rem;color:#1f1f1f;">${s.topic}</td>
      <td style="padding:0.65rem 0.8rem;border-bottom:1px solid #e2e2e2;">
        <span style="background:${prioColor(s.sectionPriority)}18;color:${prioColor(s.sectionPriority)};border:1px solid ${prioColor(s.sectionPriority)}44;padding:0.15rem 0.6rem;border-radius:999px;font-size:0.75rem;font-weight:700;">${prioLabel(s.sectionPriority)}</span>
      </td>
      <td style="padding:0.65rem 0.8rem;border-bottom:1px solid #e2e2e2;font-size:0.82rem;color:#6f6f6f;">${s.measures.length} Maßnahmen</td>
    </tr>`).join('');

  const detailHTML = relevantMeasures.map(s => `
    <div style="margin-bottom:1.5rem;">
      <div style="background:#1f1f1f;border-radius:8px 8px 0 0;padding:0.75rem 1rem;display:flex;align-items:center;gap:0.75rem;">
        <div style="width:4px;height:20px;border-radius:3px;background:${prioColor(s.sectionPriority)};flex-shrink:0;"></div>
        <div>
          <div style="font-size:0.7rem;color:#aaa;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${s.category}</div>
          <div style="font-size:0.95rem;font-weight:700;color:#fff;">${s.topic}</div>
        </div>
        <span style="margin-left:auto;background:${prioColor(s.sectionPriority)}22;color:${prioColor(s.sectionPriority)};border:1px solid ${prioColor(s.sectionPriority)}44;padding:0.15rem 0.6rem;border-radius:999px;font-size:0.75rem;font-weight:700;">${prioLabel(s.sectionPriority)}</span>
      </div>
      <div style="border:1px solid #e2e2e2;border-top:none;border-radius:0 0 8px 8px;overflow:hidden;">
        ${s.measures.map((m, mi) => `
          <div style="padding:0.85rem 1rem;background:${mi % 2 === 0 ? '#ffffff' : '#f9fafb'};border-bottom:1px solid #f0f0f0;">
            <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:0.4rem;">
              <span style="font-size:0.7rem;padding:0.12rem 0.5rem;border-radius:4px;background:#3b82f622;color:#1d4ed8;border:1px solid #3b82f644;">${typeLabel(m.type)}</span>
              <span style="font-size:0.7rem;padding:0.12rem 0.5rem;border-radius:4px;background:${prioColor(m.priority)}22;color:${prioColor(m.priority)};border:1px solid ${prioColor(m.priority)}44;">${prioLabel(m.priority)}</span>
              <span style="font-size:0.7rem;padding:0.12rem 0.5rem;border-radius:4px;background:#55555522;color:#6f6f6f;border:1px solid #55555544;">⏱ ${m.effortPT} PT · 📅 ${m.durationWeeks} Wo.</span>
            </div>
            <div style="font-weight:700;font-size:0.9rem;color:#1f1f1f;margin-bottom:0.25rem;">${m.title}</div>
            <p style="margin:0;font-size:0.83rem;color:#6f6f6f;line-height:1.55;">${m.description}</p>
            ${m.dependsOn?.length > 0 ? `<p style="margin:0.35rem 0 0;font-size:0.75rem;color:#94a3b8;">⛓ Voraussetzung: ${m.dependsOn.join(' → ')}</p>` : ''}
          </div>`).join('')}
      </div>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:680px;margin:0 auto;padding:1.5rem 1rem;">

  <div style="background-color:#FF4338;border-radius:12px 12px 0 0;padding:0;">
    <!-- Logo-Bereich -->
    <div style="padding:1.25rem 2rem 0.75rem;border-bottom:1px solid rgba(255,255,255,0.2);">
      <img src="https://quick-check.elpix.ag/logo.png" alt="elpix AG" style="height:32px;width:auto;display:block;filter:brightness(0) invert(1);" />
    </div>
    <!-- Titel-Bereich -->
    <div style="padding:1.5rem 2rem 1.75rem;">
      <div style="display:inline-block;background:rgba(255,255,255,0.2);color:#fff;font-size:0.65rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:0.2rem 0.6rem;border-radius:4px;margin-bottom:0.75rem;">NIS-2</div>
      <h1 style="margin:0 0 0.4rem;color:#fff;font-size:1.5rem;font-weight:700;">Ihr NIS-2 Readiness Assessment</h1>
      <p style="margin:0;color:rgba(255,255,255,0.8);font-size:0.85rem;">
        ${new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}${company ? ` · ${company}` : ''}
      </p>
    </div>
  </div>

  <div style="background:#fff;padding:2rem;border:1px solid #e2e2e2;border-top:none;">
    <p style="margin:0 0 1.5rem;color:#1f1f1f;">Sehr geehrte/r <strong>${name}</strong>,</p>
    <p style="margin:0 0 1.5rem;color:#6f6f6f;line-height:1.65;">
      vielen Dank für Ihre Teilnahme am NIS-2 Readiness Assessment. Nachfolgend finden Sie Ihre vollständige Auswertung.
    </p>

    <div style="background:#f4f4f4;border-radius:10px;padding:1rem 1.25rem;margin-bottom:1.75rem;border:1px solid #e2e2e2;">
      <div style="font-size:0.7rem;font-weight:700;color:#6f6f6f;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.75rem;">Ihre Angaben</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
        ${[
          ['Name',        name],
          ['Unternehmen', company || '—'],
          ['E-Mail',      email],
          ['Telefon',     phone || '—'],
        ].map(([label, val]) => `
          <div style="background:#fff;border-radius:7px;padding:0.55rem 0.85rem;border:1px solid #e2e2e2;min-width:140px;">
            <div style="font-size:0.68rem;color:#aaa;font-weight:700;text-transform:uppercase;margin-bottom:0.15rem;">${label}</div>
            <div style="font-size:0.88rem;color:#1f1f1f;">${val}</div>
          </div>`).join('')}
      </div>
    </div>

    <div style="display:flex;gap:1rem;margin-bottom:2rem;flex-wrap:wrap;">
      <div style="background:#FF4338;border-radius:12px;padding:1.2rem 1.5rem;color:#fff;text-align:center;min-width:110px;flex:1;">
        <div style="font-size:2.4rem;font-weight:800;">${percentage}%</div>
        <div style="font-size:0.78rem;opacity:0.85;margin-top:0.15rem;">Reifegrad</div>
        <div style="font-size:0.72rem;opacity:0.65;">${achievedScore}/${maxScore} Punkte</div>
      </div>
      <div style="background:#f4f4f4;border-radius:12px;padding:1.2rem 1.5rem;flex:2;min-width:180px;">
        <div style="font-size:0.7rem;font-weight:700;color:#6f6f6f;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem;">Bewertung</div>
        <div style="font-size:1.15rem;font-weight:700;color:${ratingColor};">${ratingLabel}</div>
        <div style="font-size:0.78rem;color:#6f6f6f;margin-top:0.4rem;">${nis2Status}</div>
      </div>
      <div style="background:#1f1f1f;border-radius:12px;padding:1.2rem 1.5rem;color:#fff;min-width:110px;flex:1;">
        <div style="font-size:0.7rem;opacity:0.55;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.3rem;">Maßnahmen</div>
        <div style="font-size:1.5rem;font-weight:800;">${totalMeasures}</div>
        <div style="font-size:0.72rem;opacity:0.65;">${highPrioCount} hoch priorisiert · ${totalEffort} PT</div>
      </div>
    </div>

    <div style="margin-bottom:2rem;">
      <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:2px solid #e2e2e2;">
        <div style="width:4px;height:22px;border-radius:3px;background:#FF4338;flex-shrink:0;"></div>
        <h2 style="margin:0;font-size:1.1rem;color:#1f1f1f;">Executive Summary</h2>
      </div>
      ${summaryHTML}
    </div>

    ${relevantMeasures.length > 0 ? `
    <div style="margin-bottom:2rem;">
      <h3 style="margin:0 0 0.75rem;font-size:0.95rem;color:#1f1f1f;">Priorisierte Handlungsfelder</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e2e2;border-radius:8px;overflow:hidden;">
        <thead><tr style="background:#f4f4f4;">
          <th style="padding:0.6rem 0.8rem;text-align:left;font-size:0.78rem;color:#6f6f6f;">Themenfeld</th>
          <th style="padding:0.6rem 0.8rem;text-align:left;font-size:0.78rem;color:#6f6f6f;">Priorität</th>
          <th style="padding:0.6rem 0.8rem;text-align:left;font-size:0.78rem;color:#6f6f6f;">Umfang</th>
        </tr></thead>
        <tbody>${measureRows}</tbody>
      </table>
    </div>
    <div style="margin-bottom:2rem;">
      <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:2px solid #e2e2e2;">
        <div style="width:4px;height:22px;border-radius:3px;background:#1f1f1f;flex-shrink:0;"></div>
        <h2 style="margin:0;font-size:1.1rem;color:#1f1f1f;">Maßnahmenkatalog</h2>
      </div>
      ${detailHTML}
    </div>` : ''}

    <!-- CTA Box -->
    <div style="background:#f8f9fa;border:1px solid #e2e2e2;border-radius:10px;padding:1.4rem 1.6rem;margin-bottom:1.5rem;">
      <p style="margin:0 0 0.6rem;font-weight:700;color:#1f1f1f;font-size:1rem;">Persönliche Beratung vereinbaren</p>
      <p style="margin:0 0 1rem;color:#6f6f6f;font-size:0.88rem;line-height:1.65;">
        Das elpix-Team meldet sich in Kürze mit konkreten Empfehlungen. Bei dringenden Fragen stehen wir sofort zur Verfügung.
      </p>
      <a href="mailto:infosec@elpix.ag" style="display:inline-block;background:#FF4338;color:#fff;padding:0.7rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.9rem;">
        Beratungsgespräch anfragen →
      </a>
    </div>

    <!-- Signatur -->
    <p style="margin:1.5rem 0 0.2rem;font-size:14px;color:#1f1f1f;">Mit freundlichen Grüßen,</p>
    <p style="margin:0 0 1.5rem;font-size:14px;color:#1f1f1f;font-weight:700;">Ihr elpix AG Team</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-top:3px solid #FF4338;padding-top:1.25rem;margin-top:0;">
      <tr>
        <td style="vertical-align:top;padding-right:1.5rem;width:110px;">
          <img src="https://quick-check.elpix.ag/logo.png" alt="elpix" style="height:40px;width:auto;display:block;" />
        </td>
        <td style="vertical-align:top;border-left:1px solid #e2e2e2;padding-left:1.5rem;">
          <table cellpadding="0" cellspacing="0">
            <tr><td style="font-size:13px;color:#1f1f1f;line-height:1.6;padding-bottom:2px;">p:&nbsp;<a href="tel:+492018102080" style="color:#1f1f1f;text-decoration:none;">+49 201 8102080</a></td></tr>
            <tr><td style="font-size:13px;color:#1f1f1f;line-height:1.6;padding-bottom:2px;">e:&nbsp;<a href="mailto:infosec@elpix.ag" style="color:#FF4338;text-decoration:none;">infosec@elpix.ag</a></td></tr>
            <tr><td style="font-size:13px;color:#FF4338;font-weight:600;line-height:1.6;padding-bottom:2px;">Alfredstr. 73, 45130 Essen</td></tr>
            <tr><td style="font-size:13px;line-height:1.6;padding-bottom:10px;"><a href="https://www.elpix.ag" style="color:#FF4338;text-decoration:none;">www.elpix.ag</a></td></tr>
            <tr><td style="padding-bottom:12px;">
              <a href="https://www.xing.com/pages/elpixag" target="_blank" style="display:inline-block;width:32px;height:32px;background:#FF4338;border-radius:50%;text-align:center;line-height:32px;color:#fff;text-decoration:none;font-weight:800;font-size:13px;margin-right:5px;">x</a>
              <a href="https://www.linkedin.com/company/elpix-ag" target="_blank" style="display:inline-block;width:32px;height:32px;background:#FF4338;border-radius:50%;text-align:center;line-height:32px;color:#fff;text-decoration:none;font-weight:700;font-size:11px;margin-right:5px;">in</a>
              <a href="mailto:infosec@elpix.ag" style="display:inline-block;width:32px;height:32px;background:#FF4338;border-radius:50%;text-align:center;line-height:32px;color:#fff;text-decoration:none;font-size:15px;">✉</a>
            </td></tr>
          </table>
          <div style="font-size:10px;color:#aaa;line-height:1.6;border-top:1px solid #e2e2e2;padding-top:8px;max-width:400px;">
            elpix AG | Executive Board: Arian Hoxha | Christian Gubensek | Patrick Heike<br>
            Supervisory Board: Ulrich Janinhoff (Chairman), Ralf-Werner, Johannes-Nicolaas Matthijsse<br>
            Seat and Court of Registration: Essen | HRB 17451
          </div>
        </td>
      </tr>
    </table>
  </div>

  <div style="background:#f4f4f4;border:1px solid #e2e2e2;border-top:none;border-radius:0 0 12px 12px;padding:1rem 2rem;">
    <p style="margin:0;text-align:center;color:#aaa;font-size:0.72rem;line-height:1.6;">
      elpix AG · NIS-2 Readiness Assessment · Automatisch generiert.<br>
      Die Auswertung dient als erste Orientierung und ersetzt keine rechtverbindliche Prüfung.<br>
      © ${new Date().getFullYear()} elpix AG · <a href="https://elpix.ag/impressum" style="color:#aaa;text-decoration:none;">Impressum</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

// ─── Interne Benachrichtigungs-E-Mail ─────────────────────────────────────
function buildInternalHTML(contactData, questions, answers, relevantMeasures, scoreData) {
  const { name, company, email, phone } = contactData;
  const { percentage, achievedScore, maxScore, nis2Status } = scoreData;

  const highPrio = relevantMeasures.filter(m => m.sectionPriority === 'high').map(m => m.topic).join(', ');

  const allAnswers = questions
    .filter(q => answers[q.id])
    .map(q => {
      const ans = q.options.find(o => o.value === answers[q.id]);
      return `<tr>
        <td style="padding:0.45rem 0.75rem;border-bottom:1px solid #f0f0f0;font-size:0.82rem;color:#6f6f6f;">${q.category}</td>
        <td style="padding:0.45rem 0.75rem;border-bottom:1px solid #f0f0f0;font-size:0.82rem;">${q.text}</td>
        <td style="padding:0.45rem 0.75rem;border-bottom:1px solid #f0f0f0;font-size:0.82rem;font-weight:600;">${ans?.label || '—'}</td>
      </tr>`;
    }).join('');

  return `<div style="font-family:-apple-system,sans-serif;max-width:720px;margin:0 auto;padding:1rem;background:#f0f2f5;">
  <div style="background:#fff;border-radius:12px;padding:1.75rem;border:1px solid #e2e2e2;">
    <h2 style="margin:0 0 1.25rem;color:#FF4338;font-size:1.2rem;">🔔 Neues NIS-2 Assessment</h2>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.5rem;">
      ${[
        ['Name',        name],
        ['Unternehmen', company || '—'],
        ['E-Mail',      `<a href="mailto:${email}" style="color:#FF4338;">${email}</a>`],
        ['Telefon',     phone || '—'],
        ['Reifegrad',   `<strong style="color:#FF4338;">${percentage}%</strong> (${achievedScore}/${maxScore})`],
      ].map(([label, val]) => `
        <div style="background:#f4f4f4;border-radius:8px;padding:0.75rem 1rem;min-width:130px;">
          <div style="font-size:0.7rem;color:#6f6f6f;font-weight:700;text-transform:uppercase;margin-bottom:0.2rem;">${label}</div>
          <div style="font-size:0.9rem;">${val}</div>
        </div>`).join('')}
      <div style="background:#1f1f1f;border-radius:8px;padding:0.75rem 1rem;flex:1;min-width:220px;color:#fff;">
        <div style="font-size:0.7rem;opacity:0.6;font-weight:700;text-transform:uppercase;margin-bottom:0.2rem;">NIS-2 Status</div>
        <div style="font-size:0.87rem;">${nis2Status}</div>
      </div>
    </div>
    ${highPrio ? `
    <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;padding:0.75rem 1rem;margin-bottom:1.5rem;">
      <div style="font-size:0.72rem;font-weight:700;color:#FF4338;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.3rem;">Kritische Handlungsfelder</div>
      <div style="font-size:0.87rem;color:#1f1f1f;">${highPrio}</div>
    </div>` : ''}
    <table style="width:100%;border-collapse:collapse;font-size:0.83rem;border:1px solid #e2e2e2;border-radius:8px;overflow:hidden;">
      <thead><tr style="background:#f4f4f4;">
        <th style="padding:0.5rem 0.75rem;text-align:left;color:#6f6f6f;">Kategorie</th>
        <th style="padding:0.5rem 0.75rem;text-align:left;color:#6f6f6f;">Frage</th>
        <th style="padding:0.5rem 0.75rem;text-align:left;color:#6f6f6f;">Antwort</th>
      </tr></thead>
      <tbody>${allAnswers}</tbody>
    </table>
    <p style="margin-top:1rem;font-size:0.72rem;color:#aaa;">
      Eingegangen: ${new Date().toLocaleString('de-DE')} · NIS-2 Assessment elpix AG
    </p>
  </div>
</div>`;
}

// ─── Hauptfunktion ────────────────────────────────────────────────────────
export async function sendResultEmails(contactData, questions, answers, relevantMeasures, scoreData, summary) {
  const customerHTML = buildCustomerHTML(contactData, questions, answers, relevantMeasures, scoreData, summary);
  const internalHTML = buildInternalHTML(contactData, questions, answers, relevantMeasures, scoreData);

  try {
    const res = await fetch(MAIL_API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to:              contactData.email,
        toName:          contactData.name,
        subject:         EMAIL_SUBJECT,
        html:            customerHTML,
        ccInternal:      true,
        internalSubject: `[NIS-2 Lead] ${contactData.name}${contactData.company ? ' · ' + contactData.company : ''} – ${scoreData.percentage}%`,
        internalHtml:    customerHTML,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    return { success: true };
  } catch (err) {
    console.error('E-Mail-Versand fehlgeschlagen:', err.message);
    return { success: false, error: err.message };
  }
}
