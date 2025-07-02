"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useFetchOrderById from "@/hooks/useFetchOrdersById";
import useUpdateOrderStatus from "@/hooks/useUpdateOrderStatus";
import { Button } from "@/components/ui/button";
import useSocket from "@/hooks/useSocket";
import { useSelector } from "react-redux";

const OrderDetailsPage = () => {
    const {phoneNumber} = useSelector((state) => state.auth);
    const socket = useSocket()
    const { orderId } = useParams();
    const { refetch, order, loading, error } = useFetchOrderById(orderId);
    const { updateStatus, loading: updating, error: updateError } = useUpdateOrderStatus();
    const [status, setStatus] = useState("");
    const [userId, setUserId] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");


    useEffect(() => {
        if (order) {
            setStatus(order.status);
            setUserId(order.user.id);
            if (order.deliveryDate) {
                setDeliveryDate(order.deliveryDate.split("T")[0]);
            }
        }
    }, [order]);

    const handleUpdateStatus = async () => {
        await updateStatus({
            id: parseInt(orderId),
            status,
            deliveryDate: status === "DELIVERED" ? deliveryDate : null,
        });
        if (socket && socket.connected) {
            socket.emit("orderUpdated", {
                id: userId,
                status,
            });
        }
        refetch();
    };

    if (loading) return <p className="text-center py-8 text-gray-600">Loading order details...</p>;
    if (error) return <p className="text-center py-8 text-red-600">Error: {error}</p>;
    if (!order) return <p className="text-center py-8 text-gray-500">Order not found.</p>;

    return (
        <div className="max-w-4xl mx-auto py-6 my-14 ">
            <h2 className="text-3xl font-semibold mb-6 ">Order #{order.id}</h2>
            <div className="border rounded-md bg-white shadow-md p-6 space-y-6">
                {/* Header: Status + Update */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Current Status</p>
                        <p className="text-lg font-semibold capitalize">{order.status}</p>
                    </div>

                    <div className="flex flex-col  items-center  gap-3">
                        <div className="flex gap-2">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border rounded px-3 py-2 text-sm"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>

                            {status === "DELIVERED" && (
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        className={`border rounded px-3 py-2 text-sm appearance-none ${!deliveryDate ? 'text-gray-400' : 'text-black'}`}
                                        placeholder="Select Date"
                                    />
                                    {!deliveryDate && (
                                        <span className="absolute left-3 top-2.5 text-sm text-gray-400 pointer-events-none">
                                            Select Date
                                        </span>
                                    )}
                                </div>
                            )}

                        </div>

                    </div>
                    <Button
                        onClick={handleUpdateStatus}
                        disabled={updating}
                        className="w-full"
                    >
                        {updating ? "Updating..." : "Update"}
                    </Button>
                </div>

                {updateError && <p className="text-red-600 text-sm">Error: {updateError}</p>}

                {/* User & Shipping Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <p className="font-medium mb-1">Customer Info</p>
                        <p><strong>Name:</strong> {order.user?.username || "N/A"}</p>
                        <p><strong>Phone:</strong> {phoneNumber || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-medium mb-1">Shipping Address</p>
                        <p>
                            {order.shippingAddress
                                ? `${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}`
                                : "N/A"}
                        </p>
                    </div>
                    <div>
                        <p><strong>Ordered on:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                    <div>
                        <p><strong>Delivery by:</strong> {order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : "Pending"}</p>
                    </div>
                </div>

                {/* Items */}
                <div>
                    <p className="font-medium text-gray-800 mb-2">Ordered Items</p>
                    <div className="divide-y border rounded-md">
                        {order.orderItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center px-4 py-2 text-sm">
                                <div>
                                    {item.quantity} x <span className="font-medium">{item.variant.product.name}</span> ({item.variant.weight})
                                </div>
                                <div>₹{item.priceAtPurchase}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="text-right text-lg font-semibold">
                    Total: ₹{order.totalPrice}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
