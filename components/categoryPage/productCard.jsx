import Image from "next/image";
import { FaRupeeSign } from "react-icons/fa";
import { Button } from "../ui/button";
import Variant from "../custom/variant";
import { useState } from "react";
import { useSelector } from "react-redux";

const ProductCard = ({ product, setIsLoginOpen }) => {
  const token = useSelector((state) => state.auth.token);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isAddOptionsClicked, setIsAddOptionsClicked] = useState(false);

  const handleOptions = () => {
    if (token) {
      setIsAddOptionsClicked(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="bg-white rounded-md p-1 relative">
      {isAddOptionsClicked && (
        <Variant
          product={product}
          onClose={() => setIsAddOptionsClicked(false)}
        />
      )}

      {/* Product image and Add button */}
      <div className="relative w-full aspect-square overflow-visible">
        <Image
          src={product.imageUrl} // Use product.image if available
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
        <Button
          onClick={handleOptions}
          variant="secondary"
          size="addOptions"
          className="absolute -bottom-3 -right-1 text-xs text-green-700 border border-green-700"
        >
          Add
        </Button>
        <span className="absolute -bottom-5 right-2 text-[9px] bg-white text-stone-600 px-1 rounded-sm">
          {product.variants.length} options
        </span>
      </div>

      {/* Product Details */}
      <div className="mt-6 space-y-1">
        <span className="text-[10px] px-1 py-0.5 font-semibold bg-sky-100 text-sky-800 rounded-sm">
          {selectedVariant.weight}
        </span>
        <h2 className="text-sm font-semibold text-stone-800">{product.name}</h2>
        <p className="text-xs text-gray-600">{product.description}</p>
        <div className="flex items-center">
          <FaRupeeSign className="text-xs" />
          <p className="text-sm font-semibold">{selectedVariant.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
