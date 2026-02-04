export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "No TikTok URL" });
  }

  try {
    const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const r = await fetch(api);
    const data = await r.json();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed" });
  }
}
