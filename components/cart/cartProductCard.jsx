import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaMinus, FaRupeeSign } from "react-icons/fa";
import { Button } from "../ui/button";
import useCartAction from "@/hooks/useCartAction";
import useDeleteCartItem from "@/hooks/useDeleteCartItem";
import CartItemDeleteModal from "./cartItemDeleteModal";
import { MdDelete } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbMinus, TbMoodMinus } from "react-icons/tb";
import { IoAddOutline } from "react-icons/io5";

const CartProductCard = ({ token, product, setIsLoginOpen, refetchCartItems }) => {
    const [quantity, setQuantity] = useState(product?.quantity || 0);
    const price = product?.productVariant?.price || 0;
    const productName = product?.productVariant?.product?.name || "Unknown";
    const imageUrl = product?.productVariant?.product?.imageUrl || "/placeholder.jpg";
    const description = product?.productVariant?.product?.description || "No description";
    const weight = product?.productVariant?.weight || "";

    const { updatedQuantity, updateQuantity, loading } = useCartAction();
    const { deleteCartItem } = useDeleteCartItem();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleIncrease = async () => {
        await updateQuantity({ cartItemId: product.id, newQuantity: 1 });
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = async () => {
        if (quantity === 1) {
            setIsModalOpen(true);
        } else {
            await updateQuantity({ cartItemId: product.id, newQuantity: -1 });
            setQuantity((prev) => prev - 1);
        }
    };

    const handleRemove = async () => {
        await deleteCartItem(product.id);
        await refetchCartItems?.();
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (updatedQuantity !== null) {
            setQuantity(updatedQuantity);
        }
    }, [updatedQuantity]);

    return (
        <div className="w-full max-w-4xl border-b border-gray-200 py-6  flex  gap-6 group  ">
            {/* Product Image */}
            <div className="relative w-40 h-40 bg-gray-100 rounded-md overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={productName}
                    layout="fill"
                    objectFit="cover"
                    className="object-contain"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between gap-2 w-full">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[16px] lg:text-lg font-semibold text-gray-900">{productName}</h2>
                    <p className="text-[14px] lg:text-[15px] font-semibold  text-stone-600">{description}</p>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-2 rounded w-fit">
                        {weight}
                    </span>
                </div>

                {/* Price + Quantity */}
                <div className="flex flex-col lg:flex-row lg:items-center items-start justify-between gap-4">

                    {/* Price */}
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                    <span className="text-[15px] lg:text-lg font-semibold">MRP :</span>    
                    <FaRupeeSign className="text-sm lg:text-lg" />
                        <span className="lg:text-lg">{price * quantity}</span>
                    </div>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                        {quantity === 1 ? (
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                size="icon"
                                variant="outline"
                                className="rounded-full border-gray-300"
                                title="Remove item"
                            >
                                <RiDeleteBin6Line className="icons" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleDecrease}
                                size="icon"
                                variant="outline"
                                className="rounded-full border-gray-300"
                                title="Decrease quantity"
                            >
                                <TbMinus className="icons" />
                            </Button>
                        )}
                        <span className="text-base font-medium">{quantity}</span>
                        <Button
                            onClick={handleIncrease}
                            size="icon"
                            variant="outline"
                            className="rounded-full border-gray-300"
                        >
                            <IoAddOutline className="icons" />
                        </Button>
                    </div>


                </div>

                {/* Remove link */}

            </div>

            {/* Modal */}
            <CartItemDeleteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleRemove}
            />
        </div>
    );
};

export default CartProductCard;
