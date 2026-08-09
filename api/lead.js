export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const target = process.env.LEAD_BOT_URL;
  const secret = process.env.LEAD_SECRET;

  if (!target || !secret) {
    return res
      .status(500)
      .json({ ok: false, error: "Server is not configured (missing env)" });
  }

  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, secret }),
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ ok: false, error: "Backend unreachable" });
  }
}