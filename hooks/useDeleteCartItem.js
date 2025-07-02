// hooks/useDeleteCartItem.js
import axios from "axios";
import { useState } from "react";

const useDeleteCartItem = () => {
    const API_URL = 
    process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCartItem = async (cartItemId) => {
        setLoading(true);
        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
            mutation deleteCartItem($cartItemId: Int!) {
              deleteCartItem(cartItemId: $cartItemId) {
                success
                error
                
              }
            }
          `,
                    variables: { cartItemId },
                },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
            );

            return response.data.data.deleteCartItem;
        } catch (err) {
            setError(err);
            console.error("Error deleting cart item:", err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { deleteCartItem, loading, error };
};

export default useDeleteCartItem;
