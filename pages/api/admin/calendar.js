import { requireAdminApiKey } from "../../../utils/adminAuth";
import { supabaseAdmin } from "../../../utils/supabaseAdmin";
import { pushCalendarEntryToGoogle } from "../../../utils/googleCalendar";
import { localDateTimeToIso } from "../../../utils/tourCalendar";

export default async function handler(req, res) {
  if (!(await requireAdminApiKey(req, res))) return;
  try {
    if (req.method === "GET") {
      const from = String(req.query.from || new Date().toISOString());
      const to = String(req.query.to || new Date(Date.now() + 180 * 86400000).toISOString());
      const { data, error } = await supabaseAdmin.from("calendar_entries").select("*").gte("starts_at", from).lte("starts_at", to).order("starts_at");
      if (error) throw error;
      return res.status(200).json({ entries: data || [] });
    }
    if (req.method === "POST") {
      const startsAt = req.body.date ? localDateTimeToIso(req.body.date, req.body.startTime) : req.body.starts_at;
      const endsAt = req.body.date ? localDateTimeToIso(req.body.date, req.body.endTime) : req.body.ends_at;
      const { data, error } = await supabaseAdmin.from("calendar_entries").insert({
        source_type: "manual", source_id: String(req.body.source_id || `manual-${Date.now()}`),
        tour_slug: req.body.tour_slug || null, title: String(req.body.title || "Blocco manuale"),
        starts_at: startsAt, ends_at: endsAt, status: "confirmed",
        metadata: req.body.metadata || {},
      }).select().single();
      if (error) throw error;
      try { await pushCalendarEntryToGoogle(data.id); } catch (googleError) { console.warn("[calendar] Google push skipped:", googleError.message); }
      return res.status(201).json({ entry: data });
    }
    if (req.method === "DELETE") {
      const { error } = await supabaseAdmin.from("calendar_entries").delete().eq("id", req.query.id).eq("source_type", "manual");
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Bad request" });
  }
}
