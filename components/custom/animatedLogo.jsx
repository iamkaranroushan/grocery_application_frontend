// components/AnimatedLoader.jsx
import React from "react";
import Image from "next/image";

const AnimatedLoader = () => {
    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-center items-center">
            <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-gray-600"></div>
            <div className="mt-4 text-gray-500 text-sm animate-bounce">Loading...</div>
        </div>
    );
};

export default AnimatedLoader;
