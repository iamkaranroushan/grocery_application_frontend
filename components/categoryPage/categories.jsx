'use client';

import useCategories from "@/hooks/useCategories";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";

const Categories = () => {
  const { categories, loading, error } = useCategories();
  const [productPageLoading, setProductPageLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubCategoryClick = (subCategoryId) => {
    setProductPageLoading(true);
    router.push(`/categories/${subCategoryId}`);
  };

  useEffect(() => {
    setProductPageLoading(false);
  }, [pathname, searchParams]);

  if (loading || productPageLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <MoonLoader color="#3a3a3a" size={50} speedMultiplier={1} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col lg:gap-10 px-4 sm:px-6 md:px-10 lg:px-20 py-4 lg:py-10 mb-10">
      {categories.map((category) => (
        <div key={category.id} className="mb-6">
          <p className="font-bold text-stone-800 text-lg lg:text-3xl mb-2 lg:mb-4">{category.name}</p>

          {category.subCategories?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
              {category.subCategories.map((subCategory) => (
                <div
                  key={subCategory.id}
                  onClick={() => handleSubCategoryClick(subCategory.id)}
                  className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md h-[180px] lg:h-[350px]"
                >
                  <Image
                    src={subCategory.imageUrl}
                    alt={subCategory.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="absolute bottom-4 left-4 z-10 text-white">
                    <p className="text-xs lg:text-sm font-medium ">Shop</p>
                    <h3 className="text-base lg:text-xl font-extrabold leading-tight">
                      {subCategory.name}
                    </h3>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-0" />
                </div>
              ))}
            </div>

          ) : (
            <p className="text-sm text-stone-500">No subcategories available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Categories;
