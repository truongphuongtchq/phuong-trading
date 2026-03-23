export default async function handler(req, res) {
  try {
    const symbol = "VNINDEX"; // có thể đổi sau

    const url = `https://tvc4.forexpros.com/1f5f9f2e3f3a4a6a9e0c6f/history?symbol=${symbol}&resolution=1&from=${Math.floor(Date.now()/1000)-3600*24}&to=${Math.floor(Date.now()/1000)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await response.json();

    if (!data || !data.t) {
      return res.status(200).json([]);
    }

    const candles = data.t.map((time, i) => ({
      time: time,
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i]
    }));

    res.status(200).json(candles);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
