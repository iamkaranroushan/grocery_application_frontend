"use client";
import React, { useEffect, useState } from "react";
import useFetchUserOrders from "@/hooks/useFetchOrder";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../custom/loadingSpinner";

const OrderPage = () => {
    const userId = useSelector((state) => state.auth.id);
    const { refetch, orders, loading, error } = useFetchUserOrders(userId);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [routeLoading, setRouteLoading] = useState(false);



    const routeChange = (url) => {
        const currentUrl = window.location.pathname + window.location.search;
        if (url !== currentUrl) {
            setRouteLoading(true);
            console.log(url);
            router.push(url, { scroll: false });
        }
    };
    useEffect(() => {
        setRouteLoading(false); // Cleanup timer when the effect re-runs
    }, [pathname, searchParams]);

    useEffect(() => {

        refetch(); // Fetch all orders
    }, []);

    const handleOrderClick = (orderId) => {
        routeChange(`/orders/${orderId}`);
    };

    return (
        <div className="p-5">
            {loading && <p>Loading orders...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {routeLoading &&
                <div className="fixed inset-0 w-screen flex items-center justify-center  bg-white bg-opacity-60 ">
                    <LoadingSpinner />
                </div>
            }
            {!loading && orders && Array.isArray(orders) && orders.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => handleOrderClick(order.id)}
                            className="border p-4 rounded-xl shadow-sm hover:shadow-md hover:bg-sky-50 cursor-pointer transition-all duration-200"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-md font-medium">Order ID: <span className="text-sky-600">{order.id}</span></p>
                                <p className={`text-sm font-semibold ${order.status === "DELIVERED" ? "text-green-600" : "text-yellow-600"}`}>
                                    {order.status}
                                </p>
                            </div>
                            <div className="flex justify-between text-sm text-gray-700">
                                <p>Total: ₹{order.totalPrice}</p>
                                <p>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Unknown date"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && orders && Array.isArray(orders) && orders.length === 0 && (
                <p className="text-gray-500">No orders found.</p>
            )}
        </div>
    );
};

export default OrderPage;
