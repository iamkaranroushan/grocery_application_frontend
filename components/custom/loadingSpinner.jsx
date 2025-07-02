"use client";
import { GridLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex justify-center items-center">
      <GridLoader
        color="#292a2d"
        margin={6}
        size={15}
        speedMultiplier={2}
      />
    </div>
  );
};

export default LoadingSpinner;
