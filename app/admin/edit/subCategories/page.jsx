'use client';
import { Button } from '@/components/ui/button';
import useCategories from '@/hooks/useCategories';
import useCreateSubCategory from '@/hooks/useCreateSubCategory';
import React, { useRef, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { MdOutlineExpandMore, MdOutlineExpandLess, MdOutlineDeleteOutline } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import uploadImageToCloudinary from '@/lib/uploadImageToCloudinary';
import { FaCamera } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';
import { RxCross2 } from 'react-icons/rx';
import UpdateSubCategoryForm from '@/components/edit/updateSubCategoryForm';
import useDeleteSubCategory from '@/hooks/useDeleteSubCategory';

const EditSubCategoryPage = () => {
    const { categories, refetch } = useCategories();
    const { createSubCategory } = useCreateSubCategory();
    const { deleteSubCategory } = useDeleteSubCategory();

    const [expandedCategoryId, setExpandedCategoryId] = useState(null);
    const [inputs, setInputs] = useState({});
    const [imagePreview, setImagePreview] = useState({});
    const [loadingMap, setLoadingMap] = useState({});
    const [editingSubId, setEditingSubId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const fileInputRefs = useRef({});

    const toggleExpand = (categoryId) => {
        setExpandedCategoryId(prev => (prev === categoryId ? null : categoryId));
    };

    const handleInputChange = (categoryId, field, value) => {
        setInputs(prev => ({
            ...prev,
            [categoryId]: {
                ...prev[categoryId],
                [field]: value,
            },
        }));

        if (field === 'image') {
            const file = value;
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(prev => ({
                    ...prev,
                    [categoryId]: reader.result,
                }));
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };

    const handleCreateSubCategory = async (categoryId) => {
        const { name, image } = inputs[categoryId] || {};
        if (!name || !image) {
            return alert('Both name and image are required.');
        }

        setLoadingMap(prev => ({ ...prev, [categoryId]: true }));

        try {
            const imageUrl = await uploadImageToCloudinary(image);
            if (!imageUrl) {
                alert('Image upload failed.');
                return;
            }

            await createSubCategory({
                name,
                imageUrl,
                parentCategoryId: categoryId,
            });

            await refetch();

            setInputs(prev => ({ ...prev, [categoryId]: { name: '', image: null } }));
            setImagePreview(prev => ({ ...prev, [categoryId]: null }));

            if (fileInputRefs.current[categoryId]) {
                fileInputRefs.current[categoryId].value = null;
            }
        } finally {
            setLoadingMap(prev => ({ ...prev, [categoryId]: false }));
        }
    };
    const handleDeleteSubCategory = async (subId) => {
        const success = await deleteSubCategory(subId); // hook or logic
        if (success) {
            setDeleteConfirmId(null);
            setEditingSubId(null);
            refetch(); // if you're fetching categories again
        }
    };

    return (
        <div className='flex flex-col justify-center p-3 mt-12 gap-4'>
            {/*displaying available category*/}
            <div className='flex flex-col justify-between gap-2'>
                {categories.map((category) => (
                    <div key={category.id} className='flex flex-col justify-center border-b py-4'>
                        <div className='flex justify-between items-center mb-1' onClick={() => toggleExpand(category.id)}>
                            <span className='font-bold text-xl'>{category.name}</span>
                            <span className='cursor-pointer'>
                                {expandedCategoryId === category.id ? (
                                    <MdOutlineExpandLess className='icons' />
                                ) : (
                                    <MdOutlineExpandMore className='icons' />
                                )}
                            </span>
                        </div>
                        {/* showing input fields for subcategory creation*/}
                        {expandedCategoryId === category.id && (
                            <div className='px-2 mt-2 flex flex-col gap-2 '>
                                <div className='flex flex-col items-center gap-4 border px-4 py-4 rounded-lg'>

                                    {/* File Input & Preview */}
                                    <div
                                        className='relative w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition'
                                        onClick={() => fileInputRefs.current[category.id]?.click()}
                                    >
                                        {imagePreview[category.id] ? (
                                            <img
                                                src={imagePreview[category.id]}
                                                alt='Preview'
                                                className='w-full h-full object-cover rounded-lg'
                                            />
                                        ) : (
                                            <FaCamera className='text-gray-500 text-2xl' />
                                        )}
                                        <input
                                            type='file'
                                            accept='image/*'
                                            className='hidden'
                                            ref={(el) => (fileInputRefs.current[category.id] = el)}
                                            onChange={(e) =>
                                                handleInputChange(category.id, 'image', e.target.files[0])
                                            }
                                        />
                                    </div>

                                    {/* Text + Button */}
                                    <div className="flex items-center justify-between gap-2">
                                        <input
                                            type='text'
                                            placeholder='Subcategory name'
                                            className='border p-2 rounded-md flex-1'
                                            value={inputs[category.id]?.name || ''}
                                            onChange={(e) =>
                                                handleInputChange(category.id, 'name', e.target.value)
                                            }
                                        />
                                        <Button
                                            variant="secondary"
                                            disabled={loadingMap[category.id]}
                                            onClick={() => handleCreateSubCategory(category.id)}
                                            className='py-5 flex items-center justify-center'
                                        >
                                            {loadingMap[category.id] ? (
                                                <MoonLoader size={20} />
                                            ) : (
                                                <IoAdd className='icons' />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Existing Subcategories */}
                                {category.subCategories?.map((sub) => (
                                    <div key={sub.id} className='py-3 flex flex-col gap-4 '>
                                        <div className=' flex justify-between'>
                                            <div className='flex items-center gap-3'>
                                                <img
                                                    src={sub.imageUrl}
                                                    alt={sub.name}
                                                    className='w-10 h-10 rounded-full object-cover'
                                                />
                                                <span className='text-sm text-gray-800'>{sub.name}</span>
                                            </div>

                                            <div className='flex gap-4'>
                                                <div className="ml-auto flex gap-3 text-xl items-center">
                                                    {editingSubId === sub.id ? (
                                                        <RxCross2
                                                            className="cursor-pointer icons text-gray-600 hover:text-red-500"
                                                            onClick={() => setEditingSubId(null)}
                                                        />
                                                    ) : (
                                                        <CiEdit
                                                            className="cursor-pointer icons text-gray-600 hover:text-blue-500"
                                                            onClick={() => setEditingSubId(sub.id)}
                                                        />
                                                    )}
                                                    {deleteConfirmId === sub.id ? (
                                                        <RxCross2
                                                            className="cursor-pointer text-red-500 icons"
                                                            onClick={() => setDeleteConfirmId(null)}
                                                        />
                                                    ) : (
                                                        <MdOutlineDeleteOutline
                                                            className="cursor-pointer icons text-gray-600 hover:text-red-500"
                                                            onClick={() => setDeleteConfirmId(sub.id)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>


                                        {deleteConfirmId === sub.id && (
                                            <div className="flex flex-col  gap-3 bg-red-50 border  border-red-300 rounded p-3 text-sm text-red-800 justify-between items-center">
                                                <span>Confirm Deletion?</span>
                                                <Button
                                                    className="w-full"
                                                    variant="deleteProduct"
                                                    onClick={async () => {
                                                        handleDeleteSubCategory(sub.id)
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}

                                        {editingSubId === sub.id && (
                                            <UpdateSubCategoryForm
                                                subCategory={sub}
                                                onUpdateSuccess={() => {
                                                    setEditingSubId(null);
                                                    refetch(); // again, if applicable
                                                }}
                                            />
                                        )}

                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditSubCategoryPage;
