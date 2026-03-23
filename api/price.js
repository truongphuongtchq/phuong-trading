export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://restv2.fireant.vn/ohlc?symbol=VN30F1M&period=1m&count=100"
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
