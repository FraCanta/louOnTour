export const TOUR_BOOKING_WINDOW = {
  startTime: "10:30",
  endTime: "17:00",
  stepMinutes: 30,
};

export const TOUR_PRICE_PRESETS = [
  {
    key: "two-hours",
    label: { it: "2 ore", en: "2 hours" },
    durationMinutes: 120,
    priceCents: 18000,
  },
  {
    key: "three-hours",
    label: { it: "3 ore", en: "3 hours" },
    durationMinutes: 180,
    priceCents: 21000,
  },
  {
    key: "half-day",
    label: { it: "Half-day", en: "Half-day" },
    durationMinutes: 240,
    priceCents: 40000,
  },
];

export function getDefaultTourPricePreset() {
  return TOUR_PRICE_PRESETS[0];
}

export function getTourPricePreset(key) {
  return (
    TOUR_PRICE_PRESETS.find((preset) => preset.key === key) ||
    getDefaultTourPricePreset()
  );
}

export function getTourPricePresetLabel(preset, locale = "it") {
  const lang = locale === "en" ? "en" : "it";
  return preset?.label?.[lang] || preset?.label?.it || "";
}

export function timeToMinutes(time = "00:00") {
  const [hours, minutes] = String(time).split(":").map(Number);
  return Number(hours || 0) * 60 + Number(minutes || 0);
}

export function minutesToTime(totalMinutes) {
  const hours = Math.floor(Number(totalMinutes || 0) / 60);
  const minutes = Number(totalMinutes || 0) % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
