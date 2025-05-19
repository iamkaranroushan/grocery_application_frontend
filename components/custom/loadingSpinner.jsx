"use client";
import { GridLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="flex w-full h-[75vh] justify-center items-center">
      <div className="bg-white rounded-2xl p-6 shadow-md flex justify-center items-center">
        <GridLoader
          color="#292a2d"
          margin={6}
          size={15}
          speedMultiplier={2}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
