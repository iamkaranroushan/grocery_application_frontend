import { useState, useEffect } from "react";
import axios from "axios";

const useFetchOrderById = (orderId) => {
  console.log(orderId)
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_NETWORK || process.env.NEXT_PUBLIC_API_URL_LOCAL;

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
                  phoneNumber
                }
                orderItems {
                  id
                  quantity
                  priceAtPurchase
                  variant {
                    id
                    weight
                    product {
                      name
                    }
                  }
                }
              }
            }
          `,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
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
