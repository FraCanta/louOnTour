import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";

const DEFAULT_SLOTS = [
  { startTime: "10:30", endTime: "12:30" },
  { startTime: "14:30", endTime: "16:30" },
];

const text = (value = "") => String(value || "").trim();
const money = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : fallback;
};

function localized(value, lang) {
  if (value && typeof value === "object") return value[lang] || value.it || "";
  return text(value);
}

export function normalizeTourPayload(payload = {}) {
  const slots = Array.isArray(payload.availability_rules)
    ? payload.availability_rules
        .map((slot) => ({
          startTime: text(slot.startTime),
          endTime: text(slot.endTime),
        }))
        .filter((slot) => slot.startTime && slot.endTime)
    : DEFAULT_SLOTS;

  return {
    slug: text(payload.slug),
    status: payload.status === "published" ? "published" : "draft",
    featured: Boolean(payload.featured),
    hero_image: text(payload.hero_image || payload.heroImage),
    gallery: Array.isArray(payload.gallery) ? payload.gallery.map(text).filter(Boolean) : [],
    title: { it: text(payload.title?.it), en: text(payload.title?.en) },
    excerpt: { it: text(payload.excerpt?.it), en: text(payload.excerpt?.en) },
    location: { it: text(payload.location?.it), en: text(payload.location?.en) },
    duration_minutes: money(payload.duration_minutes, 120) || 120,
    price_mode: payload.price_mode === "per_person" ? "per_person" : "per_booking",
    base_price_cents: money(payload.base_price_cents, 18800),
    currency: text(payload.currency || "eur").toLowerCase(),
    extension_enabled: payload.extension_enabled !== false,
    extension_minutes: money(payload.extension_minutes, 30) || 30,
    extension_price_cents: money(payload.extension_price_cents, 2000),
    meeting_point: {
      it: text(payload.meeting_point?.it),
      en: text(payload.meeting_point?.en),
      link: text(payload.meeting_point?.link),
    },
    languages: { it: text(payload.languages?.it), en: text(payload.languages?.en) },
    included: {
      it: Array.isArray(payload.included?.it) ? payload.included.it.map(text).filter(Boolean) : [],
      en: Array.isArray(payload.included?.en) ? payload.included.en.map(text).filter(Boolean) : [],
    },
    description: {
      it: Array.isArray(payload.description?.it) ? payload.description.it.map(text).filter(Boolean) : [],
      en: Array.isArray(payload.description?.en) ? payload.description.en.map(text).filter(Boolean) : [],
    },
    availability_rules: slots.length ? slots : DEFAULT_SLOTS,
    booking_horizon_days: money(payload.booking_horizon_days, 180) || 180,
    minimum_notice_hours: money(payload.minimum_notice_hours, 48),
    updated_at: new Date().toISOString(),
  };
}

export function localizeTour(tour, locale = "it") {
  const lang = locale === "en" ? "en" : "it";
  return {
    ...tour,
    heroImage: tour.hero_image || "",
    title: localized(tour.title, lang),
    excerpt: localized(tour.excerpt, lang),
    location: localized(tour.location, lang),
    meetingPoint: localized(tour.meeting_point, lang),
    meetingPointLink: tour.meeting_point?.link || "",
    languages: localized(tour.languages, lang),
    included: tour.included?.[lang] || tour.included?.it || [],
    description: tour.description?.[lang] || tour.description?.it || [],
  };
}

export async function getAllTours(locale = "it", { includeDrafts = false } = {}) {
  let query = supabase.from("tours").select("*").order("created_at", { ascending: true });
  if (!includeDrafts) query = query.eq("status", "published");
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).map((tour) => localizeTour(tour, locale));
}

export async function getTourBySlug(slug, locale = "it", { includeDrafts = false } = {}) {
  let query = supabase.from("tours").select("*").eq("slug", slug);
  if (!includeDrafts) query = query.eq("status", "published");
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data ? localizeTour(data, locale) : null;
}

export async function getAdminTours() {
  const { data, error } = await supabaseAdmin.from("tours").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createTour(payload) {
  const tour = normalizeTourPayload(payload);
  if (!tour.slug || !tour.title.it || !tour.title.en) throw new Error("Slug e titoli IT/EN sono obbligatori.");
  const { data, error } = await supabaseAdmin.from("tours").insert(tour).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTour(slug, payload) {
  const tour = normalizeTourPayload(payload);
  if (!tour.slug || !tour.title.it || !tour.title.en) throw new Error("Slug e titoli IT/EN sono obbligatori.");
  const { data, error } = await supabaseAdmin.from("tours").update(tour).eq("slug", slug).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTour(slug) {
  const { error } = await supabaseAdmin.from("tours").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}


export async function importLegacyTours() {
  const italian = translationIT?.tours?.locationTours || {};
  const english = translationEN?.tours?.locationTours || {};
  const records = Object.keys(italian).map((slug) => {
    const it = italian[slug] || {};
    const en = english[slug] || {};
    return normalizeTourPayload({
      slug,
      status: "published",
      hero_image: it.img || en.img || "",
      gallery: (it.tourItem || []).map((item) => item.img).filter(Boolean),
      title: { it: it.titleImg || it.name || slug, en: en.titleImg || en.name || slug },
      excerpt: { it: it.descrizione2 || "", en: en.descrizione2 || "" },
      location: { it: it.name || slug, en: en.name || slug },
      description: {
        it: (it.descrizione || []).map((item) => item.p || "").filter(Boolean),
        en: (en.descrizione || []).map((item) => item.p || "").filter(Boolean),
      },
      included: { it: (it.list || []).map((item) => item?.l?.title || "").filter(Boolean), en: (en.list || []).map((item) => item?.l?.title || "").filter(Boolean) },
      base_price_cents: 18800,
      extension_price_cents: 2000,
      extension_minutes: 30,
    });
  });
  const { data, error } = await supabaseAdmin.from("tours").upsert(records, { onConflict: "slug", ignoreDuplicates: true }).select();
  if (error) throw new Error(error.message);
  return data || [];
}
