// hooks/useLogin.js
import { useDispatch } from "react-redux";
import { setAuth } from "@/features/auth/authSlice"; // Import the actions
import { useState } from "react";
import axios from "axios";

const useLogin = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_NETWORK || // Use Network URL if available
    process.env.NEXT_PUBLIC_API_URL_LOCAL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch(); // Get access to dispatch

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        API_URL,
        {
          query: `
            mutation {
              userLogin(email: "${email}", password: "${password}") {
                token
                user {
                  id
                  username
                  email
                  role
                  addresses{
                    id
                    streetAddress
                    landmark
                    state
                    city
                    zipCode
                    phoneNumber
                  }
                  cart{
                    id
                  }
                }
                error
              }
            }
          `,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ Required to allow cookies
        }
      );

      const data = response.data.data.userLogin;
      console.log(data.user.id);
      
      if (data?.error) {
        // If error is returned from the backend
        setError(data?.error);
        return { error: data?.error };
      }

      // Dispatch the token and user data to Redux store
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
      return data; // Return successful data for further processing (if needed)
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

export default useLogin;
