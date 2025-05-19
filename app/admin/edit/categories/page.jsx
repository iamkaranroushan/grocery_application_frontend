'use client';
import useCategories from '@/hooks/useCategories';
import useCreateCategory from '@/hooks/useCreateCategory';
import useDeleteCategory from '@/hooks/useDeleteCategory';
import useUpdateCategory from '@/hooks/useUpdateCategory';
import React, { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoAdd } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

const EditCategoryPage = () => {
    const { categories, refetch } = useCategories();
    const { createCategory, loading: creating } = useCreateCategory();
    const { deleteCategory, loading: deleting } = useDeleteCategory();
    const { updateCategory, loading: updating } = useUpdateCategory();

    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [showInput, setShowInput] = useState(false);

    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [confirmDeleteName, setConfirmDeleteName] = useState('');

    const handleCreate = async () => {
        if (!newCategory.trim()) return;
        await createCategory(newCategory);
        setNewCategory('');
        setShowInput(false);
        refetch();
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setEditedName(category.name);
    };

    const handleUpdate = async () => {
        if (!editedName.trim()) return;
        const isUpdated = await updateCategory(editingId, editedName)
        if (isUpdated) {
            setEditingId(null);
            setEditedName('');
            refetch();
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedName('');
    };

    const triggerDeleteConfirmation = (categoryId, name) => {
        setConfirmDeleteId(categoryId);
        setConfirmDeleteName(name);
    };

    const confirmDeletion = async () => {
        const isDeleted = await deleteCategory(confirmDeleteId);
        if (isDeleted) {
            refetch();
            setConfirmDeleteId(null);
            setConfirmDeleteName('');
        }
    };

    const cancelDeletion = () => {
        setConfirmDeleteId(null);
        setConfirmDeleteName('');
    };

    return (
        <div className='flex flex-col justify-center p-3 mt-12 gap-4'>
            {/* Deletion Confirmation Banner */}
            {confirmDeleteId && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 shadow-md">
                    <strong className="font-bold">Confirm Deletion:</strong>
                    <span className="block sm:inline ml-2">
                        Are you sure you want to delete <strong>{confirmDeleteName}</strong>?
                    </span>
                    <div className="mt-2 flex gap-2">
                        <button
                            onClick={confirmDeletion}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={cancelDeletion}
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className='flex gap-2 pt-4 items-center'>
                <input
                    type='text'
                    className='border p-4 rounded-md w-full max-w-sm'
                    placeholder='Add a category'
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                    onClick={handleCreate}
                    disabled={creating}
                    className='bg-black text-white px-3 py-4 rounded-md disabled:opacity-50'
                >
                    {creating ? 'Adding...' : 'Add'}
                </button>
            </div>

            <div>
                {categories.map((category) => (
                    <div key={category.id} className='flex justify-between items-center'>
                        {/*updating the category .*/}
                        {editingId === category.id ? (
                            <div className='flex items-center gap-2 w-full'>
                                <input
                                    type='text'
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className='border p-1 rounded-md w-full max-w-sm'
                                />
                                <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className='bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50'
                                >
                                    {updating ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className='text-sm text-gray-500 underline'
                                >
                                    <RxCross2 className='icons' />
                                </button>
                            </div>
                        ) : (
                            <div className=' flex justify-between w-full border-b items-center py-6'>
                                {/*displaying the category.*/}
                                <div className=''>
                                    <span className='text-stone-800 font-bold text-xl'>{category.name}</span>
                                </div>
                                <div className='flex gap-4'>
                                    {/*edit option.*/}
                                    <span
                                        onClick={() => handleEdit(category)}
                                        className='cursor-pointer'
                                    >
                                        <CiEdit className='icons' />
                                    </span>
                                    {/*delete option.*/}
                                    <span
                                        onClick={() => triggerDeleteConfirmation(category.id, category.name)}
                                        className='cursor-pointer'
                                    >
                                        <MdDeleteOutline className='icons' />
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditCategoryPage;
