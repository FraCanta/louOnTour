import { requireAdminApiKey } from "../../../utils/adminAuth";
import { buildGoogleAuthorizationUrl, exchangeGoogleCode, getGoogleCalendars, getGoogleCalendarStatus, saveGoogleCalendars, syncGoogleCalendar, verifyGoogleOAuthState, watchGoogleCalendar } from "../../../utils/googleCalendar";

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  try {
    if (req.method === "GET" && req.query.action === "callback") {
      if (!verifyGoogleOAuthState(req.query.state)) return res.status(400).send("Stato OAuth non valido.");
      await exchangeGoogleCode(String(req.query.code || ""));
      return res.redirect(302, "/admin?google=connected");
    }
    if (!(await requireAdminApiKey(req, res))) return;
    if (req.method === "GET" && req.query.action === "authorize") return res.status(200).json({ url: buildGoogleAuthorizationUrl() });
    if (req.method === "GET" && req.query.action === "calendars") return res.status(200).json(await getGoogleCalendars());
    if (req.method === "GET") return res.status(200).json(await getGoogleCalendarStatus());
    if (req.method === "PUT" && req.query.action === "calendars") return res.status(200).json(await saveGoogleCalendars(req.body?.calendarIds));
    if (req.method === "POST" && req.query.action === "sync") return res.status(200).json(await syncGoogleCalendar());
    if (req.method === "POST" && req.query.action === "watch") return res.status(200).json(await watchGoogleCalendar());
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Operazione Google Calendar non riuscita." });
  }
}
