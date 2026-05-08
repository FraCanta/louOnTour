import React from "react";

const ContactForm = ({ translation }) => {
  return (
    <div className="w-11/12 qhd:max-w-[2304px] mx-auto pb-8 qhd:pb-16">
      <div className="lg:h-[700px] qhd:h-[900px] w-full bgForm overflow-x-hidden">
        <div className="layerForm1"></div>
        <div className="layerForm2"></div>
        <div className="layerForm3"></div>
        <div className="layerForm4"></div>
        <div className="layerForm5"></div>
        <div className="layerForm6"></div>
        <div className="layerForm7"></div>
        <div className="layerForm8"></div>
        <div className="layerForm9"></div>
        <div className="layerForm10"></div>
        <div className="layerForm11"></div>
        <div className="layerForm12"></div>
        <div className="layerForm13"></div>
        <div className="layerForm14"></div>

        <div className="flex-none lg:flex-1"></div>
        <div className="flex-nonew-full mx-auto lg:flex-1 flex items-center">
          <div className="w-full border border-[#FE6847] bg-white z-10 p-6 lg:p-10 qhd:p-14 flex flex-col gap-8 qhd:gap-10">
            <h2 className="text-2xl font-bold xl:text-4xl qhd:text-5xl">
              {translation.formTitle}:
            </h2>
            <ul className="flex flex-col gap-4 qhd:gap-6 text-base xl:text-xl qhd:text-3xl">
              <li>
                <strong>- Phone:</strong>{" "}
                <a href="tel:+393200327355">+39 320 032 7355</a>
              </li>
              <li>
                <strong>- Email:</strong>{" "}
                <a href="mailto:luisaquaglia.tourguide@gmail.com">
                  luisaquaglia.tourguide@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
