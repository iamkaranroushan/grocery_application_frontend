import React from "react";

const TopCategoryCard = () => {
  const categories = ["Atta, Rice & Dal", "Oils", "Biscuits & Cookies", "Chips & Namkeen"];

  return (
    <div className="overflow-x-auto whitespace-nowrap px-3 pb-4 bg-white hide-scrollbar">
      <div className="inline-flex gap-3">
        {categories.map((category, index) => (
          <div
            key={index}
            className=" px-4 py-2 rounded-2xl border-0.5 text-stone-600  text-sm font-medium border active:bg-sky-200 cursor-pointer transition"
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategoryCard;
