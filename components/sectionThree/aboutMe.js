import { MaskText } from "../UI/MaskText";
import TestimonialsCarousel from "./testimonialsCarousel";
import CtaOutline from "../button/CtaOutline";

const AboutMe = ({ translation }) => {
  return (
    <div className="about_me min-h-[80vh] w-full  px-4 text-[#fef3ea] flex items-center  overflow-x-hidden">
      <div className="grid content-center w-full h-full grid-cols-1 pt-10 mx-auto lg:grid-cols-2 gap-14 md:gap-14 xl:gap-10 justify-items-start">
        <div className="flex flex-col justify-center w-full gap-4 mx-auto xl:w-4/5 ">
          <h2 className="text-base lg:text-xl font-semibold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full max-w-max tracking-wide">
            {translation?.subTitle}
          </h2>
          <MaskText>
            <h2 className="text-4xl md:text-5xl 3xl:text-[100px] font-bold !text-principle">
              {translation?.title}
            </h2>
          </MaskText>
          <p className="max-w-5xl mb-8 text-base 2xl:text-lg 3xl:text-3xl text-para/90">
            {translation?.paragraph}
          </p>

          <CtaOutline link="/chi-sono">{translation?.button}</CtaOutline>
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
