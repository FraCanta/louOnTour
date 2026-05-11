import { requireAdminApiKey } from "../../../../utils/adminAuth";
import { supabaseAdmin } from "../../../../utils/supabaseAdmin";

const DEFAULT_SETTINGS = {
  brand_name: "Luisa Quaglia",
  brand_subtitle: "Tour Guide Admin",
  logo_text: "LQ",
  logo_url: "",
  accent_color: "#C9573C",
  theme: "light",
  density: "comfortable",
  show_calendar: true,
  show_success_chart: true,
  settings: {},
};

function getBearerToken(req) {
  const authorization = req.headers.authorization;

  if (typeof authorization !== "string") {
    return "";
  }

  return authorization.replace(/^Bearer\s+/i, "").trim();
}

async function getRequestUser(req) {
  const token = getBearerToken(req);

  if (!token) {
    return null;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return null;
  }

  return data.user;
}

function normalizeString(value, fallback = "") {
  return String(value ?? fallback).trim();
}

function normalizeColor(value) {
  const color = normalizeString(value, DEFAULT_SETTINGS.accent_color);

  return /^#[0-9a-f]{6}$/i.test(color) ? color.toUpperCase() : "#C9573C";
}

function normalizeSettingsPayload(payload = {}) {
  const theme = payload.theme === "dark" ? "dark" : "light";
  const density = payload.density === "compact" ? "compact" : "comfortable";

  return {
    brand_name: normalizeString(payload.brand_name, DEFAULT_SETTINGS.brand_name),
    brand_subtitle: normalizeString(
      payload.brand_subtitle,
      DEFAULT_SETTINGS.brand_subtitle,
    ),
    logo_text: normalizeString(payload.logo_text, DEFAULT_SETTINGS.logo_text)
      .slice(0, 4)
      .toUpperCase(),
    logo_url: normalizeString(payload.logo_url),
    accent_color: normalizeColor(payload.accent_color),
    theme,
    density,
    show_calendar: payload.show_calendar !== false,
    show_success_chart: payload.show_success_chart !== false,
    settings:
      payload.settings && typeof payload.settings === "object"
        ? payload.settings
        : {},
  };
}

function normalizeProfilePayload(payload = {}, user) {
  return {
    email: normalizeString(payload.email, user?.email || ""),
    display_name: normalizeString(payload.display_name),
    avatar_url: normalizeString(payload.avatar_url),
    role: normalizeString(payload.role, "admin") || "admin",
    preferences:
      payload.preferences && typeof payload.preferences === "object"
        ? payload.preferences
        : {},
  };
}

function getUserDisplayName(user) {
  const metadata = user?.user_metadata || {};
  const displayName =
    metadata.full_name || metadata.name || metadata.display_name || "";

  return normalizeString(displayName);
}

async function readSettings() {
  const { data, error } = await supabaseAdmin
    .from("admin_settings")
    .select("*")
    .eq("id", "global")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data || { id: "global", ...DEFAULT_SETTINGS };
}

function resolveProfileSettings(profile) {
  const dashboardSettings =
    profile?.preferences && typeof profile.preferences === "object"
      ? profile.preferences.dashboardSettings
      : null;

  if (!dashboardSettings || typeof dashboardSettings !== "object") {
    return null;
  }

  return normalizeSettingsPayload(dashboardSettings);
}

async function readProfile(user) {
  if (!user?.id) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("admin_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const metadataDisplayName = getUserDisplayName(user);

  if (data) {
    return {
      ...data,
      email: data.email || user.email || "",
      display_name: data.display_name || metadataDisplayName,
    };
  }

  return {
      user_id: user.id,
      email: user.email || "",
      display_name: metadataDisplayName,
      avatar_url: "",
      role: "admin",
      preferences: {},
    };
}

export default async function handler(req, res) {
  if (!(await requireAdminApiKey(req, res))) {
    return;
  }

  if (!["GET", "PATCH"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await getRequestUser(req);

    if (req.method === "GET") {
      const [profile, globalSettings] = await Promise.all([
        readProfile(user),
        readSettings(),
      ]);
      const profileSettings = resolveProfileSettings(profile);
      const settings = profileSettings || globalSettings;

      return res.status(200).json({ profile, settings });
    }

    const nextSettings = req.body?.settings
      ? normalizeSettingsPayload(req.body.settings)
      : null;
    const nextProfile = req.body?.profile
      ? normalizeProfilePayload(req.body.profile, user)
      : null;

    let savedSettings = null;
    let savedProfile = null;

    if (nextSettings) {
      if (user?.id) {
        const { data: existingProfile, error: existingProfileError } =
          await supabaseAdmin
            .from("admin_profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        if (existingProfileError) {
          throw new Error(existingProfileError.message);
        }

        const currentPreferences =
          existingProfile?.preferences &&
          typeof existingProfile.preferences === "object"
            ? existingProfile.preferences
            : {};

        const { data, error } = await supabaseAdmin
          .from("admin_profiles")
          .upsert({
            user_id: user.id,
            email: existingProfile?.email || user.email || "",
            display_name: existingProfile?.display_name || getUserDisplayName(user),
            avatar_url: existingProfile?.avatar_url || "",
            role: existingProfile?.role || "admin",
            preferences: {
              ...currentPreferences,
              dashboardSettings: nextSettings,
            },
            updated_at: new Date().toISOString(),
          })
          .select("*")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        savedProfile = data;
        savedSettings = nextSettings;
      } else {
        const { data, error } = await supabaseAdmin
          .from("admin_settings")
          .upsert({
            id: "global",
            ...nextSettings,
            updated_by: user?.id || null,
            updated_at: new Date().toISOString(),
          })
          .select("*")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        savedSettings = data;
      }
    }

    if (nextProfile) {
      if (!user?.id) {
        return res.status(400).json({
          error: "Profilo disponibile solo con login Supabase.",
        });
      }

      const { data, error } = await supabaseAdmin
        .from("admin_profiles")
        .upsert({
          user_id: user.id,
          ...nextProfile,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      savedProfile = data;
    }

    const profile = savedProfile || (await readProfile(user));
    const globalSettings = savedSettings || (await readSettings());
    const profileSettings = resolveProfileSettings(profile);
    const settings = profileSettings || globalSettings;

    return res.status(200).json({ profile, settings });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Errore nel salvataggio preferenze admin.",
    });
  }
}
