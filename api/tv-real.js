export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://scanner.tradingview.com/vietnam/scan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          symbols: {
            tickers: ["HOSE:VNINDEX"],
            query: { types: [] }
          },
          columns: ["close", "open", "high", "low"]
        })
      }
    );

    const json = await response.json();

    if (!json.data || !json.data.length) {
      return res.status(200).json([]);
    }

    const d = json.data[0].d;

    // 👇 build lại 50 candles giả nhưng dựa trên giá thật
    let base = d[0];
    const candles = [];

    for (let i = 0; i < 50; i++) {
      const open = base;
      const move = (Math.random() - 0.5) * 5;

      const close = open + move;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;

      candles.push({
        time: Math.floor(Date.now() / 1000) - (50 - i) * 60,
        open,
        high,
        low,
        close
      });

      base = close;
    }

    res.status(200).json(candles);

  } catch (err) {
    res.status(200).json([]); // 👈 không crash nữa
  }
}
