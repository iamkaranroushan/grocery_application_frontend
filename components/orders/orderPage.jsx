"use client";
import React, { useEffect, useState } from "react";
import useFetchUserOrders from "@/hooks/useFetchOrder";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../custom/loadingSpinner";
import { FaBoxOpen } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { TbCurrencyRupee } from "react-icons/tb";
import { MdOutlineLocalShipping } from "react-icons/md";

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
            router.push(url, { scroll: false });
        }
    };

    useEffect(() => setRouteLoading(false), [pathname, searchParams]);

    useEffect(() => {
        refetch();
    }, []);

    const handleOrderClick = (orderId) => {
        routeChange(`/orders/${orderId}`);
    };

    const statusColor = {
        PENDING: "bg-orange-100 text-orange-700",
        CONFIRMED: "bg-sky-100 text-sky-700",
        DELIVERED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };

    return (
        <div className="p-4 md:p-10 max-w-5xl lg:mx-auto">

            {loading && (
                <div className="flex justify-center mt-20">
                    <LoadingSpinner />
                </div>
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            {routeLoading && (
                <div className="fixed inset-0 w-screen flex items-center justify-center bg-white bg-opacity-60 z-50">
                    <LoadingSpinner />
                </div>
            )}

            {!loading && orders?.length > 0 && (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <div
                            key={order.id}
                            onClick={() => handleOrderClick(order.id)}
                            className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-5  cursor-pointer transition-all duration-200"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaBoxOpen className="text-xl text-gray-500" />
                                    <span className=" lg:text-xl font-medium">
                                        Order #{orders.length - index}
                                    </span>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor[order.status] || "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm  text-gray-600">
                                <div className="flex items-center gap-2">
                                    <TbCurrencyRupee className="text-lg" />
                                    <span className="font-semibold lg:text-[16px]">Total: ₹{order.totalPrice}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IoCalendarOutline className="text-lg " />
                                    <span>
                                        Placed:{" "}
                                        {order.orderDate
                                            ? new Date(order.orderDate).toLocaleDateString()
                                            : "N/A"}
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && orders?.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                    You haven’t placed any orders yet.
                </div>
            )}
        </div>
    );
};

export default OrderPage;
