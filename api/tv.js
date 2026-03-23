export default async function handler(req, res) {
  try {
    const symbol = "VNINDEX"; // hoặc VN30 nếu muốn

    const response = await fetch(
      "https://scanner.tradingview.com/vietnam/scan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          symbols: {
            tickers: [`HOSE:${symbol}`],
            query: { types: [] }
          },
          columns: [
            "close",
            "open",
            "high",
            "low",
            "volume"
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.data || !data.data.length) {
      return res.status(200).json([]);
    }

    const d = data.data[0].d;

    // fake thành OHLC nến 1 cây
    const result = [
      {
        time: Math.floor(Date.now() / 1000),
        open: d[1],
        high: d[2],
        low: d[3],
        close: d[0]
      }
    ];

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
