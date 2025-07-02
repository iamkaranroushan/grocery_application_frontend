import { useState } from 'react';
import axios from 'axios';

const useUpdateCategory = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCategory = async (categoryId, newName) => {
    console.log(categoryId, newName);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        API_URL,
        {
          query: `
            mutation UpdateCategory($categoryId: Int!, $newName: String!) {
              updateCategory(categoryId: $categoryId, newName: $newName) {
                success
                message
              }
            }
          `,
          variables: { categoryId: parseInt(categoryId), newName },
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true,}
      );

      const result = response.data?.data?.updateCategory;

      if (result?.success) return true;
      throw new Error(result?.message || 'Update failed');
    } catch (err) {
      console.error('Error updating category:', err.message);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading, error };
};

export default useUpdateCategory;
