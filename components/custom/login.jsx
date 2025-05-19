import React from "react";
import Input from "./input";
import FormComponent from "./formComponent";
import { Button } from "../ui/button";
import { RxCross1 } from "react-icons/rx";

const Login = ({ onClose, setIsLoginOpen }) => {
  return (
    <div className="flex-col fixed inset-0 flex p-6 bg-stone-100 rounded-t-xl z-50 mt-52 border-t">
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-700">Login or Register</h1>
        <span
          onClick={onClose}
          className="text-sm text-stone-600 hover:underline"
        >
          <RxCross1 className="text-xl" />
        </span>
      </div>
      <FormComponent setIsLoginOpen={setIsLoginOpen} className="my-6" />
    </div>
  );
};

export default Login;
