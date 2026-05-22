'use strict';

module.exports = async function (context, req) {
  const smtpConfigured = !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  );

  context.res = {
    status: smtpConfigured ? 200 : 503,
    headers: { 'Content-Type': 'application/json' },
    body: {
      ok: smtpConfigured,
      smtp: smtpConfigured ? process.env.SMTP_HOST : 'not configured',
    },
  };
};
