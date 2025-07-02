import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "@/features/auth/authSlice";

const useOtpVerify = () => {
    const dispatch = useDispatch();
    const API_URL = process.env.NEXT_PUBLIC_API_URL_LOCAL_AUTH || process.env.NEXT_PUBLIC_API_URL_NETWORK_AUTH;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const verifyOtp = async (phoneNumber, otp) => {
        setLoading(true);
        setError(null);

        try {

            const response = await axios.post(
                `${API_URL}/verify-otp`, // your backend route
                { phoneNumber, otp },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true, // for setting cookies
                }
            );

            const data = response.data;

            if (data?.error) {
                setError(data.error);
                return { error: data.error };
            }

            dispatch(
                setAuth({
                    token: data.token,
                    user: data.user.username,
                    id: data.user.id,
                    phoneNumber: data.user.phoneNumber,
                    role: data.user.role,
                    cartId: data.user.cart.id,
                    address: data.user.addresses[0] || null,
                })
            );
            console.log(data);
            // You could optionally return the token and user here
            return data;
        } catch (err) {
            console.error("OTP verification failed:", err.message);
            setError(err.message);
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { verifyOtp, loading, error };
};

export default useOtpVerify;
