import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaRupeeSign } from "react-icons/fa";
import { Button } from "../ui/button";
import useCartAction from "@/hooks/useCartAction";
import useDeleteCartItem from "@/hooks/useDeleteCartItem";
import CartItemDeleteModal from "./cartItemDeleteModal";
// Import the modal component

const CartProductCard = ({ token, product, setIsLoginOpen, refetchCartItems }) => {
    const [quantity, setQuantity] = useState(product?.quantity || 0);
    const price = product?.productVariant?.price || 0;
    const productName = product?.productVariant?.product?.name || "Unknown";
    const imageUrl = product?.productVariant?.product?.imageUrl || "/placeholder.jpg";
    const description = product?.productVariant?.product?.description || "No description";
    const weight = product?.productVariant?.weight || "";

    const { updatedQuantity, updateQuantity, loading } = useCartAction();
    const { deleteCartItem } = useDeleteCartItem();

    const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state

    const handleIncrease = async () => {
        await updateQuantity({ cartItemId: product.id, newQuantity: 1 });
        setQuantity(prev => prev + 1);
    };

    const handleDecrease = async () => {
        if (quantity === 1) {
            setIsModalOpen(true); // Open the modal for confirmation
        } else {
            await updateQuantity({ cartItemId: product.id, newQuantity: -1 });
            setQuantity(prev => prev - 1);
        }
    };

    const handleRemove = async () => {
        await deleteCartItem(product.id);
        await refetchCartItems?.();
        setIsModalOpen(false); // Close the modal after item is removed
    };

    useEffect(() => {
        if (updatedQuantity !== null) {
            setQuantity(updatedQuantity);
        }
    }, [updatedQuantity]);

    return (
        <div className="border rounded-md p-4 bg-white flex gap-4 w-full max-w-3xl shadow-sm">
            {/* Product Image */}
            <div className="relative w-28 h-28 shrink-0 border rounded-md overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={productName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between flex-1">
                <div className="space-y-1">
                    <h2 className="text-sm font-medium text-gray-800">{productName}</h2>
                    <p className="text-xs text-gray-500">{description}</p>
                    <span className="text-xs text-gray-600 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                        {weight}
                    </span>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-3">
                    <div className="flex items-center gap-1 text-gray-800 text-sm font-semibold">
                        <FaRupeeSign className="text-xs" />
                        <span>{price * quantity}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={handleIncrease} variant="increase" size="quantity">+</Button>
                        <span className="text-sm font-medium">{quantity}</span>
                        <Button onClick={handleDecrease} variant="decrease" size="quantity">-</Button>
                        <Button onClick={() => setIsModalOpen(true)} variant="delete" size="sm">Remove</Button>
                    </div>
                </div>
            </div>

            {/* Cart Item Delete Modal */}
            <CartItemDeleteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close the modal
                onConfirm={handleRemove} // Confirm the deletion
            />
        </div>
    );
};

export default CartProductCard;
