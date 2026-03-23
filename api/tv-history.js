export default async function handler(req, res) {
  try {
    const symbol = "VNINDEX";

    const response = await fetch(
      `https://symbol-search.tradingview.com/symbol_search/?text=${symbol}&exchange=HOSE`
    );

    const search = await response.json();

    if (!search.length) {
      return res.status(200).json([]);
    }

    // 👇 FAKE lịch sử (tạm thời)
    const candles = [];

    let base = 1650;

    for (let i = 0; i < 100; i++) {
      const open = base + Math.random() * 10;
      const close = open + (Math.random() - 0.5) * 20;
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;

      candles.push({
        time: Math.floor(Date.now() / 1000) - (100 - i) * 60,
        open,
        high,
        low,
        close
      });

      base = close;
    }

    res.status(200).json(candles);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
