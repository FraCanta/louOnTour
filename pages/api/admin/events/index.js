import { createEvent, getAdminEvents } from "../../../../utils/events";
import { requireAdminApiKey } from "../../../../utils/adminAuth";
import { revalidateEventPages } from "../../../../utils/revalidateEventPages";

export default async function handler(req, res) {
  if (!(await requireAdminApiKey(req, res))) {
    return;
  }

  try {
    // 📥 GET - lista eventi admin
    if (req.method === "GET") {
      const events = await getAdminEvents();
      return res.status(200).json({ events });
    }

    // ➕ POST - crea evento
    if (req.method === "POST") {
      const event = await createEvent(req.body);
      await revalidateEventPages(res, event.slug);
      return res.status(201).json({ event });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Bad request",
    });
  }
}
