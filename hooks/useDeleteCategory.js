import { useState } from 'react';
import axios from 'axios';

const useDeleteCategory = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK ||
        process.env.NEXT_PUBLIC_API_URL_LOCAL;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCategory = async (categoryId) => {
        console.log(categoryId);
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                        mutation DeleteCategory($categoryId: Int!) {
                            deleteCategory(categoryId: $categoryId) {
                                success
                                message
                            }
                        }
                    `,
                    variables: { categoryId: parseInt(categoryId) },
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const result = response.data?.data?.deleteCategory;

            if (result?.success) {
                console.log('Category deleted successfully');
                return true;
            } else {
                throw new Error(result?.message || 'Deletion failed');
            }
        } catch (err) {
            console.error('Error deleting category:', err.message);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteCategory, loading, error };
};

export default useDeleteCategory;
