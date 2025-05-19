import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const useProductsByCategory = ({ categoryId }) => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_NETWORK || process.env.NEXT_PUBLIC_API_URL_LOCAL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {

    if (!categoryId) {
      console.log("No categoryId provided, skipping fetch.");
      return;
    }else{
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
                  stock
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
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("GraphQL Response:", response.data.data.products[0].variants[0].productId);

      const fetchedProducts = response.data.data?.products || [];
      if (fetchedProducts.length === 0) {
        console.log("No products found for categoryId:", categoryId);
      }

      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError(err.message);
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
