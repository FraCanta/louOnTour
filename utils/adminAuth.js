import { supabaseAdmin } from "./supabaseAdmin";

function getRuntimeAdminKey() {
  return (
    process.env.ADMIN_API_KEY ||
    (process.env.NODE_ENV !== "production" ? "lou-demo-2026" : "")
  );
}

function getAllowedAdminEmails() {
  const raw = process.env.ADMIN_ALLOWED_EMAILS || "";

  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getBearerToken(req) {
  const authorization = req.headers.authorization;

  if (typeof authorization !== "string") {
    return "";
  }

  return authorization.replace(/^Bearer\s+/i, "").trim();
}

function getHeaderApiKey(req) {
  const headerValue = req.headers["x-admin-key"];

  if (Array.isArray(headerValue)) {
    return String(headerValue[0] || "").trim();
  }

  return typeof headerValue === "string" ? headerValue.trim() : "";
}

export async function requireAdminApiKey(req, res) {
  const bearer = getBearerToken(req);
  const headerKey = getHeaderApiKey(req);
  const providedCredential = bearer || headerKey;

  if (!providedCredential) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  const runtimeKey = getRuntimeAdminKey();

  // Backward compatibility: keep supporting ADMIN_API_KEY when configured.
  if (runtimeKey && providedCredential === runtimeKey) {
    return true;
  }

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(providedCredential);

    if (error || !data?.user) {
      res.status(401).json({ error: "Sessione non valida o scaduta." });
      return false;
    }

    const allowedEmails = getAllowedAdminEmails();
    const userEmail = String(data.user.email || "").toLowerCase();

    if (allowedEmails.length > 0 && !allowedEmails.includes(userEmail)) {
      res.status(403).json({ error: "Utente non autorizzato per l'area admin." });
      return false;
    }

    return true;
  } catch (_error) {
    res.status(500).json({ error: "Errore durante la verifica dell'utente admin." });
    return false;
  }
}
