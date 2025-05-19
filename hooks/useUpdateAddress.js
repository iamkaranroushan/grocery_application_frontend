import { useState } from "react";
import axios from "axios";
import { setAuth } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const useUpdateAddress = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth); // Get current auth state

    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK || process.env.NEXT_PUBLIC_API_URL_LOCAL;

    const updateAddress = async (addressId, updatedData) => {
        if (!addressId) {
            setError("Invalid address ID");
            return null;
        }

        setLoading(true);
        setError(null);

        const mutation = `
      mutation UpdateAddress($id: Int!, $input: UpdateAddressInput!) {
        updateAddress(id: $id, data: $input) {
          id
          streetAddress
          city
          state
          zipCode
          phoneNumber
          landmark
        }
      }
    `;

        const variables = {
            id: parseInt(addressId),
            input: {
                streetAddress: updatedData.streetAddress,
                city: updatedData.city,
                state: updatedData.state,
                postalCode: updatedData.postalCode,
                phoneNumber: updatedData.phoneNumber,
                landmark: updatedData.landmark,
            },
        };

        try {
            const response = await axios.post(
                API_URL,
                { query: mutation, variables },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            const updated = response.data?.data?.updateAddress;

            if (!updated) {
                setError("Failed to update address");
                return null;
            }

            // Merge updated address into Redux state
            dispatch(
                setAuth({
                    ...authState,
                    address: updated,
                })
            );

            return updated;
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.message || err.message || "Unknown error");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateAddress, loading, error };
};

export default useUpdateAddress;
