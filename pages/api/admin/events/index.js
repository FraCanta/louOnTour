import {
  createEvent,
  getAdminEvents,
} from "../../../../utils/events";
import { requireAdminApiKey } from "../../../../utils/adminAuth";

export default async function handler(req, res) {
  if (!requireAdminApiKey(req, res)) {
    return;
  }

  try {
    if (req.method === "GET") {
      const events = await getAdminEvents();
      return res.status(200).json({ events });
    }

    if (req.method === "POST") {
      const event = await createEvent(req.body);
      return res.status(201).json({ event });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Bad request" });
  }
}
