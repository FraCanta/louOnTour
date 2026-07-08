import { syncGoogleCalendar } from "../../utils/googleCalendar";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const expected = String(process.env.GOOGLE_CALENDAR_CHANNEL_TOKEN || "");
  const received = String(req.headers["x-goog-channel-token"] || "");
  if (!expected || received !== expected) return res.status(401).end();
  try {
    if (req.headers["x-goog-resource-state"] !== "sync") await syncGoogleCalendar();
    return res.status(200).end();
  } catch (error) {
    console.error("[google-calendar-webhook]", error.message);
    return res.status(500).end();
  }
}

