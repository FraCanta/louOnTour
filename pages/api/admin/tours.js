import { requireAdminApiKey } from "../../../utils/adminAuth";
import { createTour, deleteTour, getAdminTours, updateTour } from "../../../utils/tours";
import { supabaseAdmin } from "../../../utils/supabaseAdmin";

export default async function handler(req, res) {
  if (!(await requireAdminApiKey(req, res))) return;
  try {
    if (req.method === "GET" && req.query.action === "bookings") {
      const { data, error } = await supabaseAdmin.from("tour_bookings").select("*").order("starts_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json({ bookings: data || [] });
    }
    if (req.method === "GET") return res.status(200).json({ tours: await getAdminTours() });
    if (req.method === "POST") return res.status(201).json({ tour: await createTour(req.body) });
    if (req.method === "PUT") return res.status(200).json({ tour: await updateTour(req.query.slug, req.body) });
    if (req.method === "DELETE") {
      await deleteTour(req.query.slug);
      return res.status(200).json({ ok: true });
    }
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Bad request" });
  }
}
