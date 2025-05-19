import { useState } from 'react';
import axios from 'axios';

const useUpdateSubCategory = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK || process.env.NEXT_PUBLIC_API_URL_LOCAL;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updatedSubCategory, setUpdatedSubCategory] = useState(null);

    const updateSubCategory = async ({ id, name, imageUrl }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                        mutation UpdateSubCategory($id: Int!, $input: UpdateSubCategoryInput!) {
                            updateSubCategory(id: $id, input: $input) {
                                category{
                                    subCategories {
                                        id
                                        name
                                        imageUrl
                                    }
                                }
                                error
                            }
                        }
                    `,
                    variables: {
                        id,
                        input: {
                            name,
                            imageUrl
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = response.data.data.updateSubCategory;

            if (result.error) {
                setError(result.error);
                console.error("🚫 GraphQL Error:", result.error);
            } else {
                setUpdatedSubCategory(result.subCategory);
                console.log("✅ Subcategory updated:", result.subCategory);
            }

            return result.subCategory;
        } catch (err) {
            console.error("❌ Axios error:", err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateSubCategory, updatedSubCategory, loading, error };
};

export default useUpdateSubCategory;
