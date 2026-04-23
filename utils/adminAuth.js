export function requireAdminApiKey(req, res) {
  const runtimeKey =
    process.env.ADMIN_API_KEY ||
    (process.env.NODE_ENV !== "production" ? "lou-demo-2026" : "");

  if (!runtimeKey) {
    res.status(500).json({
      error:
        "ADMIN_API_KEY non configurata. Imposta la variabile ambiente per usare le API admin.",
    });
    return false;
  }

  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();
  const headerKey = req.headers["x-admin-key"];
  const providedKey = bearer || headerKey;

  if (providedKey !== runtimeKey) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  return true;
}
