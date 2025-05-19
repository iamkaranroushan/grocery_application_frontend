import Image from "next/image";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { Button } from "../ui/button";
const PreviouslyPurchased = () => {
  return (
    <div className="p-3  bg-stone-100">
      <h1 className="font-bold text-lg mb-4 text-stone-700">Previously purchased</h1>

      {/* Horizontally scrollable container */}
      <div className="flex space-x-2 overflow-x-auto scroll-smooth hide-scrollbar">
        {/* Individual product items */}
        <div className="w-28 h-28 relative bg-sky-100 rounded-md flex flex-shrink-0 overflow-hidden border">
          <Image
            src={"/chips.jpg"}
            alt="chips image"
            layout="fill"
            className="absolute"
          />
        </div>
        <div className="w-28 h-28 relative bg-sky-100 rounded-md flex flex-shrink-0 overflow-hidden border">
          <Image
            src={"/chips.jpg"}
            alt="chips image"
            layout="fill"
            className="absolute"
          />
        </div>
        <div className="w-28 h-28 relative bg-sky-100 rounded-md flex flex-shrink-0 overflow-hidden border">
          <Image
            src={"/chips.jpg"}
            alt="chips image"
            layout="fill"
            className="absolute"
          />
        </div>
        <div className="w-28 h-28 relative bg-sky-100 rounded-md flex flex-shrink-0 overflow-hidden border">
          <Image
            src={"/chips.jpg"}
            alt="chips image"
            layout="fill"
            className="absolute"
          />
        </div>
      </div>
    </div>
  );
};

export default PreviouslyPurchased;
