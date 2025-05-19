
import { useState } from "react";
import axios from "axios";

const useFetchAddressById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK || process.env.NEXT_PUBLIC_API_URL_LOCAL;

    const fetchAddressesByUser = async (userId) => {
        console.log(userId)
        if (!userId) {
            setError("Invalid userId");
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                    query ($userId: Int!) {
                    fetchAddressByUser(userId: $userId) {
                        id
                        streetAddress
                        landmark
                        city
                        state
                        country
                        zipCode
                        phoneNumber
                        
                    }
                    }
                `,
                    variables: { userId: parseInt(userId) },
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            const data = response.data.data?.fetchAddressByUser;
            if (!data) {
                setError("No addresses found for this user");
                setAddresses([]);
                return null;
            }
            console.log(data)
            setAddresses(data);
            return data;
        } catch (err) {
            setError(err.message || "Failed to fetch addresses for user");
            setAddresses([]);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { addresses, fetchAddressesByUser, loading, error };
};

export default useFetchAddressById;