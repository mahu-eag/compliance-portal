# elpix Compliance Portal

Readiness Assessments für EU AI Act und NIS-2 – gebaut mit React + Vite,
gehostet auf Azure Static Web Apps, E-Mail-Versand über Azure Functions.

## Struktur

```
compliance-portal/
├── src/                         NIS-2 React App (Quelle)
├── eu-ai-act-assessment/        EU AI Act React App (Quelle)
├── api/                         Azure Functions (E-Mail-API)
├── portal/                      Statische Übersichtsseite
├── public/                      NIS-2 Assets (Logo, Icons)
├── server.js                    Lokaler Dev-Server (nur lokal)
├── vite.config.js               NIS-2 Vite-Konfiguration
├── staticwebapp.config.json     Azure SWA Routing
├── .env.example                 Vorlage für SMTP-Konfiguration
└── .gitignore
```

## Lokale Entwicklung

```bash
# 1. Abhängigkeiten installieren
npm install
cd eu-ai-act-assessment && npm install && cd ..
cd api && npm install && cd ..

# 2. .env anlegen
cp .env.example .env
# → .env mit SMTP-Zugangsdaten befüllen

# 3. Lokalen Server starten (Terminal 1)
node server.js

# 4. Vite Dev-Server starten (Terminal 2)
npm run dev         # NIS-2 → http://localhost:5173/nis-2-check/
# oder
cd eu-ai-act-assessment && npm run dev   # EU AI Act → http://localhost:5174/eu-ai-act-check/
```

## Production Build

```bash
npm run build
# → dist/ enthält alle drei Apps (portal, nis-2-check, eu-ai-act-check)
```

## Deployment – Azure Static Web Apps

### Ordner hochladen
| Quelle | Azure Einstellung |
|--------|-------------------|
| `dist/` | App location / Output |
| `api/`  | API location |

### Per SWA CLI
```bash
npm install -g @azure/static-web-apps-cli
swa deploy ./dist --api-location ./api --env production
```

### Environment Variables (Azure Portal)
Unter **Configuration → Application Settings** eintragen:

| Key | Wert |
|-----|------|
| `SMTP_HOST` | `smtp.office365.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `quick-check@ihredomain.de` |
| `SMTP_PASSWORD` | `…` |
| `MAIL_FROM` | `"elpix Assessment" <quick-check@ihredomain.de>` |
| `MAIL_TO_INTERNAL` | `infosec@ihredomain.de` |

## Assessments

| URL | Beschreibung |
|-----|-------------|
| `/` | Übersichtsseite |
| `/nis-2-check/` | NIS-2 Readiness Assessment |
| `/eu-ai-act-check/` | EU AI Act Readiness Assessment |
| `/api/send-email` | E-Mail API (POST) |
| `/api/health` | Health-Check (GET) |
