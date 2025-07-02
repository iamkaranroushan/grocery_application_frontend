import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const useProductsByCategory = ({ categoryId }) => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {

    if (!categoryId) {
      console.log("No categoryId provided, skipping fetch.");
      return;
    } else {
      console.log(" fetching products for categoryId:", categoryId);
    }

    setLoading(true);
    try {
      const response = await axios.post(
        API_URL,
        {
          query: `
            query GetProducts($categoryId: Int!) {
              products(categoryId: $categoryId) {
                id
                name
                description
                imageUrl
                variants {
                  id
                  productId
                  weight
                  price
                  mrp
                  inStock
                  product{
                    id
                    name
                    imageUrl
                  }
                }
              }
            }
          `,
          variables: { categoryId: parseInt(categoryId) },
        },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }

      );

      // console.log("GraphQL Response:", response.data.data.products[0].variants[0].productId);

      const fetchedProducts = response.data.data?.products || [];
      console.log(
        fetchedProducts.length > 0
          ? `Fetched ${fetchedProducts.length} products for categoryId ${categoryId}`
          : `No products found for categoryId ${categoryId}`
      );
      setProducts(fetchedProducts);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError("Something went wrong while fetching products.");
    } finally {
      setLoading(false);
    }
  }, [API_URL, categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

export default useProductsByCategory;
