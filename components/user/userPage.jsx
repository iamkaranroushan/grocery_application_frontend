"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { PiAddressBookLight } from "react-icons/pi";
import { LuShoppingCart } from "react-icons/lu";
import { BiSupport } from "react-icons/bi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { CgNotes } from "react-icons/cg";
import { FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import useSocket from "@/hooks/useSocket";
import useFetchUnreadNotifications from "@/hooks/useFetchUnreadNotifications";
import { useNotificationSound } from "@/hooks/useNotificationSound";

const UserPage = ({
  loading,
  handleClick,
  isLoginOpen,
  handleLogoutClick,
  handleCartClick,
  handleSupportClick,
  handleAboutClick,
  handleAddressClick,
  handleOrderClick,
}) => {
  const socket = useSocket();
  const { id, token, user, phoneNumber, role, address } = useSelector((state) => state.auth);
  const { unreadCount, refetch, markNotificationsAsRead } = useFetchUnreadNotifications(id);
  const { playSound } = useNotificationSound();

  useEffect(() => {
    if (!socket || !id) return;
    const handleUpdate = async () => {
      playSound();
      refetch();
    };
    socket.on("updatedOrder", handleUpdate);
    return () => socket.off("updatedOrder", handleUpdate);
  }, [socket, id]);

  const onUserOrderClick = async () => {
    try {
      await markNotificationsAsRead();
      handleOrderClick();
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  // 🚫 If not logged in, just show login prompt
  if (!token) {
    return (
      <div className=" flex flex-col mt-14 px-4 py-4 space-y-6">
        <div className="flex flex-col justify- bg-white rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">Get Started</h2>
          <h2 className="text-sm font-semibold text-stone-500 mb-2">you are just one step away from enjoying our services </h2>
          <Button variant="order" size="order" onClick={handleClick}>
            Login to continue
          </Button>
          </div>
          <p className="text-6xl font-semibold text-stone-200">keep shopping</p>
      </div>
    );
  }

  // ✅ If logged in, show full UI
  return (
    <div className={`mt-14 px-4 py-4 space-y-6 md:grid md:gap-6 md:space-y-0 md:max-w-4xl md:mx-auto`}>
      {/* Left Column – User Info */}
      <div className="space-y-2">
        <div className="space-y-1 bg-white p-4 md:p-6">
          <h2 className="text-xl lg:text-3xl font-semibold text-neutral-800">Welcome, {user}</h2>
          {role === "customer" && (
            <p className="text-neutral-500 lg:text-lg text-sm">{phoneNumber}</p>
          )}
        </div>

        <div className="space-y-2 lg:space-y-4 bg-white p-4 md:p-6">
          <h4 className="text-neutral-500 text-sm lg:text-lg font-medium">User Information</h4>
          <div className="space-y-1 lg:space-y-3">
            <ItemRow onClick={onUserOrderClick} icon={<CgNotes />} label="Your Orders" badge={unreadCount} loading={loading} />
            <ItemRow onClick={handleAddressClick} icon={<PiAddressBookLight />} label="Saved Addresses" loading={loading} />
            <ItemRow onClick={handleCartClick} icon={<LuShoppingCart />} label="Your Cart" loading={loading} />
          </div>
        </div>
      </div>

      {/* Right Column – Others */}
      <div className="space-y-2">
        <div className="space-y-2 lg:space-y-4 bg-white p-4  md:p-6">
          <h4 className="text-neutral-500 text-sm lg:text-lg font-medium">Others</h4>
          <div className="space-y-1 lg:space-y-3">
            <ItemRow onClick={handleSupportClick} icon={<BiSupport />} label="Support" loading={loading} />
            <ItemRow onClick={handleAboutClick} icon={<IoIosInformationCircleOutline />} label="About Us" loading={loading} />
            <ItemRow onClick={handleLogoutClick} icon={<AiOutlineLogout />} label="Logout" loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemRow = ({ onClick, icon, label, badge, loading }) => (
  <div
    onClick={!loading ? onClick : undefined}
    className={`flex items-center justify-between bg-white p-3 cursor-pointer transition md:px-6 rounded-lg hover:bg-gray-50
      ${loading ? "opacity-0 pointer-events-none" : ""}`}
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-100 rounded-full text-lg text-gray-600">{icon}</div>
      <span className="text-base lg:text-xl text-gray-800">{label}</span>
    </div>

    {!loading && (
      <div className="flex items-center gap-1 relative">
        {badge > 0 && (
          <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            +{badge}
          </span>
        )}
        <FiChevronRight className="text-sm lg:text-lg text-stone-400" />
      </div>
    )}
  </div>
);


export default UserPage;
