import React from "react";
import Input from "./input";
import FormComponent from "./formComponent";
import { Button } from "../ui/button";
import { RxCross1 } from "react-icons/rx";

const SignUp = ({ onClose }) => {
  return (
    <div className="flex-col fixed inset-0 flex p-6 bg-stone-100 rounded-t-xl z-50 mt-52">
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-700">Register</h1>
        <span
          onClick={onClose}
          className="text-sm text-stone-600 hover:underline"
        >
          <RxCross1 className="text-xl" />
        </span>
      </div>
      <FormComponent className="mt-6 mb-4" />

      <Button className="p-7">Register</Button>
      <p className="text-sm text-stone-600 mt-3">
        already have any account?{" "}
        <span className="font-semibold underline text-stone-700">
          {" "}
          login here
        </span>{" "}
      </p>
    </div>
  );
};

export default SignUp;
