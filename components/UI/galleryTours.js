import React from "react";
import Image from "next/image";
import Lou from "../../public/assets/lou.jpg";
import Siena from "../../public/assets/locationTour/siena/Siena-Cattedrale-Pavimento-Navata-centrale.jpeg";

const GalleryTours = ({ city }) => {
  return (
    <div className="min-h-[50vh] ">
      <div className="container mx-auto w-11/12 lg:w-4/5 py-10">
        <h3 className="text-3xl md:text-[40px] font-medium mt-2 leading-10 text-[#232F37] lg:text-center pb-4">
          Gallery
        </h3>
        <div className="w-full h-[1px] bg-black bg-opacity-20"></div>

        <div className="gallery pt-8">
          <div class="gallery-item">
            <Image
              className="gallery-image"
              src={Siena}
              alt="person writing in a notebook beside by an iPad, laptop, printed photos, spectacles, and a cup of coffee on a saucer"
            />
          </div>

          <div className="gallery-item">
            <Image
              className="gallery-image"
              src={Siena}
              alt="sunset behind San Francisco city skyline"
            />
          </div>

          <div className="gallery-item">
            <Image
              className="gallery-image"
              src={Siena}
              alt="people holding umbrellas on a busy street at night lit by street lights and illuminated signs in Tokyo, Japan"
            />
          </div>

          <div className="gallery-item">
            <Image
              className="gallery-image"
              src={Siena}
              alt="car interior from central back seat position showing driver and blurred view through windscreen of a busy road at night"
            />
          </div>

          <div className="gallery-item">
            <Image
              className="gallery-image"
              src={Siena}
              alt="back view of woman wearing a backpack and beanie waiting to cross the road on a busy street at night in New York City, USA"
            />
          </div>

          <div className="gallery-item">
            <Image
              className="gallery-image"
              src={Siena}
              alt="man wearing a black jacket, white shirt, blue jeans, and brown boots, playing a white electric guitar while sitting on an amp"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryTours;
