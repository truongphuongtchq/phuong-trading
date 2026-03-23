export default async function handler(req, res) {
  const candles = [];

  let base = 1250;

  for (let i = 0; i < 120; i++) {
    const open = base;
    const move = (Math.random() - 0.5) * 10;

    const close = open + move;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;

    candles.push({
      time: Math.floor(Date.now() / 1000) - (120 - i) * 60,
      open,
      high,
      low,
      close
    });

    base = close;
  }

  res.status(200).json(candles);
}
