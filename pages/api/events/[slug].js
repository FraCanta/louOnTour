import { getEventBySlug, getEventsPageCopy } from "../../../utils/events";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const locale = req.query.locale || "it";
    const event = await getEventBySlug(req.query.slug, locale);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const copy = await getEventsPageCopy(locale);
    return res.status(200).json({ copy, event });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
