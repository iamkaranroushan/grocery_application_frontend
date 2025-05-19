import { useState } from 'react';
import axios from 'axios';

const useCreateCategory = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK || // Use Network URL if available
        process.env.NEXT_PUBLIC_API_URL_LOCAL;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createCategory = async (name) => {
        
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                        mutation CreateCategory($name: String!) {
                            createCategory(name: $name) {
                                id
                                name
                            }
                        }
                  `,
                    variables: {name}, 
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );



            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            setSuccess(true);
            return response.data.data.createCategory;
        } catch (err) {
            setError(err.message);
            console.error("Create category error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createCategory,
        loading,
        error,
        success,
    };
};

export default useCreateCategory;
