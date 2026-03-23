async function fetchKline(tf = "1m") {
  const res = await fetch("/api/tv");
  const data = await res.json();

  return data.map(d => ({
    time: Math.floor(new Date(d.time).getTime() / 1000),
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volume
  }));

  if (!Array.isArray(data)) return [];
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function breakout(data) {
  const closes = data.map(d => d.close);
  const last = closes[closes.length - 1];
  const prevHigh = Math.max(...closes.slice(-20, -1));
  return last > prevHigh;
}

function trend(data) {
  const closes = data.map(d => d.close);
  return avg(closes.slice(-5)) > avg(closes.slice(-20)) ? "UP" : "DOWN";
}

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
  return trs.slice(-period).reduce((a, b) => a + b, 0) / period;
}

async function loadSystem() {
  const data1m = await fetchKline("1m");
  const data5m = await fetchKline("5m");
  const data15m = await fetchKline("15m");

  candleSeries.setData(data1m);

  const isBreak = breakout(data5m);
  const isTrend = trend(data15m);

  let signal = "";

  if (isBreak && isTrend === "UP") {
    signal = "🚀 STRONG LONG";
  }

  document.getElementById("signal").innerText = signal;

  if (signal) {
    const entry = data1m[data1m.length - 1].close;
    const atr = calcATR(data1m);

    const sl = entry - atr * 1.5;
    const tp = entry + (entry - sl) * 2;

    document.getElementById("trade").innerText = `
    Entry: ${entry}
    SL: ${sl}
    TP: ${tp}
    `;
  }
}

initChart();
loadSystem();
setInterval(loadSystem, 5000);
