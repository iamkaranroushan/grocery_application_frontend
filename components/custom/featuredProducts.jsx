"use client";
import React, { useEffect, useRef, useState } from "react";
import useCategories from "@/hooks/useCategories";
import useProductsByCategory from "@/hooks/useProductsByCategory";
import ProductCard from "@/components/categoryPage/productCard"; // Adjust path if needed
import { Provider } from "react-redux";
import { store, persistor } from "@/features/auth/authStore";
import { PersistGate } from "redux-persist/integration/react";
import { FiBox } from "react-icons/fi";
const FeaturedProducts = ({ setIsLoginOpen }) => {
  const { categories, loading: catLoading, error: catError } = useCategories();
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [selectedSubCatId, setSelectedSubCatId] = useState(null);
  const subcategoryRefs = useRef({});
  // Set subcategories after categories load
  useEffect(() => {
    if (selectedSubCatId && subcategoryRefs.current[selectedSubCatId]) {
      subcategoryRefs.current[selectedSubCatId].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedSubCatId]);
  useEffect(() => {
    if (!catLoading && categories.length > 0) {
      const subs = categories.flatMap(cat => cat.subCategories);
      setAllSubcategories(subs);
      if (!selectedSubCatId && subs.length > 0) {
        setSelectedSubCatId(subs[0].id); // auto select first subcategory
      }
    }
  }, [catLoading, categories]);

  const { products, loading, error } = useProductsByCategory({
    categoryId: selectedSubCatId,
  });

  if (catLoading) return <div>Loading categories...</div>;
  if (catError) return <div>Error loading categories: {catError}</div>;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="flex flex-col px-2 lg:px-20 pb-12 rounded-b-lg bg-white">

          <div className="flex items-center justify-center lg:mb-20 mt-32 mb-6 ">
            <span className="font-bold text-lg lg:text-4xl text-black">Featured Products</span>
          </div>

          {/* Subcategory Selector */}
          <div className="overflow-x-auto  scroll-px-4 whitespace-nowrap hide-scrollbar lg:mb-20 mb-4">
            <div className="inline-flex gap-4 px-4 w-max">
              {allSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  ref={(el) => (subcategoryRefs.current[sub.id] = el)}
                  onClick={() => setSelectedSubCatId(sub.id)}
                  className={`px-4 py-2 text-sm lg:text-2xl font-medium cursor-pointer transition whitespace-nowrap ${selectedSubCatId === sub.id
                    ? " text-black font-semibold"
                    : "text-stone-400"
                    }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
          {/* Product Grid with Custom Card */}
          {loading ? (
            <div>Loading products...</div>
          ) : error ? (
            <div>Error loading products: {error}</div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-500">
              <FiBox className="text-5xl lg:text-7xl mb-4 text-stone-400" />
              <p className="text-base lg:text-xl font-medium">No products found</p>
              <p className="text-xs lg:text-sm text-stone-400">Try another category or check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  setIsLoginOpen={setIsLoginOpen}
                />
              ))}
            </div>
          )}
        </div>
      </PersistGate>
    </Provider>
  );
};

export default FeaturedProducts;
