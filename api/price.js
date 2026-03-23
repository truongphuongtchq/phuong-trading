export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://restv2.fireant.vn/ohlc?symbol=VN30F1M&period=1m&count=100",
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const text = await response.text();

    let data = [];

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        data = parsed;
      }
    } catch (e) {
      console.log("Parse lỗi:", text.slice(0, 100));
    }

    // 👇 fallback nếu FireAnt lỗi
    if (!data.length) {
      data = [
        {
          time: Date.now(),
          open: 1250,
          high: 1255,
          low: 1245,
          close: 1252,
          volume: 1000
        }
      ];
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(200).json([]); // 👈 KHÔNG cho crash nữa
  }
}
