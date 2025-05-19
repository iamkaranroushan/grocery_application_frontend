import React, { useState } from 'react';
import { Button } from '../ui/button';
import { RxCross1 } from 'react-icons/rx';
import useAddToCart from '@/hooks/useAddToCart';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { FaRupeeSign } from 'react-icons/fa';

const Variant = ({ onClose, product }) => {
    const cartId = useSelector((state) => state.auth.cartId);
    const role = useSelector((state) => state.auth.role);
    const { addToCart } = useAddToCart();

    const [loadingVariantId, setLoadingVariantId] = useState(null);
    const [addedVariants, setAddedVariants] = useState([]); // Track added variants

    const handleAddToCart = async (productVariantId) => {
        setLoadingVariantId(productVariantId);

        const response = await addToCart({
            cartId,
            productVariantId,
            quantity: 1,
        });

        if (!response?.error) {
            setAddedVariants((prev) => [...prev, productVariantId]);
        } else {
            console.log("Error adding to cart:", response.error);
        }

        setLoadingVariantId(null);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 h-[100vh]">
            <div className="flex flex-col p-5 gap-4 bg-white rounded-xl shadow-lg w-80 text-center relative">
                {/* Close Button */}
                <div className="flex justify-between items-start p-1">
                    <div className="flex flex-col items-start">
                        <h1 className="text-lg font-semibold">{product.name}</h1>
                        <h1 className="text-sm text-stone-500">{product.description}</h1>
                    </div>
                    <button onClick={onClose} className="text-stone-600 active:text-black">
                        <RxCross1 className="text-lg" />
                    </button>
                </div>

                {/* Product Image */}
                <div>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-60 object-cover rounded-lg"
                    />
                </div>

                {/* Product Variants */}
                <div className="space-y-4">
                    {product.variants.map((variant) => {
                        const isLoading = loadingVariantId === variant.id;
                        const isAdded = addedVariants.includes(variant.id);

                        return (
                            <div
                                key={variant.id}
                                className="flex justify-between items-center border-b pb-2 px-2"
                            >
                                <div className="flex flex-col gap-2 text-left">
                                    <p className="text-sm font-semibold">{variant.weight}</p>
                                    <span className='flex gap-1'>
                                        <FaRupeeSign className="text-xs" />
                                        <p className="text-xs text-gray-600">{variant.price.toFixed(2)}</p>
                                    </span>
                                </div>

                                <Button
                                    onClick={() => handleAddToCart(variant.id)}
                                    disabled={role === "admin" || isLoading || isAdded}
                                    className={`flex items-center justify-center min-w-[100px] gap-2 
                                        ${role === "admin" ? "opacity-50 cursor-not-allowed" : ""}
                                        ${isAdded ? "bg-stone-900 text-white " : ""}
                                    `}
                                    variant="addToCart"
                                >
                                    {isLoading ? (
                                        <ClipLoader size={16} color="#fff" />
                                    ) : isAdded ? (
                                        "Added"
                                    ) : (
                                        "Add to Cart"
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Variant;
