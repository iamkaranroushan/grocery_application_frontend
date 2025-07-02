import { useState } from "react";
import axios from "axios";

const useUpdateOrderStatus = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async ({ id, status, deliveryDate }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, {
        query: `
          mutation UpdateOrderStatus($id: Int!, $status: String!, $deliveryDate: String) {
            updateOrderStatus(id: $id, status: $status, deliveryDate: $deliveryDate) {
              id
              status
              deliveryDate
            }
          }
        `,
        variables: { id, status, deliveryDate },
      },
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true,}
    );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.updateOrderStatus;
    } catch (err) {
      console.error("Update order status error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
};

export default useUpdateOrderStatus;
