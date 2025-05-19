'use client';
import { useRef, useState } from 'react';
import useCreateProduct from '@/hooks/useCreateProduct';
import { Button } from '@/components/ui/button';
import { FaCamera } from 'react-icons/fa';
import uploadImageToCloudinary from '@/lib/uploadImageToCloudinary';
import { IoAdd, IoRemove } from 'react-icons/io5';
import useProductsByCategory from '@/hooks/useProductsByCategory';

const CreateProductForm = ({ subcategoryId, onCreateProduct}) => {
    const fileInputRef = useRef(null);
    const { refetch } = useProductsByCategory({ categoryId:subcategoryId });
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [variants, setVariants] = useState([{ weight: '', price: '', stock: '' }]);

    const { createProduct, loading } = useCreateProduct(refetch);

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
        updated[index][field] = value;
        setVariants(updated);
    };

    const addVariant = () => setVariants([...variants, { weight: '', price: '', stock: '' }]);
    
    const removeVariant = (index) => {
        if (variants.length === 1) return;
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name,
            description,
            imageUrl,
            categoryId: subcategoryId,
            isActive: true,
            variants: variants.map((v) => ({
                weight: v.weight,
                price: parseFloat(v.price),
                stock: parseInt(v.stock),
            })),
        };

        const result = await createProduct(payload);

       

        if (result) {
            setName('');
            setDescription('');
            setImageUrl('');
            setVariants([{ weight: '', price: '', stock: '' }]);
            if (onCreateProduct) onCreateProduct(result);
        }

    };

    return (
        <form onSubmit={handleSubmit} className='p-4 flex flex-col items-center  border rounded-md my-4 gap-2'>
            {/* Styled Image Upload */}
            <div
                className='relative w-24 h-24 border bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition'
                onClick={() => fileInputRef.current?.click()}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt='Preview'
                        className='w-full h-full object-cover rounded-lg'
                    />
                ) : (
                    <FaCamera className='text-gray-500 text-2xl' />
                )}
                <input
                    type='file'
                    accept='image/*'
                    className='hidden '
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />
            </div>
            {uploading && <p className='text-sm text-stone-400'>Uploading image...</p>}

            {/* Product Info */}
            <input
                type='text'
                placeholder='Product Name'
                className='placeholder:text-sm border w-full p-2 rounded-md'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder='Description'
                className='placeholder:text-sm border w-full p-2 rounded-md'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* Variant Section */}
            <div className='flex flex-col w-full'>

                {variants.map((variant, idx) => (
                    <div key={idx} className='flex flex-col gap-2 my-4'>
                        <div className='flex justify-between items-center w-full'>
                            <span>Add a variant</span>
                            <div className='flex gap-2'>
                                {idx === variants.length - 1 && (
                                    <Button size="icon" onClick={addVariant} >
                                        <IoAdd />
                                    </Button>
                                )}
                                <Button variant='secondary' size='icon' onClick={() => removeVariant(idx)} >
                                    <IoRemove />
                                </Button>
                            </div>
                        </div>


                        <input
                            type='text'
                            placeholder='Weight'
                            className='placeholder:text-sm border w-full p-2 rounded-md'
                            value={variant.weight}
                            onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)}
                            required
                        />
                        <input
                            type='number'
                            placeholder='Price'
                            className='placeholder:text-sm border w-full p-2 rounded-md'
                            value={variant.price}
                            onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                            required
                        />
                        <input
                            type='number'
                            placeholder='Stock'
                            className=' placeholder:text-sm border w-full p-2 rounded-md'
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                            required
                        />

                    </div>
                ))}
            </div>

            <Button className='w-full p-6' disabled={loading || uploading}>
                {loading ? 'Creating...' : 'Create Product'}
            </Button>
        </form>
    );
};

export default CreateProductForm;
