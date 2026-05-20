import React, { useState } from 'react';

/**
 * Paywall-Komponente
 * 
 * Aktuell als Mock implementiert. Für die Produktivversion können hier folgende
 * Mechanismen integriert werden:
 *  - Stripe Checkout (Stripe.js / Checkout Session)
 *  - Lizenzschlüssel-Validierung (z. B. gegen eigenes Backend)
 *  - SSO / Account-basierte Freischaltung
 *  - Lemon Squeezy / Paddle / Gumroad
 */
export default function Paywall({ onSuccess, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // === Mock-Logik: Demo-Code „NIS2-DEMO" schaltet frei ===
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (code.trim().toUpperCase() === 'NIS2-DEMO') {
        // Optional: Freischaltung im LocalStorage merken (24h gültig)
        const expiry = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('measures_unlock', JSON.stringify({ expiry }));
        onUnlock();
      } else {
        setError('Ungültiger Code. Hinweis: Demo-Code ist „NIS2-DEMO".');
      }
      setLoading(false);
    }, 600);
  };

  // === Stripe-Platzhalter ===
  const handleStripeCheckout = () => {
    alert('🚧 Stripe-Integration folgt.\n\nHier würde der Checkout-Flow gestartet:\n' +
      'await stripe.redirectToCheckout({ sessionId })');
    // Beispiel-Implementierung:
    // const res = await fetch('/api/create-checkout-session', { method: 'POST' });
    // const { sessionId } = await res.json();
    // const stripe = await loadStripe(PUBLIC_KEY);
    // stripe.redirectToCheckout({ sessionId });
  };

  return (
    <div className="paywall-view">
      <button className="btn btn-secondary" onClick={onBack}>
        ← Zurück zum Ergebnis
      </button>

      <div className="paywall-card">
        <div className="paywall-icon">🔒</div>
        <h1>Premium-Inhalt: Maßnahmenkatalog</h1>
        <p className="paywall-lead">
          Erhalten Sie Zugriff auf den vollständigen, individuell auf Ihr
          Assessment-Ergebnis zugeschnittenen Maßnahmenkatalog.
        </p>

        <div className="paywall-features">
          <h3>Im Premium-Zugang enthalten:</h3>
          <ul>
            <li>✅ Konkrete Handlungsempfehlungen je Themenfeld</li>
            <li>✅ Priorisierung nach Risikorelevanz</li>
            <li>✅ Differenzierung in Technik / Organisation / Change & Adoption</li>
            <li>✅ Export der Maßnahmen als PDF / CSV / JSON</li>
            <li>✅ Berücksichtigung von User-Adoption & Change-Management</li>
            <li>✅ Aktualisierungen bei regulatorischen Änderungen</li>
          </ul>
        </div>

        <div className="paywall-pricing">
          <div className="price-card">
            <h4>Einmalige Freischaltung</h4>
            <p className="price">49 € <span>zzgl. USt.</span></p>
            <button
              className="btn btn-primary btn-large"
              onClick={handleStripeCheckout}
            >
              💳 Jetzt freischalten
            </button>
          </div>
        </div>

        <div className="paywall-divider">— oder —</div>

        <form className="paywall-code-form" onSubmit={handleSubmit}>
          <label htmlFor="code">Sie haben bereits einen Zugangscode?</label>
          <div className="code-input-row">
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code eingeben (Demo: NIS2-DEMO)"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-secondary" disabled={loading}>
              {loading ? 'Prüfe…' : 'Einlösen'}
            </button>
          </div>
          {error && <p className="paywall-error">{error}</p>}
        </form>

        <p className="paywall-footnote">
          Mit dem Erwerb akzeptieren Sie die AGB und Datenschutzerklärung.
        </p>
      </div>
    </div>
  );
}

/**
 * Hilfsfunktion: Prüft, ob aktuell ein gültiger Premium-Zugang besteht.
 * Kann an beliebiger Stelle importiert werden.
 */
export function hasMeasuresAccess() {
  try {
    const raw = localStorage.getItem('measures_unlock');
    if (!raw) return false;
    const { expiry } = JSON.parse(raw);
    return typeof expiry === 'number' && expiry > Date.now();
  } catch {
    return false;
  }
}