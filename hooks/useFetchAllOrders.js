import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchAllOrders = () => {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL_NETWORK || process.env.NEXT_PUBLIC_API_URL_LOCAL;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                API_URL,
                {
                query: `
                    query fetchAllOrders {
                        fetchAllOrders {
                        id
                        status
                        totalPrice
                        shippingAddress{
                            streetAddress
                            city
                            state
                            zipCode
                            phoneNumber
                        }
                        orderDate
                        deliveryDate
                        user {
                            id
                            username
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
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            console.log(response.data.data.fetchAllOrders)
            setOrders(response.data.data.fetchAllOrders);
        } catch (err) {
            setError(err.message);
            console.error('Fetch all orders error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return { orders, loading, error, refetch: fetchOrders };
};

export default useFetchAllOrders;
