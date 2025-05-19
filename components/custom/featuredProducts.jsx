"use client";
import React, { useEffect, useState } from "react";
import useCategories from "@/hooks/useCategories";
import useProductsByCategory from "@/hooks/useProductsByCategory";
import ProductCard from "@/components/categoryPage/productCard"; // Adjust path if needed
import { Provider } from "react-redux";
import { store, persistor } from "@/features/auth/authStore";
import { PersistGate } from "redux-persist/integration/react";
const FeaturedProducts = ({ setIsLoginOpen }) => {
  const { categories, loading: catLoading, error: catError } = useCategories();
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [selectedSubCatId, setSelectedSubCatId] = useState(null);

  // Set subcategories after categories load
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
        <div className="flex flex-col px-4 py-4 mb-4 rounded-b-lg bg-white">
          <span className="font-bold text-lg text-black mb-4">Featured Products</span>

          {/* Subcategory Selector */}
          <div className="overflow-x-auto whitespace-nowrap hide-scrollbar mb-4 px-1">
            <div className="inline-flex gap-2">
              {allSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCatId(sub.id)}
                  className={`px-4 py-2 rounded-2xl border text-sm font-medium cursor-pointer transition whitespace-nowrap ${selectedSubCatId === sub.id
                    ? "bg-lime-400 text-black"
                    : "text-stone-600 bg-gray-100"
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
          ) : (
            <div className="grid grid-cols-2 gap-4">
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
