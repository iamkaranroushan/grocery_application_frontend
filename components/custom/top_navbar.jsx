import { usePathname } from "next/navigation";
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { TbCategory2 } from "react-icons/tb";
import { useSelector } from "react-redux";

const Top_navbar = ({ routeChange }) => {
  const { role } = useSelector((state) => state.auth);  // Get the user's role from the store
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div className="top-0 z-20 fixed flex w-screen py-5 px-2 lg:py-5 lg:px-20  items-center justify-center bg-white ">
      <div className="flex items-center justify-between w-full ">
        <div className=" flex items-center ">
          <span className="font-bold  pl-2 lg:text-2xl">grocery.co</span>
        </div>
        <div className="hidden lg:flex lg:justify-around lg:space-x-28 lg:items-center">

          <button onClick={() => routeChange("/")}>
            <span className={`text-lg  ${isActive("/") && "text-black font-bold"} `}> Home</span>
          </button>
          <button>
            <span
              onClick={() => routeChange("/categories")}
              className={`text-lg ${isActive("/categories") && "text-black font-bold"}  `}
            >Categories</span>
          </button>

          {/* Conditionally render the cart icon or edit icon based on the role */}
          {role === "admin" ? (
            <button onClick={() => routeChange("/admin/edit")}>
              <span

                className={`text-lg ${isActive("/admin/edit") && "text-black font-bold"}  `}
              >Edit</span>
            </button>
          ) : (
            <button onClick={() => routeChange("/cart")}>
              <span
                className={`text-lg ${isActive("/cart") && "text-black font-bold"}  `}
              >Cart</span>
            </button>
          )}

          {/* Conditionally render the transaction icon or a dashboard link based on the role */}
          <div className="flex items-center justify-center mr-1">
            {role !== "admin" ? (
              <button className=" rounded-full " onClick={() => routeChange("/user")}>
                <span className={`text-lg ${isActive("/user") && "text-black font-bold"}  `} >User</span>
              </button>
            ) : (
              <button className=" rounded-full " onClick={() => routeChange("/admin/dashboard")}>
                <span className={`text-lg ${isActive("/admin/dashboard") && "text-black font-bold"}  `} >Admin</span>
              </button>
            )}
          </div>
        </div>
        {/* Conditionally render the user icon for regular users */}
      </div>
    </div>
  );
};

export default Top_navbar;
