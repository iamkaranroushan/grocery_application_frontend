import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const useCategories = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_LOCAL 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        API_URL,
        {
          query: `
            query {
              categories {
                id
                name
                description
                subCategories {
                  id
                  imageUrl
                  name
                  description
                }
              }
            }
          `,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials:"true"
        }
      );
      setCategories(response.data.data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

export default useCategories;
