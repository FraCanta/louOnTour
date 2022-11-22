import React from "react";
import Image from "next/image";

const AboutGallery = ({ aboutme }) => {
  return (
    <div className="min-h-[50vh] pb-20">
      <div className="container mx-auto w-11/12 lg:w-4/5 ">
        <h3 className="text-3xl md:text-[40px] font-medium mt-2 leading-10 text-[#232F37] lg:text-center pb-4">
          Foto di me, fatte da voi
        </h3>
        <div className="w-full h-[1px] bg-black bg-opacity-20"></div>

        <div className="gallery pt-8">
          {aboutme?.map((el, i) => (
            <>
              <div class="gallery-item" key={i}>
                <Image
                  className="gallery-image"
                  src={el}
                  alt={el?.titleImg}
                  priority
                  width={900}
                  height={900}
                  //   onClick={() => handleModal(el)}
                />
                {/* <ModalGallery handleModal={handleModal} showModal={showModal} /> */}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutGallery;
