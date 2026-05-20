import React, { useState } from 'react';

const C = {
  red: '#e30613', redDark: '#b9000d', redSoft: '#fff1f2',
  black: '#1f1f1f', dark: '#2b2b2b', gray: '#6f6f6f',
  lightGray: '#f4f4f4', border: '#e2e2e2', white: '#ffffff',
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^\+?[\d]{7,15}$/.test(cleaned);
}
function validateName(name)    { return name.trim().length >= 2; }
function validateCompany(name) { return name.trim().length >= 2; }

function Field({ label, id, type = 'text', value, onChange, onBlur, error, placeholder, hint, required }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label htmlFor={id} style={{
        display: 'block', fontWeight: 600, fontSize: '0.9rem',
        color: C.black, marginBottom: '0.35rem',
      }}>
        {label} {required && <span style={{ color: C.red }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={id}
        style={{
          width: '100%', padding: '0.75rem 1rem',
          border: `2px solid ${error ? C.red : C.border}`,
          borderRadius: 8, fontSize: '1rem', color: C.black,
          background: error ? C.redSoft : C.white,
          outline: 'none', transition: 'border-color 0.15s',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = error ? C.red : '#6366f1'; }}
        onBlurCapture={e => { e.target.style.borderColor = error ? C.red : C.border; }}
      />
      {error && (
        <div style={{ color: C.red, fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          ⚠️ {error}
        </div>
      )}
      {hint && !error && (
        <div style={{ color: C.gray, fontSize: '0.78rem', marginTop: '0.3rem' }}>{hint}</div>
      )}
    </div>
  );
}

function CheckboxRow({ id, checked, onChange, error, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        cursor: 'pointer', fontSize: '0.85rem', color: C.gray, lineHeight: 1.55,
      }}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          style={{ marginTop: 2, flexShrink: 0, accentColor: C.red, width: 16, height: 16 }}
        />
        <span>{children} <span style={{ color: C.red }}>*</span></span>
      </label>
      {error && (
        <div style={{ color: C.red, fontSize: '0.8rem', marginTop: '0.3rem', paddingLeft: '1.6rem' }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default function LeadCapture({ onSubmit, onBack }) {
  const [form, setForm]       = useState({ name: '', company: '', email: '', phone: '' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [privacy, setPrivacy] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (val) => {
    const next = { ...form, [field]: val };
    setForm(next);
    if (touched[field]) validateFields(next);
  };

  const touch = (field) => () => {
    setTouched(t => ({ ...t, [field]: true }));
    validateFields(form);
  };

  const validateFields = (f = form) => {
    const e = {};
    if (!validateName(f.name))       e.name    = 'Bitte geben Sie Ihren vollständigen Namen ein (mind. 2 Zeichen).';
    if (!validateCompany(f.company)) e.company = 'Bitte geben Sie den Unternehmensnamen ein (mind. 2 Zeichen).';
    if (!validatePhone(f.phone))     e.phone   = 'Bitte geben Sie eine gültige Telefonnummer ein (z. B. +49 151 12345678).';
    if (!validateEmail(f.email))     e.email   = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    setTouched({ name: true, company: true, email: true, phone: true });
    const fieldsOk = validateFields();

    const newErrors = {};
    if (!fieldsOk) Object.assign(newErrors, errors);
    if (!privacy) newErrors.privacy = 'Bitte stimmen Sie der Datenschutzerklärung zu.';
    if (!consent) newErrors.consent = 'Bitte stimmen Sie der Kontaktaufnahme zu.';

    if (Object.keys(newErrors).length > 0 || !fieldsOk) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    setSubmitted(true);
    onSubmit({
      name:    form.name.trim(),
      company: form.company.trim(),
      email:   form.email.trim(),
      phone:   form.phone.trim(),
    });
  };

  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        background: C.white, borderRadius: 16, padding: '2.5rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)', border: `1px solid ${C.border}`,
        maxWidth: 520, width: '100%',
      }}>
        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            display: 'inline-block',
            background: C.red, color: C.white,
            fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1.5px',
            padding: '0.3rem 1rem', borderRadius: 999,
            textTransform: 'uppercase',
          }}>
            EU AI ACT · READINESS ASSESSMENT
          </span>
        </div>

        {/* Icon + Headline */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.red}, ${C.redDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', margin: '0.75rem auto 1rem',
          }}>
            🔓
          </div>
          <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', color: C.black, lineHeight: 1.3 }}>
            Vollständige Auswertung freischalten
          </h1>
          <p style={{ margin: 0, color: C.gray, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Hinterlassen Sie Ihre Kontaktdaten, um Ihren vollständigen Bericht mit allen
            Maßnahmen und Handlungsempfehlungen zu erhalten.
          </p>
        </div>

        <Field
          id="name" label="Vor- und Nachname" required
          value={form.name} onChange={set('name')} onBlur={touch('name')}
          placeholder="Vorname Nachname"
          error={touched.name ? errors.name : ''}
        />
        <Field
          id="company" label="Unternehmen" required
          value={form.company} onChange={set('company')} onBlur={touch('company')}
          placeholder="Ihr Unternehmen GmbH"
          error={touched.company ? errors.company : ''}
        />
        <Field
          id="phone" label="Telefonnummer" required
          value={form.phone} onChange={set('phone')} onBlur={touch('phone')}
          placeholder="+49 151 12345678"
          error={touched.phone ? errors.phone : ''}
          hint="Für Rückfragen zu Ihrem Assessment."
        />
        <Field
          id="email" label="E-Mail-Adresse" type="email" required
          value={form.email} onChange={set('email')} onBlur={touch('email')}
          placeholder="name@unternehmen.de"
          error={touched.email ? errors.email : ''}
          hint="An diese Adresse senden wir Ihren vollständigen Bericht."
        />

        <div style={{ borderTop: `1px solid ${C.border}`, margin: '0.5rem 0 1.25rem' }} />

        <CheckboxRow
          id="privacy"
          checked={privacy}
          onChange={v => {
            setPrivacy(v);
            if (v) setErrors(e => { const { privacy: _, ...r } = e; return r; });
          }}
          error={errors.privacy}
        >
          Ich stimme zu, dass meine Daten zur Bearbeitung meiner Anfrage und für die Zusendung
          der Ergebnisse gemäß{' '}
          <a href="https://elpix.ag/datenschutz" target="_blank" rel="noreferrer"
            style={{ color: C.red, textDecoration: 'underline' }}>
            Datenschutzerklärung
          </a>{' '}
          verarbeitet werden. (DSGVO-Einwilligung)
        </CheckboxRow>

        <CheckboxRow
          id="consent"
          checked={consent}
          onChange={v => {
            setConsent(v);
            if (v) setErrors(e => { const { consent: _, ...r } = e; return r; });
          }}
          error={errors.consent}
        >
          Ich bin damit einverstanden, dass das elpix-Team mich zu meinen Ergebnissen und
          weiterführenden Beratungsangeboten kontaktiert. Diese Einwilligung kann ich jederzeit
          widerrufen.
        </CheckboxRow>

        <button
          onClick={handleSubmit}
          disabled={submitted}
          style={{
            width: '100%', padding: '0.95rem',
            background: submitted ? '#aaa' : `linear-gradient(135deg, ${C.red}, ${C.redDark})`,
            color: C.white, border: 'none', borderRadius: 10,
            fontSize: '1rem', fontWeight: 700, cursor: submitted ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', marginTop: '0.5rem',
          }}
        >
          {submitted ? '⏳ Wird verarbeitet…' : '📊 Vollständige Ergebnisse anzeigen →'}
        </button>

        <p style={{ textAlign: 'center', color: C.gray, fontSize: '0.78rem', marginTop: '1rem', marginBottom: '1rem' }}>
          🔒 Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
        </p>

        {onBack && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onBack}
              style={{
                background: 'none', border: 'none', color: C.gray,
                fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              ← Zurück zur Auswertung
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
