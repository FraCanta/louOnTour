import { requireAdminApiKey } from "../../../../utils/adminAuth";
import { unsyncEventFromGoogleCalendar } from "../../../../utils/googleCalendar";

export default async function handler(req, res) {
  if (!(await requireAdminApiKey(req, res))) {
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const slug = String(req.body?.slug || "").trim();

    if (!slug) {
      return res.status(400).json({ error: "Slug mancante." });
    }

    const result = await unsyncEventFromGoogleCalendar(slug);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Bad request" });
  }
}
