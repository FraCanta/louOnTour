import { getAllEvents, getEventsPageCopy } from "../../../utils/events";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const locale = req.query.locale || "it";
    const copy = await getEventsPageCopy(locale);
    const events = await getAllEvents(locale);

    return res.status(200).json({
      copy,
      featuredEvent: events[0] || null,
      events,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
