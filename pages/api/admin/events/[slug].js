import {
  deleteEvent,
  getAdminEventBySlug,
  updateEvent,
} from "../../../../utils/events";
import { requireAdminApiKey } from "../../../../utils/adminAuth";
import { revalidateEventPages } from "../../../../utils/revalidateEventPages";

export default async function handler(req, res) {
  if (!(await requireAdminApiKey(req, res))) {
    return;
  }

  try {
    if (req.method === "GET") {
      const event = await getAdminEventBySlug(req.query.slug);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      return res.status(200).json({ event });
    }

    if (req.method === "PUT") {
      const event = await updateEvent(req.query.slug, req.body);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      await revalidateEventPages(res, event.slug, req.query.slug);
      return res.status(200).json({ event });
    }

    if (req.method === "DELETE") {
      const deleted = await deleteEvent(req.query.slug);

      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }

      await revalidateEventPages(res, req.query.slug);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Bad request" });
  }
}
