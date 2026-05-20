// ─── NIS-2 Assessment · Mail-Server ──────────────────────────────────────
//
// Startet einen lokalen API-Server, der E-Mails über SMTP versendet.
//
// Starten: node server.js
// Läuft parallel zum Vite Dev-Server (npm run dev)
//
// Konfiguration: Kopieren Sie .env.example → .env und tragen Sie Ihre
// SMTP-Zugangsdaten ein. Die .env-Datei wird NICHT ins Git eingecheckt.
// ─────────────────────────────────────────────────────────────────────────

import 'dotenv/config';
import express    from 'express';
import cors       from 'cors';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SMTP = {
  host:     process.env.SMTP_HOST     || '',
  port:     Number(process.env.SMTP_PORT)   || 587,
  secure:   process.env.SMTP_SECURE   === 'true',
  user:     process.env.SMTP_USER     || '',
  password: process.env.SMTP_PASSWORD || '',
};

const FROM        = process.env.MAIL_FROM        || `"elpix NIS-2 Assessment" <${SMTP.user}>`;
const TO_INTERNAL = process.env.MAIL_TO_INTERNAL || '';
const API_PORT    = Number(process.env.API_PORT) || 3001;

// ─────────────────────────────────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ── Static file serving ───────────────────────────────────────────────
const DIST = join(__dirname, 'dist');

// Subapps — serve built assets, fallback to index.html for client-side routing
app.use('/nis-2-check', express.static(join(DIST, 'nis-2-check')));
app.get('/nis-2-check/{*path}', (_req, res) =>
  res.sendFile(join(DIST, 'nis-2-check', 'index.html')));

app.use('/eu-ai-act-check', express.static(join(DIST, 'eu-ai-act-check')));
app.get('/eu-ai-act-check/{*path}', (_req, res) =>
  res.sendFile(join(DIST, 'eu-ai-act-check', 'index.html')));

// Portal selector page (root) — serve from dist/ which includes portal files
app.use(express.static(DIST));
app.get('/', (_req, res) => res.sendFile(join(DIST, 'index.html')));

// ── Transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   SMTP.host,
  port:   SMTP.port,
  secure: SMTP.secure,
  auth: {
    user: SMTP.user,
    pass: SMTP.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ── Verbindungstest beim Start ────────────────────────────────────────
transporter.verify((err) => {
  if (err) {
    console.error('❌  SMTP-Verbindung fehlgeschlagen:', err.message);
    console.error('    → Bitte .env prüfen (SMTP_HOST, SMTP_USER, SMTP_PASSWORD).');
  } else {
    console.log(`✅  SMTP-Verbindung OK (${SMTP.host}:${SMTP.port})`);
  }
});

// ── POST /api/send-email ──────────────────────────────────────────────
app.post('/api/send-email', async (req, res) => {
  const { to, toName, subject, html, ccInternal = true, internalSubject, internalHtml } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Fehlende Parameter: to, subject, html' });
  }

  try {
    await transporter.sendMail({
      from:    FROM,
      to:      `"${toName || ''}" <${to}>`,
      subject,
      html,
    });

    if (ccInternal && internalHtml) {
      await transporter.sendMail({
        from:    FROM,
        to:      TO_INTERNAL,
        subject: internalSubject || `[Intern] ${subject}`,
        html:    internalHtml,
      });
    }

    console.log(`📧  Gesendet → ${to}${ccInternal ? ` + ${TO_INTERNAL}` : ''}`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌  Sendefehler:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Health-Check ──────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, smtp: SMTP.host }));

app.listen(API_PORT, () => {
  console.log(`\n🚀  Mail-Server läuft auf http://localhost:${API_PORT}`);
  console.log(`    SMTP: ${SMTP.host || '⚠️  NICHT KONFIGURIERT'}:${SMTP.port}`);
  console.log(`    Von:  ${FROM}`);
  console.log(`    An:   ${TO_INTERNAL} (intern)\n`);
});
