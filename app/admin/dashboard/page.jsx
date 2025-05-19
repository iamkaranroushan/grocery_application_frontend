'use client'
import Layout from '@/components/custom/layout'
import LoadingSpinner from '@/components/custom/loadingSpinner'
import Logout from '@/components/custom/logout'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineLogout } from 'react-icons/ai'
import { CgNotes } from 'react-icons/cg'
import { FiChevronRight } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import useSocket from '@/hooks/useSocket'
import useFetchUnreadNotifications from '@/hooks/useFetchUnreadNotifications'

const AdminDashboardPage = () => {
  const { id, token, user, email, role, address } = useSelector((state) => state.auth);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const socket = useSocket();

  const { unreadCount, refetch: refetchNotifications, markNotificationsAsRead } = useFetchUnreadNotifications(id); // 👈 hook usage

  useEffect(() => {
    if (!socket) return;

    socket.on("newOrder", (orderData) => {
      console.log("🔥 New order received:", orderData);
      refetchNotifications();
    });

    return () => {
      socket.off("newOrder");
    };
  }, [socket]);

  const routeChange = (url) => {
    const currentUrl = window.location.pathname + window.location.search;
    if (url !== currentUrl) {
      setLoading(true);
      router.push(url, { scroll: false });
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  const handleOrderClick = async () => {
    try {
      await markNotificationsAsRead(); // Mark all as read, badge will disappear
      routeChange("/admin/dashboard/orders");
      console.log("Order clicked and notifications marked as read");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
    console.log("Logout clicked");
  };

  return (
    <div className='flex flex-col mt-14'>
      {isLogoutOpen && (
        <Logout
          setIsLogoutOpen={setIsLogoutOpen}
          onClose={() => {
            setIsLogoutOpen(false);
            console.log("Close clicked");
          }}
        />
      )}

      {loading && (
        <div className="fixed inset-0 w-screen flex items-center justify-center bg-white bg-opacity-60">
          <LoadingSpinner />
        </div>
      )}

      <div className='flex flex-col gap-4 relative'>
        <div onClick={handleOrderClick} className="w-full h-18 flex justify-between rounded-lg items-center cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="bg-gray-200 p-2 rounded-full">
              <CgNotes className="icons text-stone-500" />
            </span>
            <p>All orders</p>
          </div>
          <span className="relative">
            {unreadCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                +{unreadCount}
              </span>
            )}
            <FiChevronRight className="text-stone-600" />
          </span>
        </div>

        {token && (
          <div className="w-full h-18 flex justify-between rounded-lg items-center cursor-pointer">
            <div onClick={handleLogoutClick} className="flex items-center gap-3">
              <span className="bg-gray-200 p-2 rounded-full">
                <AiOutlineLogout className="icons text-stone-500" />
              </span>
              <p>Log out</p>
            </div>
            <span>
              <FiChevronRight className="text-stone-600" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
