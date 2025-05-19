import { useEffect, useState } from "react";
import axios from "axios";

const useCartAction = () => {
    const [updatedQuantity, setUpdatedQuantity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK || // Use Network URL if available
        process.env.NEXT_PUBLIC_API_URL_LOCAL;
    const updateQuantity = async ({ cartItemId, newQuantity }) => {
        setLoading(true);
        const quantity = newQuantity;
        console.log(quantity);
        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                        mutation($cartItemId: Int!, $quantity: Int!) {
                            updateQuantity(cartItemId: $cartItemId, quantity: $quantity) {
                                message
                                updatedQuantity
                            }
                        }
                    `,
                    variables: { cartItemId: parseInt(cartItemId), quantity: parseInt(quantity) },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response.data.data.updateQuantity.message)
            setUpdatedQuantity(response.data.data.updateQuantity.updatedQuantity);
            console.log(updatedQuantity);
        } catch (err) {
            setError(err.message);
            console.error("Error updating quantity:", err.response.data.errors[0]);
            return null;
        } finally {
            setLoading(false);
        }

    };
    useEffect(() => {
        if (updatedQuantity !== null) {
            console.log("Quantity updated, triggering re-render");
        }
    }, [updatedQuantity]);

    return { updatedQuantity, updateQuantity, loading, error };
};

export default useCartAction;
