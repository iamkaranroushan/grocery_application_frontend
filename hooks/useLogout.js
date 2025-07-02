import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";

const useLogout = () => {
    const dispatch = useDispatch();
    const API_URL = process.env.NEXT_PUBLIC_API_URL_LOCAL_AUTH || process.env.NEXT_PUBLIC_API_URL_NETWORK_AUTH;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const performLogout = async () => {
        setLoading(true);
        setError(null);

        try {
            // Clear backend cookie/session if applicable
            await axios.post(
                `${API_URL}/logout`,{},
                {
                    withCredentials: true,
                }
            );

            // Clear Redux auth state
            dispatch(logout());

        } catch (err) {
            console.error("Logout failed:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { performLogout, loading, error };
};

export default useLogout;
