import { useState } from 'react';
import axios from 'axios';

const useUpdateProduct = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK || process.env.NEXT_PUBLIC_API_URL_LOCAL;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState(null);

    const updateProduct = async (productId, input) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                API_URL,
                {
                    query: `
                        mutation UpdateProduct($id: Int!, $input: UpdateProductInput!) {
                            updateProduct(id: $id, input: $input) {
                                product {
                                    id
                                    name
                                    description
                                    imageUrl
                                    isActive
                                    variants {
                                        id
                                        weight
                                        price
                                        stock
                                    }
                                }
                                error
                            }
                        }
                    `,
                    variables: {
                        id: productId,
                        input: {
                            name: input.name,
                            description: input.description,
                            imageUrl: input.imageUrl,
                            isActive: input.isActive,
                            variants: input.variants.map(v => ({
                                id: v.id,
                                weight: v.weight,
                                price: v.price,
                                stock: v.stock
                            })),
                            deletedVariantIds: input.deletedVariantIds || []
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = response.data.data.updateProduct;

            if (result.error) {
                setError(result.error);
                console.error("🚫 GraphQL Error:", result.error);
            } else {
                setUpdatedProduct(result.product);
                console.log("✅ Product updated:", result.product);
            }

            return result.product;
        } catch (err) {
            console.error("❌ Axios error:", err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateProduct, updatedProduct, loading, error };
};

export default useUpdateProduct;
