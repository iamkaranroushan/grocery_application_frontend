import { useState } from 'react';
import axios from 'axios';

const useDeleteProduct = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteProduct = async (productId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                    mutation DeleteProduct($id: Int!) {
                        deleteProduct(id: $id) {
                            success
                            error
                        }
                    }
          `,
                    variables: { id: productId },
                },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
            );

            const result = response.data.data.deleteProduct;
            if (!result.success) {
                setError(result.error);
                console.error("❌ Delete failed:", result.error);
            }

            console.log(" Delete success:", result.success);
            return result.success;
        } catch (err) {
            console.error("❌ Axios error:", err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }

    };

    return { deleteProduct, loading, error };
};

export default useDeleteProduct;
