/* eslint-disable @next/next/no-img-element */
import React from "react";
import { reviews } from "../../mock/reviews";
import { Icon } from "@iconify/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper";
import "swiper/css/bundle";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { useSwiper } from "swiper/react";

const Notes = () => {
  const starsArray = (rating) => new Array(rating).fill(1); //trasformo il numero in array per mapparlo
  const swiper = useSwiper();
  return (
    <div className="notes">
      <div className="notes_title">
        <h2>Cosa dicono di noi</h2>
      </div>
      <div className="arrow">
        <div className="prev">
          <Icon
            icon="bi:arrow-left-circle-fill"
            color="white"
            width="50"
            onClick={() => swiper.slidePrev()}
          />
        </div>
        <div className="next">
          <Icon
            icon="bi:arrow-right-circle-fill"
            color="white"
            width="50"
            onClick={() => swiper.slideNext()}
          />
        </div>
      </div>
      <Swiper
        slidesPerView={3}
        spaceBetween={26}
        slidesPerGroup={3}
        loop={true}
        loopFillGroupWithBlank={true}
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          prevEl: ".prev",
          nextEl: ".next",
        }}
        autoplay={true}
        className="mySwiperNotes"
        breakpoints={{
          // when window width is >= 1px
          1: {
            slidesPerView: 1,
            spaceBetween: 30,
            slidesPerGroup: 1,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
            slidesPerGroup: 2,
          },
          // when window width is >= 990px
          990: {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 3,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 3,
          },
        }}
      >
        <div className="notes-container">
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="notes-container-item">
                <div className="notes-container-item-user">
                  <div className="notes-container-item-user-image">
                    <img src={review.user.thumbnail} alt="review" />
                  </div>
                  <div className="notes-container-item-user-detail">
                    <div className="notes-container-item-user-name">
                      {review.user.name}
                    </div>
                    <div className="notes-container-item-user-rating">
                      {starsArray(review.rating).map((star, i) => (
                        <a key={i}>
                          <Icon
                            icon="ant-design:star-filled"
                            color="#ffe600"
                            width="20"
                            key={star}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="notes-container-item-review">
                  {review.snippet}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default Notes;
