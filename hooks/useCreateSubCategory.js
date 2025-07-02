import { useState } from 'react';
import axios from 'axios';

const useCreateSubCategory = (refetch) => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createSubCategory = async ({ name, imageUrl, parentCategoryId }) => {
        console.log(name, imageUrl, parentCategoryId)
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                        mutation CreateSubCategory($name: String!, $imageUrl: String!, $parentCategoryId: Int!) {
                            createSubCategory(name: $name, imageUrl: $imageUrl, parentCategoryId: $parentCategoryId) {
                                name
                            }
                        }
                    `,
                    variables: { name, imageUrl, parentCategoryId },
                },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            setSuccess(true);

            // Optional refetch
            if (refetch) {
                refetch();
            }

            return response.data.data.createSubCategory;
        } catch (err) {
            setError(err.message);
            console.error("Create subcategory error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createSubCategory,
        loading,
        error,
        success,
    };
};

export default useCreateSubCategory;
