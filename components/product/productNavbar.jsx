import React from "react";
import { IoMdArrowBack, IoIosSearch } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const ProductNavbar = ({ handleBack, routeChange }) => {
  const { role } = useSelector((state) => state.auth);

  return (
    <div className="top-0 z-20 fixed flex justify-between items-center w-screen p-3 border bg-white shadow-sm">
      <div className="flex items-center rounded-sm">
        <button onClick={() => handleBack()}>
          <IoMdArrowBack className="icons" />
        </button>
        <span className="h-6 w-[1px] bg-stone-300 mx-2"></span>
        
      </div>
      <div className="flex items-center justify-around  rounded-sm  ">
        {role !== "admin" && (
          <button onClick={() => routeChange("/cart")}>
            <IoBagOutline className="m-2 icons" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductNavbar;
