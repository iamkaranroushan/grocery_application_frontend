'use client';
import { useState } from "react";
import UpdateProductForm from "./updateProductForm";
import useProductsByCategory from "@/hooks/useProductsByCategory";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import useDeleteProduct from "@/hooks/useDeleteProduct";
import { Button } from "../ui/button";

const EditProductList = ({ categoryId }) => {
    const { products, loading, refetch } = useProductsByCategory({ categoryId });
    const [editingProductId, setEditingProductId] = useState(null);
    const { deleteProduct, loading: deleting } = useDeleteProduct();
    const [deletingProductId, setDeletingProductId] = useState(null);

    const handleEditClick = (productId) => {
        setEditingProductId(prev => prev === productId ? null : productId);
    };

    const handleDeleteClick = (productId) => {
        setDeletingProductId(productId);
    };

    const handleUpdateSuccess = () => {
        setEditingProductId(null);
        refetch();
    };

    return (
        <div className='flex flex-col gap-2 px-4 pb-4'>
            {products.map(product => (
                <div key={product.id} className='p-2 border rounded-md flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <img src={product.imageUrl} alt={product.name} className='w-10 h-10 object-cover rounded-md' />
                            <p className='text-sm font-medium'>{product.name}</p>
                        </div>
                        <div className='flex gap-3 text-lg'>
                            {editingProductId === product.id ? (
                                <RxCross2 className='cursor-pointer icons' onClick={() => setEditingProductId(null)} />
                            ) : (
                                <CiEdit className='cursor-pointer icons' onClick={() => handleEditClick(product.id)} />
                            )}
                            <MdOutlineDeleteOutline
                                className={`cursor-pointer icons ${deleting ? "opacity-50 pointer-events-none" : ""}`}
                                onClick={() => handleDeleteClick(product.id)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 ml-14">
                        {product.variants.map((variant, idx) => (
                            <div key={idx} className='text-xs text-gray-700 border px-2 py-1 rounded-md bg-gray-100 flex justify-between items-center'>
                                <span>{variant.weight}</span>
                                <span className='font-semibold'>₹ {variant.price}</span>
                            </div>
                        ))}
                    </div>

                    {editingProductId === product.id && (
                        <UpdateProductForm
                            product={{ ...product, categoryId }}
                            handleUpdateSuccess={handleUpdateSuccess}
                        />
                    )}
                    {deletingProductId === product.id && (
                        <div className="flex flex-col bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-md mt-2 ml-14 animate-fade-in gap-4">
                            <div className="flex w-full justify-between">
                                <p className="text-sm">Confirm deletion?</p>
                                <RxCross2
                                    className="text-lg text-red-600 cursor-pointer hover:text-red-800"
                                    onClick={() => setDeletingProductId(null)}
                                />
                            </div>
                            <Button
                            variant="deleteProduct"
                                onClick={async () => {
                                    const result = await deleteProduct(product.id);
                                    if (result) {
                                        refetch();
                                        setDeletingProductId(null);
                                    } else {
                                        console.error("Failed to delete");
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default EditProductList;
