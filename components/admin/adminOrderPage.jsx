"use client";

import Link from "next/link";
import useFetchAllOrders from "@/hooks/useFetchAllOrders";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "../custom/loadingSpinner";

const AdminOrdersPage = () => {
    const { orders, loading, error } = useFetchAllOrders();
    const [routeLoading, setRouteLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

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
    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error loading orders: {error}</p>;

    return (
        <div className="py-6 mb-10">
            <h2 className="text-2xl font-bold mb-6">Orders Overview</h2>
            {routeLoading &&
                <div className="fixed inset-0 w-screen flex items-center justify-center  bg-white bg-opacity-60 ">
                    <LoadingSpinner />
                </div>
            }
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                    <div
                        onClick={()=>routeChange(`/admin/dashboard/orders/${order.id}`)}
                        key={order.id}
                        className="block border rounded-lg shadow-sm hover:shadow-md transition bg-white p-4"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-700">Order #{order.id}</span>
                            <span className={`px-2 py-1 rounded text-sm ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">User: {order.user.username}</p>
                        <p className="text-sm text-gray-600 mb-1">Total: ₹{order.totalPrice}</p>
                        <p className="text-sm text-gray-600">
                            Placed: {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrdersPage;
