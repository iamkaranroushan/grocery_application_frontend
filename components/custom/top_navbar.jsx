import React from "react";
import { IoIosSearch } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";
import { useSelector } from "react-redux";

const Top_navbar = ({ routeChange }) => {
  const { role } = useSelector((state) => state.auth);  // Get the user's role from the store

  return (
    <div className="top-0 z-20 fixed flex w-screen px-3 py-2 border items-center justify-center bg-white ">
      <div className="flex items-center justify-between py-3 w-screen ">
        <div className=" flex items-center rounded-sm ">
          <span className="font-bold">Easy shopping</span>
        </div>
        {/* Conditionally render the user icon for regular users */}
      </div>
    </div>
  );
};

export default Top_navbar;
