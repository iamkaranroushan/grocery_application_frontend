"use client";

import { forwardRef } from "react";

const Input = forwardRef(
  ({ type, label, placeholder, className,value="", ...props}, ref) => {
    return (
      <div className="flex flex-col">
        {label && <label className="mb-1 text-sm font-medium text-stone-500">{label}</label>}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          className={`${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

export default Input;
