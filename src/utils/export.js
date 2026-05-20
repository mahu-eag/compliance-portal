function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToJSON(data) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `nis2-assessment-${Date.now()}.json`, 'application/json');
}

export function exportToCSV(data) {
  const rows = [
    ['NIS-2 Assessment Report'],
    ['Datum', new Date(data.timestamp).toLocaleString('de-DE')],
    ['NIS-2 Status', data.nis2Status],
    ['Score', `${data.score.achieved}/${data.score.max} (${data.score.percentage}%)`],
    [],
    ['Kategorie', 'Frage', 'Antwort']
  ];

  data.answers.forEach(a => {
    rows.push([a.category, a.question, a.answer]);
  });

  const csv = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')
  ).join('\n');

  downloadFile('\uFEFF' + csv, `nis2-assessment-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
}

export function exportToHTML(data) {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>NIS-2 Assessment Report</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; max-width: 900px; margin: 2rem auto; padding: 2rem; color: #1a1a2e; }
  h1 { color: #16213e; border-bottom: 3px solid #0f3460; padding-bottom: 0.5rem; }
  h2 { color: #0f3460; margin-top: 2rem; }
  .meta { background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
  .score { font-size: 3rem; font-weight: bold; color: #0f3460; }
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
  th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #ddd; }
  th { background: #0f3460; color: white; }
  tr:nth-child(even) { background: #f9f9f9; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <h1>NIS-2 Assessment Report</h1>
  <div class="meta">
    <p><strong>Erstellt am:</strong> ${new Date(data.timestamp).toLocaleString('de-DE')}</p>
    <p><strong>NIS-2 Klassifizierung:</strong> ${data.nis2Status}</p>
  </div>
  <h2>Cybersicherheits-Reifegrad</h2>
  <div class="score">${data.score.percentage}%</div>
  <p>${data.score.achieved} von ${data.score.max} Punkten erreicht</p>
  <h2>Detaillierte Antworten</h2>
  <table>
    <thead><tr><th>Kategorie</th><th>Frage</th><th>Antwort</th></tr></thead>
    <tbody>
      ${data.answers.map(a => `<tr><td>${a.category}</td><td>${a.question}</td><td>${a.answer}</td></tr>`).join('')}
    </tbody>
  </table>
  <script>window.print();</script>
</body>
</html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
}