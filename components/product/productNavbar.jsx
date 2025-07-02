import { useIsMobile } from "@/hooks/useIsMobile";
import { usePathname } from "next/navigation";
import React from "react";
import { IoMdArrowBack, IoIosSearch } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const ProductNavbar = ({ handleBack, routeChange }) => {
  const isMobile = useIsMobile();
  const { role } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  return (
    <div className="top-0 z-20 fixed flex w-full py-5 px-4 lg:py-5 lg:px-20  items-center justify-between bg-white">
      <div className="flex items-center rounded-sm">
        <button onClick={() => handleBack()}>
          {isMobile && <IoMdArrowBack className="icons" />}
          <span className="font-semibold hidden lg:block text-lg">Back</span>
        </button>
        <span className="h-6 w-[1px] bg-stone-300 mx-2"></span>

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
      <button onClick={() => routeChange("/cart")}>
        <IoBagOutline className="icons"/>
      </button>
    </div>
  );
};

export default ProductNavbar;
