// hooks/useCart.js
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useCart = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_LOCAL || process.env.NEXT_PUBLIC_API_URL_NETWORK;
  const cartId = useSelector((state) => state.auth.cartId);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartItems = useCallback(async () => {
    if (!cartId) return;
    setLoading(true);
    try {
      const response = await axios.post(
        API_URL,
        {
          query: `
            query cartItems($cartId: Int!) {
              cart(cartId: $cartId) {
                cart {
                  id
                  cartItems {
                    id
                    quantity
                    productVariant {
                      productId
                      weight
                      price
                      id  
                      product {
                        id
                        name
                        description
                        imageUrl
                      }
                    }
                  }
                }
                error
              }
            }
          `,
          variables: { cartId: parseInt(cartId) },
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true, }
      );

      setCartItems(response.data.data.cart.cart?.cartItems || []);
    } catch (err) {
      console.error("Error fetching cartItems:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cartId, API_URL]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return { cartItems, loading, error, refetch: fetchCartItems };
};

export default useCart;
