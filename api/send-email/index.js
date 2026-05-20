'use strict';

const nodemailer = require('nodemailer');

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async function (context, req) {
  // Pre-flight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: CORS_HEADERS, body: '' };
    return;
  }

  const { to, toName, subject, html, ccInternal, internalSubject, internalHtml } = req.body || {};

  if (!to || !subject || !html) {
    context.res = {
      status: 400,
      headers: CORS_HEADERS,
      body: { error: 'Fehlende Parameter: to, subject, html' },
    };
    return;
  }

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
      to:      toName ? `"${toName}" <${to}>` : to,
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
