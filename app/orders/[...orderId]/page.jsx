"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useFetchOrderById from "@/hooks/useFetchOrdersById";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { order, loading, error, refetch } = useFetchOrderById(orderId);
  const ORDER_STATUS = ["ORDERED", "CONFIRMED", "DELIVERED"];

  const getStatusIndex = (status) => {
    return ORDER_STATUS.indexOf(status);
  };
  useEffect(() => {
    if (orderId) refetch();
  }, [orderId]);

  if (loading) return <div className="p-5 mt-20">Loading order details...</div>;
  if (error) return <div className="p-5 mt-20 text-red-500">Error: {error}</div>;
  if (!order) return <div className="p-5 mt-20 text-gray-500">Order not found.</div>;

  return (
    <div className="p-4 mt-10 lg:mt-20 max-w-4xl lg:mx-auto space-y-6">
      <div className=" p-6 bg-white space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Order Summary</h1>
        <div className="text-sm sm:text-base text-gray-600 space-y-1">
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          <p><strong>Placed On:</strong> {new Date(order.orderDate).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white px-6 pt-6 pb-4 rounded-lg shadow-sm">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Order Status</h2>
        <div className="relative flex items-center justify-between">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full transform -translate-y-1/2 z-0" />

          {/* Animated Fill */}
          <motion.div
            className="absolute top-1/2 left-0 h-1 bg-green-500 rounded-full z-10"
            style={{
              width: `${(getStatusIndex(order.status) / (ORDER_STATUS.length - 1)) * 100}%`,
              transform: "translateY(-50%)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(getStatusIndex(order.status) / (ORDER_STATUS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />

          {/* Status Dots */}
          {ORDER_STATUS.map((status, index) => {
            const isActive = getStatusIndex(order.status) >= index;
            return (
              <div key={status} className="z-20 flex flex-col items-center flex-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 ${isActive ? "bg-green-500 border-green-600" : "bg-white border-gray-300"}`}
                />
                <span
                  className={`mt-2 text-xs font-medium text-center ${isActive ? "text-green-600" : "text-gray-400"
                    }`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="p-4 border rounded-lg bg-white">
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
              <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                <Image
                  src={item.variant.product.imageUrl}
                  alt={item.variant.product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 100px"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-[16px] lg:text-lg font-semibold text-gray-800">{item.variant.product.name}</h3>
                <p className="text-sm text-stone-500">Variant: {item.variant.weight}</p>
                <p className="text-sm text-stone-500">Quantity: {item.quantity}</p>
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-700">₹{item.priceAtPurchase}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

