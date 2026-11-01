import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../module.css/Swiper.css';

import { Pagination, Navigation } from 'swiper/modules';

export default function SwiperCarousal({ docs }) {
  const swiperRef = useRef(null);

  const handleSlideChange = () => {
    const videos = document.querySelectorAll<HTMLVideoElement>('.swiper-slide video');

    videos.forEach((video) => {
      video.pause();
    });
  };

  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false, // important
      }}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onTouchStart={() => swiperRef.current?.autoplay.stop()}
      onMouseEnter={() => swiperRef.current?.autoplay.stop()} // desktop
      onSlideChange={handleSlideChange}
      pagination={{ type: "fraction" }}
      navigation
      className="mySwiper"
    >
      {docs.map((doc, index) => (
        <SwiperSlide key={index} className="slide-center">
          {doc.type === 'video' ? (
            <video
              controls
              preload="metadata"
              className="media"
              style={{ objectFit: 'cover' }}
            >
              <source src={doc.url} type="video/mp4" />
            </video>
          ) : (
            <img
              src={doc.url}
              alt={doc.title}
              className="media"
              style={{ objectFit: 'cover' }}
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

