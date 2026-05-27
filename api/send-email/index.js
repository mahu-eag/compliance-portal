'use strict';

const nodemailer = require('nodemailer');

// ── Erlaubte Ursprungsdomains ─────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://quick-check.elpix.ag',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

function getCorsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

// ── Input-Validierung ─────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

function stripHtml(str) {
  return String(str).replace(/<[^>]*>/g, '').trim();
}

function validateInput({ to, toName, subject, html }) {
  if (!to || !subject || !html)
    return 'Fehlende Parameter: to, subject, html';
  if (!EMAIL_REGEX.test(to))
    return 'Ungültige E-Mail-Adresse';
  if (to.length > 254)
    return 'E-Mail-Adresse zu lang';
  if (toName && stripHtml(toName).length > 100)
    return 'Name zu lang';
  if (subject.length > 200)
    return 'Betreff zu lang';
  if (html.length > 500_000)
    return 'Inhalt zu groß';
  return null;
}

module.exports = async function (context, req) {
  const origin = req.headers['origin'] || '';
  const CORS_HEADERS = getCorsHeaders(origin);

  // Pre-flight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: CORS_HEADERS, body: '' };
    return;
  }

  const { to, toName, subject, html, ccInternal, internalSubject, internalHtml } = req.body || {};

  const validationError = validateInput({ to, toName, subject, html });
  if (validationError) {
    context.res = {
      status: 400,
      headers: CORS_HEADERS,
      body: { error: validationError },
    };
    return;
  }

  // Sicherer Anzeigename — kein HTML, nur reiner Text
  const safeName = toName ? stripHtml(toName).slice(0, 100) : '';

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || '',
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER     || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
    tls: { rejectUnauthorized: false },
  });

  const FROM        = process.env.MAIL_FROM        || `"elpix Assessment" <${process.env.SMTP_USER}>`;
  const TO_INTERNAL = process.env.MAIL_TO_INTERNAL || '';

  try {
    await transporter.sendMail({
      from:    FROM,
      to:      safeName ? `"${safeName}" <${to}>` : to,
      subject,
      html,
    });

    if (ccInternal && internalHtml && TO_INTERNAL) {
      await transporter.sendMail({
        from:    FROM,
        to:      TO_INTERNAL,
        subject: internalSubject || `[Intern] ${subject}`,
        html:    internalHtml,
      });
    }

    context.log(`📧 Gesendet → ${to}${ccInternal ? ` + ${TO_INTERNAL}` : ''}`);
    context.res = { status: 200, headers: CORS_HEADERS, body: { success: true } };
  } catch (err) {
    context.log.error('E-Mail Fehler:', err.message);
    context.res = { status: 500, headers: CORS_HEADERS, body: { error: err.message } };
  }
};
