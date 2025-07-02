import axios from "axios";
import { useState } from "react";

const useDeleteCart = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // New function to clear cart items (not the cart itself)
    const clearCartItems = async (cartId) => {
        setLoading(true);
        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                        mutation clearCartItems($cartId: Int!) {
                            clearCartItems(cartId: $cartId) {
                                success
                                error
                            }
                        }
                    `,
                    variables: { cartId },
                },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
            );

            return response.data.data.clearCartItems;
        } catch (err) {
            setError(err);
            console.error("Error clearing cart items:", err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { clearCartItems, loading, error };
};

export default useDeleteCart;
