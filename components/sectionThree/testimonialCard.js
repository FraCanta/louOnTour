import React, { useState } from "react";
import { SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import "swiper/css/bundle";

const TestimonialCard = ({ review }) => {
  const starsArray = (rating) => new Array(rating).fill(1); //trasformo il numero in array per mapparlo
  const [expandText, setExpandText] = useState({
    expanded: false,
    clamp: "line-clamp",
  });

  const handleReadMore = () => {
    if (expandText.expanded) {
      setExpandText({ expanded: false, clamp: "line-clamp" });
    } else {
      setExpandText({ expanded: true, clamp: "box-folded--expanded" });
    }
  };

  return (
    <SwiperSlide>
      <div className="content-wrapper">
        <div className="content">
          <div className="flex items-center w-full justify-between py-2 px-4">
            <div className="flex items-center">
              <div className="avatar placeholder mr-2">
                <div className="w-8 rounded-full ring ring-[#fe6847] ">
                  <span className="text-xs text-[#fe6847]">
                    <Image
                      src={review?.img_reviews}
                      width={20}
                      height={20}
                      alt="avatar"
                    />
                  </span>
                </div>
              </div>
              <div className="text-md text-[#fe6847] font-bold ml-2 flex flex-col items-start">
                {review?.name}
                <div className="flex">
                  {starsArray(review?.rating).map((star, i) => (
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
              {review?.date}
            </span>
          </div>
          <div>
            <span
              className={`${expandText.clamp} text-[#232F37] text-[0.9rem]`}
            >
              {review?.reviews_desc}
            </span>
          </div>
          {review?.reviews_desc?.length > 220 && (
            <span className="box-folded__trigger" onClick={handleReadMore}>
              + read more
            </span>
          )}
        </div>
      </div>
    </SwiperSlide>
  );
};

export default TestimonialCard;
