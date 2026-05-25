
const NODES_URL = 'https://nodes.rxd-radiant.com/api/nodes';

async function loadLiveData() {
  try {
    const res = await fetch(NODES_URL);
    const allNodes = await res.json();

    // Derive stats
    const onlineNodes = allNodes.filter(n => n.status === 'online');
    const total = allNodes.length;
    const online = onlineNodes.length;
    const offline = total - online;

    // === STAT CARDS – update text only (zero layout shift) ===
    const cards = document.querySelectorAll('#live-stats .countdown-card');
    cards[0].querySelector('.countdown-value').textContent = total;
    cards[1].querySelector('.countdown-value').textContent = online;
    cards[2].querySelector('.countdown-value').textContent = offline;

    // === VERSION DISTRIBUTION – exact halving gauge with precise percentages ===
    const versionCounts = {};
    onlineNodes.forEach(node => {
      const version = node.version ? node.version.trim() : 'Unknown';
      versionCounts[version] = (versionCounts[version] || 0) + 1;
    });

    const sortedVersions = Object.entries(versionCounts).sort(([,a], [,b]) => b - a);

    let html = '';
    sortedVersions.forEach(([version, count]) => {
      const percentage = onlineNodes.length ? (count / onlineNodes.length * 100) : 0;
      const nodeText = count === 1 ? 'node' : 'nodes';
      
      html += `
        <div class="margin-bottom-md">
          <div class="flex justify-between items-baseline text-sm margin-bottom-xs">
            <span class="color-contrast-higher">${version}</span>
            <span class="color-contrast-higher"><span class="node-version-amount fw-bold">${count} ${nodeText}</span> <span class="node-version-percent fw-bold">${percentage.toFixed(1)}%</span></span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${percentage.toFixed(1)}%;"></div>
          </div>
        </div>`;
    });

    if (sortedVersions.length === 0) {
      html = `<p class="color-contrast-medium text-center padding-y-md">No online node data available at the moment.</p>`;
    }

    document.getElementById('version-distribution').innerHTML = html;

  } catch (err) {
    console.warn('Live data temporarily unavailable:', err);
    // Graceful fallback
    const cards = document.querySelectorAll('#live-stats .countdown-card');
    if (cards.length) {
      cards[0].querySelector('.countdown-value').textContent = '---';
      cards[1].querySelector('.countdown-value').textContent = '--';
      cards[2].querySelector('.countdown-value').textContent = '---';
    }
    document.getElementById('version-distribution').innerHTML = `
      <p class="color-warning text-center padding-y-md">Unable to load version data.<br><br>Try visiting <a href="https://nodes.rxd-radiant.com" class="color-electric">Radiant Node Crawler</a></p>`;
  }
}

// Immediate load + 30 s refresh
loadLiveData();
setInterval(loadLiveData, 30000);
