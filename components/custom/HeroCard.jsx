"use client";
import React, { useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const HeroCard = () => {
  const sliderInstanceRef = useRef(null); // holds the slider instance

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1 },
      created: (slider) => {
        sliderInstanceRef.current = slider;
      },
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        sliderInstanceRef.current
      ) {
        sliderInstanceRef.current.next();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-white">
      <div
        ref={sliderRef}
        className="keen-slider relative w-full h-[30vh] lg:h-[60vh] rounded-3xl overflow-hidden"
      >
        {[
          "/bath-essentials.jpg",
          "/clothings.jpg",
          "/ladiespurse.jpg",
          "/lemons.jpg",
        ].map((src, i) => (
          <div
            key={i}
            className="keen-slider__slide flex justify-center items-center relative"
          >
            <Image
              src={src}
              alt={`Slide ${i}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroCard;
