"use client";

import { useParams } from "next/navigation";
import useProductsByCategory from "@/hooks/useProductsByCategory";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import ProductCard from "@/components/categoryPage/productCard";
import Login from "@/components/custom/login";



const ProductsPage = () => {
  const { categoryId } = useParams();
  const { products, loading, error } = useProductsByCategory({ categoryId });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <ClipLoader size={50} />
      </div>
    );

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <>
        {isLoginOpen && (
          <Login
            setIsLoginOpen={setIsLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        )}

        <div
          className={`mt-6 lg:mt-10 lg:px-20 px-3 ${isLoginOpen ? "blur-sm" : ""
            }`}
        >
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  setIsLoginOpen={setIsLoginOpen}
                />
              ))}
            </div>
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
        
        </>
  );
};

export default ProductsPage;
