async function loadReport(){
  try{
    const res = await fetch('./report.json');
    const data = await res.json();
    document.getElementById('files-scanned').textContent = data.summary.filesScanned;
    document.getElementById('findings-count').textContent = String(data.findings?.length || 0);

    const severityCounts = { info:0, warning:0, error:0, critical:0 };
    (data.findings || []).forEach(f => { severityCounts[f.severity] = (severityCounts[f.severity]||0) + 1; });

    const ctx = document.getElementById('severityChart').getContext('2d');
    new Chart(ctx, { type:'doughnut', data:{ labels:['info','warning','error','critical'], datasets:[{ data:[severityCounts.info,severityCounts.warning,severityCounts.error,severityCounts.critical], backgroundColor:['#60a5fa','#fbbf24','#fb7185','#ef4444'] }] }, options:{responsive:true} });

    const filesList = document.getElementById('files-list');
    (data.files || []).slice(0,200).forEach(f => { const li = document.createElement('li'); li.textContent = `${f.file} — ${f.metrics.lines} lines`; filesList.appendChild(li); });
  }catch(e){ console.error('Failed to load report.json', e); }
}

loadReport();
