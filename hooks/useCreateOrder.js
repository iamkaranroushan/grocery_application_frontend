import { useState } from 'react';
import axios from 'axios';

const useCreateOrder = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createOrder = async ({ userId, addressId, paymentMethod, isPaid, orderItems }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        API_URL,
        {
          query: `
            mutation CreateOrder(
              $userId: Int!, 
              $addressId: Int!, 
              $paymentMethod: PaymentMethod!, 
              $isPaid: Boolean!, 
              $orderItems: [OrderItemInput!]!
            ) {
              createOrder(input: {
                userId: $userId, 
                addressId: $addressId, 
                paymentMethod: $paymentMethod, 
                isPaid: $isPaid, 
                orderItems: $orderItems
              }) {
                success
                error
                order {
                  id
                  totalPrice
                  status
                }
              }
            }
          `,
          variables: { userId, addressId, paymentMethod, isPaid, orderItems },
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      setSuccess(true);
      return response.data.data.createOrder;
    } catch (err) {
      setError(err.message);
      console.error('Create order error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error, success };
};

export default useCreateOrder;
