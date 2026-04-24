import { requireAdminApiKey } from "../../../../utils/adminAuth";
import { supabaseAdmin } from "../../../../utils/supabaseAdmin";

const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const MIME_TO_EXTENSION = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

function sanitizeBase64(content = "") {
  return String(content)
    .replace(/^data:[^;]+;base64,/, "")
    .replace(/\s+/g, "");
}

function getExtension(fileName = "", contentType = "") {
  const extensionFromName = String(fileName)
    .toLowerCase()
    .match(/\.([a-z0-9]+)$/)?.[1];

  if (extensionFromName) {
    return extensionFromName;
  }

  return MIME_TO_EXTENSION[contentType] || "jpg";
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "12mb",
    },
  },
};

export default async function handler(req, res) {
  if (!requireAdminApiKey(req, res)) {
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const fileName = req.body?.fileName || "";
    const contentType = String(req.body?.contentType || "").toLowerCase();
    const dataBase64 = sanitizeBase64(req.body?.dataBase64 || "");

    if (!dataBase64) {
      return res.status(400).json({ error: "File mancante." });
    }

    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      return res
        .status(400)
        .json({ error: "Formato immagine non supportato." });
    }

    const fileBuffer = Buffer.from(dataBase64, "base64");

    if (!fileBuffer.length) {
      return res.status(400).json({ error: "File vuoto." });
    }

    if (fileBuffer.length > MAX_UPLOAD_SIZE_BYTES) {
      return res
        .status(400)
        .json({ error: "Immagine troppo grande. Limite 8MB." });
    }

    const extension = getExtension(fileName, contentType);
    const filePath = `events/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("event_img")
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabaseAdmin.storage.from("event_img").getPublicUrl(filePath);

    return res.status(201).json({
      url: data?.publicUrl || "",
      path: filePath,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Upload non riuscito.",
    });
  }
}
