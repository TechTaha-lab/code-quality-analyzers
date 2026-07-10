async function loadReport() {
  try {
    const res = await fetch('./report.json');
    const data = await res.json();
    const summary = data.summary || {};

    document.getElementById('meta').textContent = summary.generatedAt ? `Generated ${new Date(summary.generatedAt).toLocaleString()}` : '';
    document.getElementById('quality-score').textContent = String(summary.score ?? '-');
    document.getElementById('quality-rating').textContent = summary.rating || '-';
    document.getElementById('files-scanned').textContent = String(summary.filesScanned ?? '-');
    document.getElementById('findings-count').textContent = String(data.findings?.length || 0);
    document.getElementById('errors-count').textContent = String(summary.errors ?? 0);
    document.getElementById('warnings-count').textContent = String(summary.warnings ?? 0);

    const severityCounts = { info: 0, warning: 0, error: 0, critical: 0 };
    (data.findings || []).forEach((finding) => {
      severityCounts[finding.severity] = (severityCounts[finding.severity] || 0) + 1;
    });

    const ctx = document.getElementById('severityChart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Info', 'Warnings', 'Errors', 'Critical'],
        datasets: [{
          data: [severityCounts.info, severityCounts.warning, severityCounts.error, severityCounts.critical],
          backgroundColor: ['#38bdf8', '#f59e0b', '#f43f5e', '#991b1b'],
        }],
      },
      options: { responsive: true, plugins: { legend: { labels: { color: '#dbeafe' } } } },
    });

    const issuesList = document.getElementById('issues-list');
    (data.findings || []).slice(0, 300).forEach((finding) => {
      const li = document.createElement('li');
      li.className = `issue ${finding.severity || 'warning'}`;
      const location = [finding.file, finding.line ? `line ${finding.line}` : null, finding.column ? `col ${finding.column}` : null].filter(Boolean).join(' - ');
      li.innerHTML = `<strong>${finding.id || 'rule'}</strong><span>${finding.severity || 'warning'}</span><p>${finding.message || ''}</p><small>${location}</small>`;
      issuesList.appendChild(li);
    });

    const filesList = document.getElementById('files-list');
    (data.files || []).slice(0, 200).forEach((file) => {
      const li = document.createElement('li');
      li.textContent = `${file.file} - ${file.metrics.lines} lines`;
      filesList.appendChild(li);
    });
  } catch (e) {
    console.error('Failed to load report.json', e);
  }
}

loadReport();
