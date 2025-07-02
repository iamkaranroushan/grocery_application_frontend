import { useState } from 'react';
import axios from 'axios';

const useCreateProduct = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createProduct = async ({ name, description, categoryId, imageUrl, isActive, variants }) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
            mutation CreateProduct(
              $name: String!, 
              $description: String, 
              $categoryId: Int!, 
              $imageUrl: String, 
              $isActive: Boolean!, 
              $variants: [ProductVariantInput!]
            ) {
              createProduct(
                name: $name,
                description: $description,
                categoryId: $categoryId,
                imageUrl: $imageUrl,
                isActive: $isActive,
                variants: $variants
              ) {
                id
                name
                variants {
                  weight
                  price
                  mrp
                  inStock
                }
              }
            }
          `,
                    variables: { name, description, categoryId, imageUrl, isActive, variants },
                },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            setSuccess(true);

            return response.data.data.createProduct;
        } catch (err) {
            setError(err.message);
            console.error("Create product error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createProduct,
        loading,
        error,
        success,
    };
};

export default useCreateProduct;
