import { useState } from 'react';
import axios from 'axios';

const useDeleteSubCategory = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteSubCategory = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                        mutation DeleteSubCategory($id: Int!) {
                            deleteSubCategory(id: $id) {
                                success
                                message
                            }
                        }
                    `,
                    variables: { id }
                },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
            );

            const result = response.data.data.deleteSubCategory;

            if (result.message) {
                console.error("🚫 GraphQL Error:", result.message);
                setError(result.message);
                return false;
            }

            return result.success;
        } catch (err) {
            console.error("❌ Axios error:", err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteSubCategory, loading, error };
};

export default useDeleteSubCategory;
