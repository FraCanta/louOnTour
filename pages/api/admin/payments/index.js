import { requireAdminApiKey } from "../../../../utils/adminAuth";
import { supabaseAdmin } from "../../../../utils/supabaseAdmin";

export default async function handler(req, res) {
  if (!(await requireAdminApiKey(req, res))) {
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("event_bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json({ payments: data || [] });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Errore nel caricamento pagamenti." });
  }
}

