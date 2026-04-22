import { Icon } from "@iconify/react";
import { MaskText } from "../UI/MaskText";
import CtaPrimary from "../button/CtaPrimary";
import CtaOutline from "../button/CtaOutline";

const EventsSection = ({ translation }) => {
  return (
    <section
      id="eventi"
      className="w-full py-20 overflow-x-hidden bg-[#fff8f4] lg:py-32"
    >
      <div className="grid w-11/12 grid-cols-1 gap-10 mx-auto lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="flex flex-col gap-5">
          <h2 className="text-base lg:text-xl font-semibold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full max-w-max tracking-wide">
            {translation?.subTitle}
          </h2>

          <MaskText>
            <h2 className="text-3xl md:text-5xl 3xl:text-[100px] font-bold text-principle md:leading-none lg:leading-none">
              {translation?.title}
            </h2>
          </MaskText>

          <p className="max-w-3xl text-base text-para xl:text-lg 3xl:text-[2rem] 3xl:leading-[3rem]">
            {translation?.paragraph}
          </p>

          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
            {translation?.items?.map((item, index) => (
              <article
                key={index}
                className="rounded-2xl border border-[#CE9486]/20 bg-[#fef3ea] p-5"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-[#CE9486]/20 text-[#c9573c]">
                  <Icon icon={item?.icon} width="20" height="20" />
                </span>
                <h3 className="mb-2 text-xl font-bold text-principle">
                  {item?.title}
                </h3>
                <p className="text-sm leading-6 text-para xl:text-base">
                  {item?.text}
                </p>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-2 lg:flex-row lg:max-w-max">
            <CtaPrimary link="/newsletter">
              {translation?.primaryCta}
            </CtaPrimary>
            <CtaOutline link="mailto:luisaquaglia.tourguide@gmail.com">
              {translation?.secondaryCta}
            </CtaOutline>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-md bg-[#77674E] p-8 text-[#fef3ea] lg:sticky lg:top-24">
          <div className="absolute top-6 right-6 rounded-full bg-[#fef3ea]/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#fef3ea]">
            {translation?.badge}
          </div>

          <div className="flex flex-col h-full gap-6 pt-10">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fef3ea]/10">
                <Icon icon="hugeicons:calendar-03" width="22" height="22" />
              </span>
              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#fef3ea]/80">
                {translation?.asideEyebrow}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-3xl font-bold leading-tight lg:text-4xl text-[#CE9486]">
                {translation?.asideTitle}
              </h3>
              <p className="text-base leading-7 text-[#fef3ea]/80 xl:text-lg">
                {translation?.asideText}
              </p>
            </div>

            <div className="rounded-md border border-[#fef3ea]/15 bg-[#fef3ea]/5 p-2 lg:p-5">
              <p className="text-sm leading-6 text-[#fef3ea]/85 xl:text-base">
                {translation?.asideNote}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventsSection;
