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

    // debug log
    console.log("RAW:", text.slice(0, 200));

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "FireAnt không trả JSON",
        raw: text.slice(0, 200)
      });
    }

    // đảm bảo là array
    if (!Array.isArray(data)) {
      return res.status(500).json({
        error: "Data không phải array",
        data: data
      });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
