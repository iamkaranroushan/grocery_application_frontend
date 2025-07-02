import Image from "next/image";
import { FaRupeeSign, FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import Variant from "../custom/variant";
import { useState } from "react";
import { useSelector } from "react-redux";

const ProductCard = ({ product, setIsLoginOpen }) => {
  const token = useSelector((state) => state.auth.token);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isAddOptionsClicked, setIsAddOptionsClicked] = useState(false);

  const isInStock = product.variants.some((v) => v.inStock);

  const handleOptions = () => {
    if (!isInStock) return;
    if (token) {
      setIsAddOptionsClicked(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className={`bg-white rounded-xl lg:rounded-3xl p-2 relative ${!isInStock ? 'opacity-50' : ''}`}>
      {isAddOptionsClicked && (
        <Variant
          product={product}
          onClose={() => setIsAddOptionsClicked(false)}
        />
      )}

      {/* Image section */}
      <div className="relative w-full aspect-square lg:h-[400px] overflow-visible rounded-xl lg:rounded-3xl">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />

        {/* Out of Stock Overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl lg:rounded-3xl z-10">
            <span className="text-white text-xs lg:text-sm font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Add button */}
        <div>
          <Button
            onClick={handleOptions}
            variant="secondary"
            size="icon"
            className={`absolute border-stone-500 border-[0.2px] text-stone-800 lg:border-none lg:rounded-xl rounded-md p-2 
                        lg:top-2 lg:right-2
                        -bottom-3 -right-1 lg:bottom-auto
                        ${!isInStock ? 'pointer-events-none' : ''}`}
          >
            <FaPlus className="text-xs" />
          </Button>

          {/* Variant count label */}
          <span className="lg:hidden absolute -bottom-5 right-2 text-[9px] bg-white text-stone-600 px-1 rounded-sm">
            {product.variants.length} options
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-8 text-center space-y-1">
        <span className="text-[10px] px-2 py-0.5 font-semibold bg-sky-100 text-sky-800 rounded-full">
          {selectedVariant.weight}
        </span>
        <h2 className="text-sm lg:text-lg font-bold text-stone-800">{product.name}</h2>
        <p className="text-xs lg:text-sm text-gray-500 font-semibold">{product.description}</p>
        <div className="flex flex-col items-center space-y-0.5 mt-1">
          <div className="flex items-center space-x-1">
            {selectedVariant.mrp > selectedVariant.price && (
              <span className="text-[10px] lg:text-xs font-semibold text-green-600">
                Save {Math.round(100 - (selectedVariant.price / selectedVariant.mrp) * 100)}%
              </span>
            )}
            <FaRupeeSign className="text-xs lg:text-sm" />
            <p className="text-base lg:text-lg font-bold text-black">
              {selectedVariant.price}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] lg:text-xs text-stone-400">MRP:</span>
            <FaRupeeSign className="text-[10px] lg:text-xs text-stone-400" />
            <p className="text-[10px] lg:text-xs text-stone-400 line-through">
              {selectedVariant.mrp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
