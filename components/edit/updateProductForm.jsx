'use client';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaCamera } from 'react-icons/fa';
import { IoAdd, IoRemove } from 'react-icons/io5';
import uploadImageToCloudinary from '@/lib/uploadImageToCloudinary';
import useUpdateProduct from '@/hooks/useUpdateProduct';

const UpdateProductForm = ({ product, handleUpdateSuccess }) => {
    const fileInputRef = useRef(null);
    const { updateProduct, loading } = useUpdateProduct();

    const [imageUrl, setImageUrl] = useState(product.imageUrl || '');
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState(product.name || '');
    const [description, setDescription] = useState(product.description || '');
    const [variants, setVariants] = useState(
        product.variants.map(v => ({
            id: v.id,
            weight: v.weight,
            price: v.price,
            mrp: v.mrp || '',
            inStock: v.inStock ?? true,
        })) || []
    );
    const [deletedVariantIds, setDeletedVariantIds] = useState([]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const uploadedUrl = await uploadImageToCloudinary(file);
            setImageUrl(uploadedUrl);
        } catch (err) {
            alert('Image upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = field === 'inStock' ? value : value;
        setVariants(updated);
    };

    const addVariant = () => {
        setVariants([...variants, { weight: '', price: '', mrp: '', inStock: true }]);
    };

    const removeVariant = (index) => {
        if (variants.length === 1) return;

        const toRemove = variants[index];
        if (toRemove.id) {
            setDeletedVariantIds(prev => [...prev, toRemove.id]);
        }

        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const input = {
            name,
            description,
            imageUrl,
            isActive: true,
            variants: variants.map(v => ({
                id: v.id,
                weight: v.weight,
                price: parseFloat(v.price),
                mrp: parseFloat(v.mrp),
                inStock: Boolean(v.inStock),
            })),
            deletedVariantIds,
        };

        const result = await updateProduct(product.id, input);
        if (result && handleUpdateSuccess) handleUpdateSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className='p-4 flex flex-col items-center border rounded-md my-4 gap-2'>
            {/* Image Upload */}
            <div
                className='relative w-24 h-24 border bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition'
                onClick={() => fileInputRef.current?.click()}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt='Preview' className='w-full h-full object-cover rounded-lg' />
                ) : (
                    <FaCamera className='text-gray-500 text-2xl' />
                )}
                <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />
            </div>
            {uploading && <p className='text-sm text-stone-400'>Uploading image...</p>}

            {/* Product Info */}
            <input
                type='text'
                placeholder='Product Name'
                className='placeholder:text-sm text-sm border w-full p-2 rounded-md'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder='Description'
                className='placeholder:text-sm text-sm border w-full p-2 rounded-md'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* Variant Section */}
            <div className='flex flex-col w-full'>
                {variants.map((variant, idx) => (
                    <div key={idx} className='flex flex-col gap-2 my-4'>
                        <div className='flex justify-between items-center w-full'>
                            <span className='font-bold'>Update variant</span>
                            <div className='flex gap-2'>
                                {idx === variants.length - 1 && (
                                    <Button size="icon" type="button" onClick={addVariant}>
                                        <IoAdd />
                                    </Button>
                                )}
                                <Button
                                    variant='secondary'
                                    size='icon'
                                    type="button"
                                    onClick={() => removeVariant(idx)}
                                >
                                    <IoRemove />
                                </Button>
                            </div>
                        </div>

                        <input
                            type='text'
                            placeholder='Weight'
                            className='placeholder:text-sm text-sm border w-full p-2 rounded-md'
                            value={variant.weight}
                            onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)}
                            required
                        />
                        <input
                            type='number'
                            placeholder='Price'
                            className='placeholder:text-sm text-sm border w-full p-2 rounded-md'
                            value={variant.price}
                            onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                            required
                        />
                        <input
                            type='number'
                            placeholder='MRP'
                            className='placeholder:text-sm text-sm border w-full p-2 rounded-md'
                            value={variant.mrp}
                            onChange={(e) => handleVariantChange(idx, 'mrp', e.target.value)}
                            required
                        />
                        <label className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <input
                                type='checkbox'
                                checked={variant.inStock}
                                onChange={(e) => handleVariantChange(idx, 'inStock', e.target.checked)}
                            />
                            In Stock
                        </label>
                    </div>
                ))}
            </div>

            <Button className='w-full p-6' disabled={loading || uploading}>
                {loading ? 'Updating...' : 'Update Product'}
            </Button>
        </form>
    );
};

export default UpdateProductForm;
