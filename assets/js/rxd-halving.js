const HALVING_INTERVAL = 210000;
const BLOCK_TIME_SECONDS = 300;

const BLOCK_API = "https://explorer1.rxd-radiant.com/api/getblockcount";
const HASHRATE_API = "https://explorer1.rxd-radiant.com/api/getnetworkhashps";
const CORS_PROXY = "https://api.codetabs.com/v1/proxy?quest=";

let currentBlock = 0;
let nextHalvingBlock = 0;
let lastUpdateTime = Date.now();

async function fetchWithProxy(url) {
  const response = await fetch(CORS_PROXY + encodeURIComponent(url), { 
    cache: 'no-store' 
  });
  if (!response.ok) throw new Error(`Proxy failed: ${response.status}`);
  return await response.text();
}

async function fetchBlockchainData() {
  try {
    const [blockText, hashrateText] = await Promise.all([
      fetchWithProxy(BLOCK_API),
      fetchWithProxy(HASHRATE_API)
    ]);

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