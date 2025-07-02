// hooks/useSendOtp.js
import { useState } from "react";
import axios from "axios";

const useSendOtp = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_LOCAL_AUTH ||
    process.env.NEXT_PUBLIC_API_URL_NETWORK_AUTH;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendOtp = async (phoneNumber) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/send-otp`, // Your backend endpoint for sending OTP
        { phoneNumber: `+91${phoneNumber}` },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data?.error) {
        setError(data.error);
        return { error: data.error };
      }

      return data; // e.g., maybe return { success: true }
    } catch (err) {
      console.error("OTP send failed:", err.message);
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, loading, error };
};

export default useSendOtp;
