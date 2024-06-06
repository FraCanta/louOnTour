import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";

const TestimonialsCarousel = ({ translation }) => {
  let timeOut = useRef(null);
  const starsArray = (rating) => new Array(rating).fill(1); //trasformo il numero in array per mapparlo
  const [expandText, setExpandText] = useState({
    expanded: false,
    clamp: "line-clamp",
    button: "+ read more",
  });

  const handleReadMore = () => {
    if (expandText.expanded) {
      setExpandText({
        expanded: false,
        clamp: "line-clamp",
        button: "+ read more",
      });
    } else {
      setExpandText({
        expanded: true,
        clamp: "",
        button: "- read less",
      });
    }
  };
  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "60px",
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {translation.reviews.map((testimonial, index) => (
        <div
          key={index}
          className="p-6"
          onMouseOut={() => {
            expandText.expanded &&
              !timeOut.current &&
              (timeOut.current = setTimeout(() => handleReadMore(), 8000));
          }}
        >
          <div key={index} className="testimonial-container pb-10">
            <div className="testimonial">
              <div className="flex items-center w-full justify-between py-2 px-4">
                <div className="flex items-center">
                  <div className="avatar placeholder mr-2">
                    <div className="w-8 rounded-full ring ring-[#fe6847] ">
                      <span className="text-xs text-[#fe6847]">
                        <Image
                          src={testimonial?.img_reviews}
                          width={20}
                          height={20}
                          alt="avatar"
                          className="object-cover"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="text-md text-[#fe6847] font-bold ml-2 flex flex-col items-start">
                    {testimonial?.name}
                    <div className="flex">
                      {starsArray(testimonial?.rating).map((star, i) => (
                        <a key={i}>
                          <Icon
                            icon="ant-design:star-filled"
                            color="#ffe600"
                            width="15"
                            key={star}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[#232F37] text-xs py-4 px-4 font-bold">
                  {testimonial?.date}
                </span>
              </div>
              <div>
                <span
                  // className={`${expandText.clamp} text-[#232F37] text-[0.9rem]`}
                  className="text-[#232F37] text-[0.9rem] line-clamp"
                >
                  {testimonial?.reviews_desc}
                </span>
                {/* {testimonial?.reviews_desc?.length > 220 && (
                  <span
                    className="box-folded__trigger"
                    onClick={handleReadMore}
                  >
                    {expandText.button}
                  </span>
                )} */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default TestimonialsCarousel;
