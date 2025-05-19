import React from 'react';
import { Button } from "../ui/button";

const CartItemDeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-md shadow-lg w-80 p-6">
                <h2 className="text-lg font-semibold text-center text-gray-800">Remove Item</h2>
                <p className="text-sm text-center text-gray-600 mt-2">Are you sure you want to remove this item from your cart?</p>
                <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={onClose} className="w-24" variant="outline">Cancel</Button>
                    <Button onClick={onConfirm} className="w-24 bg-red-500 text-white">Remove</Button>
                </div>
            </div>
        </div>
    );
};

export default CartItemDeleteModal;
