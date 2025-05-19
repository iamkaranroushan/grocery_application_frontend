import React from "react";
import {
    IoIosArrowRoundBack,
    IoIosSearch,
    IoMdArrowBack,
} from "react-icons/io";
import { IoArrowBack, IoArrowBackOutline, IoBagOutline } from "react-icons/io5";
import { TbArrowBackUp } from "react-icons/tb";

const AdminNavbar = ({ handleBack }) => {
    return (
        <div className="top-0 z-20 fixed flex w-screen px-3 py-2 border items-center justify-center bg-white ">
            <div className="flex items-center justify-between py-3 w-screen ">
                <div className=" flex items-center rounded-sm ">
                    <button onClick={() => handleBack()}>
                        <IoMdArrowBack className="icons" />
                    </button>
                    <span className="h-6 w-[1px] bg-stone-300 mx-2"></span>
                    <p className="text-stone-700 font-semibold">Admin Dashboard</p>
                </div>
                {/* Conditionally render the user icon for regular users */}
            </div>
        </div>
    );
};

export default AdminNavbar;
