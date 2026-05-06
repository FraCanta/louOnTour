import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MaskText } from "../UI/MaskText";
import CtaPrimary from "../button/CtaPrimary";
import CtaOutline from "../button/CtaOutline";

const AUTOPLAY_DELAY = 4500;
const GROUP_SIZE_LABEL_IT = "Min 4 - Max 10";
const GROUP_SIZE_LABEL_EN = "Min 4 - Max 10";

const EventsSection = ({ translation, appointments = [], locale = "it" }) => {
  const isItalian = locale !== "en";
  const discoverEventLabel = isItalian ? "Scopri" : "Discover";
  const groupSizeLabel = isItalian ? GROUP_SIZE_LABEL_IT : GROUP_SIZE_LABEL_EN;
  const fallbackTitle = isItalian
    ? "Date in aggiornamento"
    : "Dates being updated";
  const fallbackText = isItalian
    ? "Sto pubblicando i prossimi appuntamenti mese per mese. Torna qui a breve per vedere le nuove date."
    : "I am publishing upcoming appointments month by month. Check back soon to see the new dates.";

  const validAppointments = useMemo(
    () => (appointments || []).filter((item) => item?.id && item?.slug),
    [appointments],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeAppointment = validAppointments[activeIndex] || null;
  const activeMonthLabel = useMemo(() => {
    const firstIso = validAppointments[0]?.iso;

    if (!firstIso) {
      return isItalian ? "giugno" : "June";
    }

    const date = new Date(`${firstIso.slice(0, 10)}T12:00:00`);
    const formatter = new Intl.DateTimeFormat(isItalian ? "it-IT" : "en-US", {
      month: "long",
      timeZone: "Europe/Rome",
    });

    return formatter.format(date);
  }, [isItalian, validAppointments]);
  const badgeText = isItalian
    ? `Date speciali di ${activeMonthLabel}`
    : `Special dates in ${activeMonthLabel}`;

  useEffect(() => {
    setActiveIndex(0);
  }, [validAppointments.length]);

  useEffect(() => {
    if (validAppointments.length < 2) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % validAppointments.length);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(intervalId);
  }, [validAppointments.length]);

  return (
    <section
      id="eventi"
      className="w-full py-20 overflow-x-hidden bg-[#fff8f4] lg:py-32 qhd:py-44"
    >
      <div className="grid w-11/12 qhd:max-w-[2304px] grid-cols-1 gap-10 qhd:gap-16 mx-auto lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="flex flex-col gap-5 qhd:gap-7">
          <h2 className="text-base lg:text-xl qhd:text-[1.55rem] font-semibold px-3 lg:px-4 qhd:px-5 py-2 qhd:py-3 bg-[#CE9486]/20 rounded-full max-w-max tracking-wide">
            {translation?.subTitle}
          </h2>

          <MaskText>
            <h2 className="text-3xl md:text-5xl qhd:text-[4.4rem] 3xl:text-[100px] font-bold text-principle md:leading-none lg:leading-none qhd:leading-[4.9rem]">
              {translation?.title}
            </h2>
          </MaskText>

          <p className="max-w-3xl qhd:max-w-5xl text-base text-para xl:text-lg qhd:text-2xl qhd:leading-10 3xl:text-[2rem] 3xl:leading-[3rem]">
            {translation?.paragraph}
          </p>

          <div className="grid grid-cols-1 gap-4 pt-2 qhd:gap-6 md:grid-cols-3">
            {translation?.items?.map((item, index) => (
              <article
                key={index}
                className="rounded-2xl border border-[#CE9486]/20 bg-[#fef3ea] p-5 qhd:p-7"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-[#CE9486]/20 text-[#c9573c]">
                  <Icon icon={item?.icon} width="20" height="20" />
                </span>
                <h3 className="mb-2 text-xl font-bold qhd:text-3xl text-principle">
                  {item?.title}
                </h3>
                <p className="text-sm leading-6 text-para xl:text-base qhd:text-xl qhd:leading-8">
                  {item?.text}
                </p>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row lg:max-w-max">
            <CtaPrimary link="/eventi" title={translation?.primaryCta}>
              {translation?.primaryCta}
              <Icon
                icon="lets-icons:arrow-right-light"
                width="20"
                height="20"
              />
            </CtaPrimary>
            <CtaOutline
              link="mailto:luisaquaglia.tourguide@gmail.com"
              title={translation?.secondaryCta}
            >
              {translation?.secondaryCta}
            </CtaOutline>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-md bg-[#77674E] p-8 qhd:p-10 text-[#fef3ea] lg:sticky lg:top-24">
          <div className="absolute top-6 right-6 rounded-full bg-[#fef3ea]/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#fef3ea] qhd:text-sm">
            {badgeText}
          </div>

          <div className="flex flex-col h-full gap-6 pt-10">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 qhd:w-14 qhd:h-14 rounded-full bg-[#fef3ea]/10">
                <Icon
                  icon="hugeicons:calendar-03"
                  width="22"
                  height="22"
                  className="qhd:w-8 qhd:h-8"
                />
              </span>
              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#fef3ea]/80 qhd:text-base">
                {translation?.asideEyebrow}
              </p>
            </div>

            {activeAppointment ? (
              <>
                <div className="relative min-h-[350px] qhd:min-h-[470px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.article
                      key={activeAppointment.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="absolute inset-0 p-5 qhd:p-7 rounded-md bg-[#fef3ea]/5 border border-[#fef3ea]/15"
                    >
                      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-[1fr_auto] ">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#fef3ea]/65 qhd:text-sm">
                            {activeAppointment.category}
                          </p>
                          <h3 className="text-2xl qhd:text-5xl font-bold leading-tight text-[#CE9486] ">
                            {activeAppointment.title}
                          </h3>

                          <div className="mt-5 qhd:mt-7 space-y-3 qhd:space-y-4 text-sm qhd:text-2xl text-[#fef3ea]/90">
                            <p className="flex items-center gap-2">
                              <Icon icon="hugeicons:calendar-03" width="16" />
                              <span>{activeAppointment.dateLabel}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Icon
                                icon="hugeicons:time-quarter-pass"
                                width="16"
                              />
                              <span>{activeAppointment.time || "-"}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Icon icon="hugeicons:location-01" width="16" />
                              <span>{activeAppointment.location || "-"}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Icon icon="hugeicons:ticket-01" width="16" />
                              <span>{activeAppointment.price || "-"}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Icon icon="hugeicons:user-group" width="16" />
                              <span>
                                {isItalian
                                  ? "Posti disponibili"
                                  : "Spots available"}
                                : {activeAppointment.spots}
                              </span>
                            </p>
                            <p className="text-xs text-[#fef3ea]/70 qhd:text-base">
                              {groupSizeLabel}
                            </p>
                          </div>
                        </div>

                        <div className="flex md:justify-self-end md:items-end">
                          <Link
                            href={`/eventi/${activeAppointment.slug}`}
                            className="inline-flex items-center gap-2 hover:bg-white rounded-md border border-[#fef3ea]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] qhd:px-6 qhd:py-4 qhd:text-lg text-[#fef3ea]/80 transition hover:text-[#CE9486]"
                          >
                            {discoverEventLabel}
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  </AnimatePresence>
                </div>

                {validAppointments.length > 1 ? (
                  <div className="flex items-center gap-2">
                    {validAppointments.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-[0.1rem] md:h-[0.18rem] rounded-sm transition-all ${
                          index === activeIndex
                            ? "w-8  bg-[#CE9486]"
                            : "w-2.5 bg-white/60 hover:bg-[#fef3ea]/55"
                        }`}
                        aria-label={`${isItalian ? "Vai alla data" : "Go to date"} ${index + 1}`}
                      />
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-md border border-[#fef3ea]/15 bg-[#fef3ea]/5 p-5">
                <h3 className="text-3xl font-bold leading-tight lg:text-4xl text-[#CE9486]">
                  {fallbackTitle}
                </h3>
                <p className="mt-4 text-base leading-7 text-[#fef3ea]/80 xl:text-lg">
                  {fallbackText}
                </p>
                <p className="mt-5 text-sm leading-6 text-[#fef3ea]/85 xl:text-base">
                  {translation?.asideNote}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventsSection;
