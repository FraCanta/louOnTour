import { supabaseAdmin } from "../../../../utils/supabaseAdmin";
import { requireAdminApiKey } from "../../../../utils/adminAuth";

export default async function handler(req, res) {
  if (!requireAdminApiKey(req, res)) {
    return;
  }

  try {
    // 📥 GET - lista eventi admin
    if (req.method === "GET") {
      const { data, error } = await supabaseAdmin
        .from("events")
        .select("*")
        .order("dates", { ascending: true });

      if (error) throw error;

      return res.status(200).json({ events: data });
    }

    // ➕ POST - crea evento
    if (req.method === "POST") {
      const payload = req.body;

      const { data, error } = await supabaseAdmin
        .from("events")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ event: data });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Bad request",
    });
  }
}
