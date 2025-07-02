import { useState, useEffect } from "react";
import axios from "axios";

const useFetchOrderById = (orderId) => {
  console.log(orderId)
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        API_URL,
        {
          query: `
            query {
              fetchOrderById(id: ${orderId}) {
                id
                status
                totalPrice
                orderDate
                deliveryDate
                user {
                  id
                  username
                }
                shippingAddress {
                  streetAddress
                  city
                  state
                  zipCode
                }
                orderItems {
                  id
                  quantity
                  priceAtPurchase
                  variant {
                    id
                    weight
                    product {
                     imageUrl
                      name
                    }
                  }
                }
              }
            }
          `,
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      setOrder(response.data.data.fetchOrderById);
    } catch (err) {
      console.error("Fetch order by ID error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  return { order, loading, error, refetch: fetchOrder };
};

export default useFetchOrderById;
