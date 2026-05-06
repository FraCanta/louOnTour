import { MaskText } from "../UI/MaskText";
import TestimonialsCarousel from "./testimonialsCarousel";
import CtaOutline from "../button/CtaOutline";
import CtaPrimary from "../button/CtaPrimary";

const AboutMe = ({ translation }) => {
  return (
    <div className="about_me min-h-[80vh] qhd:min-h-[86vh] w-full px-4 text-[#fef3ea] flex items-center overflow-x-hidden">
      <div className="grid content-center w-full qhd:max-w-[2304px] h-full grid-cols-1 py-10 qhd:py-20 mx-auto lg:grid-cols-2 gap-14 md:gap-14 xl:gap-10 qhd:gap-20 justify-items-start">
        <div className="flex flex-col justify-center w-full gap-4 qhd:gap-7 mx-auto xl:w-4/5 qhd:w-[86%]">
          <h2 className="text-base lg:text-xl qhd:text-[1.55rem] font-semibold px-3 lg:px-4 qhd:px-5 py-2 qhd:py-3 bg-[#CE9486]/20 rounded-full max-w-max tracking-wide">
            {translation?.subTitle}
          </h2>
          <MaskText>
            <h2 className="text-3xl md:text-5xl qhd:text-[4.4rem] 3xl:text-[100px] font-bold !text-principle qhd:leading-[4.9rem]">
              {translation?.title}
            </h2>
          </MaskText>
          <p className="max-w-5xl qhd:max-w-6xl mb-8 text-base 2xl:text-lg qhd:text-2xl qhd:leading-10 3xl:text-3xl text-para/90">
            {translation?.paragraph}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <CtaOutline link="/chi-sono">{translation?.button}</CtaOutline>
            <CtaPrimary
              target="_blank"
              link="https://www.airbnb.it/experiences/3583595"
            >
              {translation?.button2}
            </CtaPrimary>
          </div>
        </div>
        <div className="w-full mx-auto">
          {/* <Testimonials2 translation={translation} /> */}
          <TestimonialsCarousel translation={translation} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
