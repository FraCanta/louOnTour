import { requireAdminApiKey } from "../../../../utils/adminAuth";
import { getGoogleCalendarStatusFromData } from "../../../../utils/googleCalendar";

export default async function handler(req, res) {
  if (!(await requireAdminApiKey(req, res))) {
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const status = await getGoogleCalendarStatusFromData();
    return res.status(200).json({ status });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
