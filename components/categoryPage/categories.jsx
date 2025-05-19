"use client";
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
    return setProductPageLoading(false);
  }, [pathname, searchParams]);

  if (loading) {
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
    <div className="flex flex-col p-3">
      {productPageLoading ? (
        <div className="flex h-[70vh] items-center justify-center">
          <MoonLoader color="#3a3a3a" size={50} speedMultiplier={1} />
        </div>
      ) : (
        categories.map((category) => (
          <div key={category.id} className="flex flex-col mb-4">
            <p className="mt-1 font-bold text-stone-800 text-lg">
              {category.name}
            </p>
            {category.subCategories && category.subCategories.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
                {category.subCategories.map((subCategory) => (
                  <div
                    key={subCategory.id}
                    onClick={() => handleSubCategoryClick(subCategory.id)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="relative w-28 h-28 rounded-xl mt-2">
                      <Image
                        src={subCategory.imageUrl} // Ensure `product.image` contains a valid URL
                        alt={"fruits image"}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="w-24 text-center justify-start text-stone-600 font-semibold text-sm mt-1">
                      {subCategory.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No subcategories available</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Categories;
