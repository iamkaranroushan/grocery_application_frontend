import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchUserOrders = (userId) => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_NETWORK || process.env.NEXT_PUBLIC_API_URL_LOCAL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserOrders = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        API_URL,
        {
          query: `
            query fetchUserOrders($userId: Int!) {
              fetchUserOrders(userId: $userId) {
                id
                totalPrice
                status
                orderDate
                shippingAddress{
                  state
                }
              }
            }
          `,
          variables: { userId },
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      console.log(response.data.data.fetchUserOrders);
      setOrders(response.data.data.fetchUserOrders);
    } catch (err) {
      setError(err.message);
      console.error('Fetch user orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [userId]);

  return { orders, loading, error, refetch: fetchUserOrders };
};

export default useFetchUserOrders;
