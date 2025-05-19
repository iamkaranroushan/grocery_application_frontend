import { useState } from "react";
import axios from "axios";

const useAddToCart = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK || // Use Network URL if available
        process.env.NEXT_PUBLIC_API_URL_LOCAL;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addToCart = async ({ cartId, productVariantId, quantity }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                API_URL, // Adjust endpoint if needed
                {
                    query: `
                        mutation AddToCart($productVariantId: Int!, $quantity: Int!, $cartId: Int!) {
                            addToCart(cartId: $cartId, productVariantId: $productVariantId, quantity: $quantity) {
                                cartItem{
                                    id
                                    quantity    
                                }
                                error
                            }
                        }
                    `,
                    variables: { cartId, productVariantId, quantity },
                },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.addToCart;
        } catch (err) {
            console.error("Error adding to cart:", err.message);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { addToCart, loading, error };
};

export default useAddToCart;
