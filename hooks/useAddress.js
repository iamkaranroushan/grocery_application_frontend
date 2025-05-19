import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/features/auth/authSlice";
import { useState } from "react";
import axios from "axios";

const useCreateAddress = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_NETWORK || process.env.NEXT_PUBLIC_API_URL_LOCAL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const createAddress = async (addressDetails) => {
    setLoading(true);
    setError(null);

    const {
      userId,
      streetAddress,
      landmark,
      city,
      state,
      postalCode,
      phoneNumber,
    } = addressDetails;

    try {
      const response = await axios.post(
        API_URL,
        {
          query: `
            mutation {
              createAddress(input: {
            
                userId: ${userId},
                streetAddress: "${streetAddress}",
                landmark: "${landmark}",
                city: "${city}",
                state: "${state}",
                postalCode: "${postalCode}",
                phoneNumber: "${phoneNumber}"
              }) {
                id
                streetAddress
                landmark
                state
                city
                zipCode
                phoneNumber
              }
            }
          `,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data.data?.createAddress;

      if (!data) {
        setError("Failed to create address");
        return null;
      }

      dispatch(
        setAuth({
          ...authState,
          address: data,
        })
      );

      return data;
    } catch (err) {
      console.error("Address creation failed:", err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createAddress, loading, error };
};

export default useCreateAddress;
