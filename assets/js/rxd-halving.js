const HALVING_INTERVAL = 210000;
const BLOCK_TIME_SECONDS = 300;

const PRIMARY_BASE = "https://radiantexplorer.com/api";
const FALLBACK_BASE = "https://explorer1.rxd-radiant.com/api";

const WORKER_URL = "https://radiant-halving-proxy.bitopia-rxd.workers.dev";

let currentBlock = 0;
let nextHalvingBlock = 0;
let lastUpdateTime = Date.now();

async function fetchWithWorker(baseUrl, endpoint) {
  const target = `${baseUrl}${endpoint}`;
  const response = await fetch(`${WORKER_URL}?url=${encodeURIComponent(target)}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Worker failed: ${response.status}`);
  }
  return await response.text();
}

async function fetchBlockchainData() {
  try {
    let blockText, hashrateText;

    try {
      [blockText, hashrateText] = await Promise.all([
        fetchWithWorker(PRIMARY_BASE, "/getblockcount"),
        fetchWithWorker(PRIMARY_BASE, "/getnetworkhashps")
      ]);
    } catch (err) {
      console.warn("Primary explorer failed, trying fallback...");
      [blockText, hashrateText] = await Promise.all([
        fetchWithWorker(FALLBACK_BASE, "/getblockcount"),
        fetchWithWorker(FALLBACK_BASE, "/getnetworkhashps")
      ]);
    }

    currentBlock = parseInt(blockText.trim(), 10) || 0;
    nextHalvingBlock = Math.ceil(currentBlock / HALVING_INTERVAL) * HALVING_INTERVAL;

    document.getElementById("current-block").textContent = currentBlock.toLocaleString("en-US");
    document.getElementById("blocks-remaining").textContent = (nextHalvingBlock - currentBlock).toLocaleString("en-US");
    document.getElementById("next-halving-block").textContent = nextHalvingBlock.toLocaleString("en-US");

    const cycleStart = Math.floor(currentBlock / HALVING_INTERVAL) * HALVING_INTERVAL;
    const progress = Math.min(100, ((currentBlock - cycleStart) / HALVING_INTERVAL) * 100);
    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("progress-text").textContent = `${progress.toFixed(1)}%`;

    const secondsRemaining = (nextHalvingBlock - currentBlock) * BLOCK_TIME_SECONDS;
    const estDate = new Date(Date.now() + secondsRemaining * 1000);
    document.getElementById("estimated-date").textContent = estDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const hashps = parseFloat(hashrateText.trim());
    document.getElementById("hashrate").textContent = 
      (!isNaN(hashps) && hashps > 0) ? (hashps / 1e12).toFixed(2) + " TH/s" : "— TH/s";

    lastUpdateTime = Date.now();

  } catch (err) {
    console.error("Data fetch failed:", err);
  }
}

function updateCountdown() {
  if (!nextHalvingBlock || currentBlock === 0) return;

  const diffMs = (nextHalvingBlock - currentBlock) * BLOCK_TIME_SECONDS * 1000 
                 - (Date.now() - lastUpdateTime);

  if (diffMs <= 0) {
    document.querySelectorAll("#countdown .countdown-value").forEach(el => el.textContent = "00");
    return;
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

function initHalvingCountdown() {
  fetchBlockchainData();
  setInterval(fetchBlockchainData, 75000);
  setInterval(updateCountdown, 1000);
  setTimeout(updateCountdown, 400);
}

initHalvingCountdown();