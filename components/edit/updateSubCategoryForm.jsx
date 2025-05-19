'use client';
import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { MoonLoader } from 'react-spinners';
import { FaCamera } from 'react-icons/fa';
import uploadImageToCloudinary from '@/lib/uploadImageToCloudinary';
import useUpdateSubCategory from '@/hooks/useUpdateSubCategory';

const UpdateSubCategoryForm = ({ subCategory, onUpdateSuccess }) => {
    const [name, setName] = useState(subCategory.name);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(subCategory.imageUrl);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const { updateSubCategory } = useUpdateSubCategory();

    console.log(subCategory);
    const handleImageChange = (file) => {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        if (!name) return alert('Subcategory name is required.');
        setLoading(true);

        let imageUrl = subCategory.imageUrl;

        if (image) {
            const uploaded = await uploadImageToCloudinary(image);
            if (!uploaded) {
                alert('Image upload failed.');
                setLoading(false);
                return;
            }
            imageUrl = uploaded;
        }

        await updateSubCategory({
            id: subCategory.id,
            name,
            imageUrl,
        });

        setLoading(false);
        onUpdateSuccess?.();
    };

    return (
        <div className='w-full max-w-md mx-auto flex flex-col items-center gap-6 border bg-white shadow-sm p-6 rounded-lg'>
            {/* Image Upload with Preview */}
            <div
                className='relative w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition'
                onClick={() => fileInputRef.current?.click()}
            >
                {preview ? (
                    <img
                        src={preview}
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
                    ref={fileInputRef}
                    onChange={(e) => handleImageChange(e.target.files[0])}
                />
            </div>

            {/* Text input and button */}
            <div className='w-full flex flex-col sm:flex-row gap-3 items-stretch sm:items-center'>
                <input
                    type='text'
                    placeholder='Subcategory name'
                    className='flex-1 border p-2 rounded-md text-sm w-full'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button
                    onClick={handleUpdate}
                    disabled={loading}
                    variant=""
                    className="px-4 py-2 w-full sm:w-auto"
                >
                    {loading ? "updating..." : 'Update'}
                </Button>
            </div>
        </div>
    );
};

export default UpdateSubCategoryForm;
