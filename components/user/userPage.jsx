"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PiAddressBookLight } from "react-icons/pi";
import { CiShoppingCart } from "react-icons/ci";
import { BiSupport } from "react-icons/bi";
import { IoCartOutline } from "react-icons/io5";
import { GrTransaction } from "react-icons/gr";
import { LuShoppingCart } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { FiChevronRight } from "react-icons/fi";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import useSocket from "@/hooks/useSocket";
import useFetchUnreadNotifications from "@/hooks/useFetchUnreadNotifications";
import { useNotificationSound } from "@/hooks/useNotificationSound";

const UserPage = ({ loading, handleClick, isLoginOpen, handleLogoutClick, handleCartClick, handleSupportClick, handleAboutClick, handleAddressClick, handleOrderClick, handleCardClick }) => {
  const socket = useSocket(); // use your custom socket hook
  const [hasOrderNotification, setHasOrderNotification] = useState(false);
  const { id, token, user, email, role, address } = useSelector((state) => state.auth);
  const { unreadCount, refetch, markNotificationsAsRead } = useFetchUnreadNotifications(id);
  const { playSound, unlockAudio, canPlay } = useNotificationSound();
  const [soundPromptDismissed, setSoundPromptDismissed] = useState(false);
  // Access the token from Redux store
  console.log("id is:", id); // Use the token as needed
  console.log(address)

  useEffect(() => {
    if (!socket || !id) return;

    const handleUpdate = async (data) => {
      console.log("📬 Order status updated:", data);
      playSound(); // won't play if not unlocked
      refetch();
    };

    socket.on("updatedOrder", handleUpdate);
    return () => socket.off("updatedOrder", handleUpdate);
  }, [socket, id, playSound]);

  const onUserOrderClick = async () => {
    try {
      await markNotificationsAsRead(); // clear badge
      handleOrderClick(); // whatever navigation or callback you're passing
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  return (

    <div className={`flex flex-col mt-14 ${isLoginOpen ? "blur-sm" : ""}`}>

      {/*name */}
      <div className=" w-full h-12 flex flex-col justify-center my-4">
        {token ? (
          <div>
            <h1 className="text-2xl text-stone-700 font-semibold">
              {user}
            </h1>

            {role === "customer" && <h1 className="text-md text-stone-700 font-medium">{address?.phoneNumber}</h1>}

          </div>
        ) : (
          <Button className="p-7" onClick={handleClick}>Login to proceed</Button>
        )}
      </div>
      {/*phone no. */}
      {/*important links icons. */}
      <div className="bg-sky-700/10 w-full h-18 flex gap-3 justify-around rounded-lg items-center p-4">
        <span onClick={handleCartClick} className="flex flex-col items-center gap-1">
          <LuShoppingCart className="icons" />
          <p className="text-sm text-stone-600 ">cart</p>
        </span>

        <span onClick={handleSupportClick} className="flex flex-col items-center gap-1">
          <BiSupport className="icons" />
          <p className="text-sm text-stone-600 ">support</p>
        </span>
      </div>
      {/*address*/}
      <div className="flex flex-col mt-4 mb-4">
        <span className="text-stone-500">User Information</span>

        <div className="flex flex-col justify-between items-center my-4 px-1 gap-4">
          <div
            onClick={onUserOrderClick}
            className="relative w-full h-18 flex justify-between rounded-lg items-center"
          >
            <div className="flex items-center gap-3">
              <span className="bg-gray-200 p-2 rounded-full">
                <CgNotes className="icons text-stone-500" />
              </span>
              <p>your orders</p>
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

          {/*<div onClick={handleCardClick} className="w-full h-18 flex justify-between rounded-lg items-center  ">
            <div className="flex items-center gap-3">
              <span className="bg-gray-200 p-2 rounded-full">
                <MdOutlinePayment className="icons text-stone-500" />{" "}
              </span>
              <p>saved cards </p>
            </div>
            <span>
              <FiChevronRight className="text-stone-600" />
            </span>
          </div>*/}

          <div onClick={handleAddressClick} className="w-full h-18 flex justify-between rounded-lg items-center ">
            <div className="flex items-center gap-3">
              <span className="bg-gray-200 p-2 rounded-full">
                <PiAddressBookLight className="icons text-stone-500" />{" "}
              </span>
              <p>saved addresses </p>
            </div>
            <span>
              <FiChevronRight className="text-stone-600" />
            </span>
          </div>
        </div>
      </div>

      {/*other information*/}
      <div className="flex flex-col mb-4">
        <span className="text-stone-500">Others</span>
        <div className="flex flex-col justify-between items-center my-4 px-1 gap-4">
          <div onClick={handleAboutClick} className="w-full h-18 flex justify-between rounded-lg items-center">
            <div className="flex items-center gap-3">
              <span className="bg-gray-200 p-2 rounded-full">
                <IoIosInformationCircleOutline className="icons text-stone-500" />{" "}
              </span>
              <p>About us </p>
            </div>
            <span>
              <FiChevronRight className="text-stone-600" />
            </span>
          </div>
          <>
            {token && <div className="w-full h-18 flex justify-between rounded-lg items-center">
              <div onClick={handleLogoutClick} className="flex items-center gap-3">
                <span className="bg-gray-200 p-2 rounded-full">
                  <AiOutlineLogout className="icons text-stone-500" />{" "}
                </span>
                <p>log out </p>
              </div>
              <span>
                <FiChevronRight className="text-stone-600" />
              </span>
            </div>
            }
          </>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
