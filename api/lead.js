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

  let body = {};
  try {
    const raw = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid request body" });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    let upstream;
    try {
      upstream = await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, secret }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    res.status(upstream.status).json(data);
  } catch (err) {
    const timedOut = err && err.name === "AbortError";
    res.status(timedOut ? 504 : 502).json({
      ok: false,
      error: timedOut ? "Backend timed out" : "Backend unreachable",
    });
  }
}