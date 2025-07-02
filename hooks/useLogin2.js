// hooks/useLoginRest.js
import { useDispatch } from "react-redux";
import { setAuth } from "@/features/auth/authSlice";
import { useState } from "react";
import axios from "axios";

const useLoginRest = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL_LOCAL_AUTH || process.env.NEXT_PUBLIC_API_URL_NETWORK_AUTH
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${API_URL}/login`, // REST endpoint
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true, // ⬅️ Enables cookie to be set on client
                }
            );

            const data = response.data;

            if (data?.error) {
                setError(data?.error);
                return { error: data?.error };
            }

            // Dispatch auth state
            dispatch(
                setAuth({
                    token: data.token,
                    user: data.user.username,
                    id: data.user.id,
                    role: data.user.role,
                    email: data.user.email,
                    cartId: data.user.cart.id,
                    address: data.user.addresses[0] || null,
                })
            );
            console.log(data);
            return data;
        } catch (err) {
            console.error("Login failed:", err.message);
            setError(err.message);
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};

export default useLoginRest;
