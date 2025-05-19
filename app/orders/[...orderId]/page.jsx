"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useFetchOrderById from "@/hooks/useFetchOrdersById";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { order, loading, error, refetch } = useFetchOrderById(orderId); // Custom hook

  useEffect(() => {
    if (orderId) refetch();
  }, [orderId]);

  if (loading) return <div className="p-5">Loading order details...</div>;
  if (error) return <div className="p-5 text-red-500">Error: {error}</div>;
  if (!order) return <div className="p-5 text-gray-500">Order not found.</div>;

  return (
    <div className="p-5 mt-16 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Order Details</h1>
      <div className="border rounded-lg p-5 shadow-md">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>

        <div className="mt-4">
          <h2 className="font-semibold text-lg mb-2">Items:</h2>
          <ul className="space-y-3">
            {order.orderItems.map((item) => (
              <li key={item.id} className="border p-3 rounded-md">
                <p><strong>Product:</strong> {item.variant.product.name}</p>
                <p><strong>Variant:</strong> {item.variant.weight}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> ₹{item.priceAtPurchase}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
