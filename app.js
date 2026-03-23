// =======================
// FETCH DATA
// =======================
async function fetchKline() {
  try {
    const res = await fetch("/api/tv-history");
    const data = await res.json();

    console.log("DATA:", data);

    if (!Array.isArray(data) || data.length === 0) {
      console.log("No data");
      return [];
    }

    return data.map(d => ({
      time: d.time,
      open: Number(d.open),
      high: Number(d.high),
      low: Number(d.low),
      close: Number(d.close)
    }));

  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

// =======================
// INDICATORS
// =======================
function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function trend(data) {
  const closes = data.map(d => d.close);

  if (closes.length < 20) return "NONE";

  return avg(closes.slice(-5)) > avg(closes.slice(-20))
    ? "UP"
    : "DOWN";
}

function breakout(data) {
  if (data.length < 20) return false;

  const closes = data.map(d => d.close);
  const last = closes[closes.length - 1];
  const prevHigh = Math.max(...closes.slice(-20, -1));

  return last > prevHigh;
}

// =======================
// ATR
// =======================
function calcATR(data, period = 14) {
  let trs = [];

  for (let i = 1; i < data.length; i++) {
    const tr = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    );
    trs.push(tr);
  }

  if (trs.length < period) return 0;

  return trs.slice(-period).reduce((a, b) => a + b, 0) / period;
}

// =======================
// MAIN SYSTEM
// =======================
async function loadSystem() {
  const data = await fetchKline();

  if (!data.length) {
    document.getElementById("signal").innerText = "⏸️ No data";
    return;
  }

  // 🎯 VẼ CHART
  candleSeries.setData(data);

  // 🎯 SIGNAL
  const isTrend = trend(data);
  const isBreak = breakout(data);

  let signal = "WAIT";

  if (isTrend === "UP" && isBreak) {
    signal = "🚀 LONG";
  }

  document.getElementById("signal").innerText = signal;

  // 🎯 TRADE SETUP
  const last = data[data.length - 1];
  const entry = last.close;

  const atr = calcATR(data);

  if (atr === 0) return;

  const sl = entry - atr * 1.5;
  const tp = entry + (entry - sl) * 2;

  document.getElementById("trade").innerText = `
Entry: ${entry.toFixed(2)}
SL: ${sl.toFixed(2)}
TP: ${tp.toFixed(2)}
`;
}

// =======================
// INIT
// =======================
async function start() {
  if (typeof initChart === "function") {
    initChart();
  } else {
    console.error("initChart not found");
    return;
  }

  await loadSystem();

  // 🔄 update mỗi 5s
  setInterval(loadSystem, 5000);
}

start();
