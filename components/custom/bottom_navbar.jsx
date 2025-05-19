import React from "react";
import { FiHome } from "react-icons/fi";
import { TbCategory2 } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";
import { IoBagOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { LuUserRound } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";

export const Bottom_navbar = ({ routeChange }) => {
  const { role } = useSelector((state) => state.auth); // Get the role from auth store
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bg-white bottom-0 w-screen flex justify-around items-center p-4 border-t">
      <button onClick={() => routeChange("/")}>
        <FiHome className={`icons ${isActive("/") && "text-stone-400"} `} />
      </button>
      <button>
        <TbCategory2
          onClick={() => routeChange("/categories")}
          className={`icons ${isActive("/categories") && "text-stone-400"}  `}
        />
      </button>

      {/* Conditionally render the cart icon or edit icon based on the role */}
      {role === "admin" ? (
        <button onClick={() => routeChange("/admin/edit")}>
          <FaRegEdit
            className={`icons ${isActive("/admin/edit") && "text-stone-400"}  `}
          />
        </button>
      ) : (
        <button onClick={() => routeChange("/cart")}>
          <IoBagOutline
            className={`icons ${isActive("/cart") && "text-stone-400"}  `}
          />
        </button>
      )}

      {/* Conditionally render the transaction icon or a dashboard link based on the role */}
      <div className="flex items-center justify-center mr-1">
        {role !== "admin" ? (
          <button className=" rounded-full " onClick={() => routeChange("/user")}>
            <LuUserRound className={`icons ${isActive("/user") && "text-stone-400"}  `} />
          </button>
        ) : (
          <button className=" rounded-full " onClick={() => routeChange("/admin/dashboard")}>
            <LuUserRound className={`icons ${isActive("/admin/dashboard") && "text-stone-400"}  `}/>
          </button>
        )}
      </div>
    </div>
  );
};
