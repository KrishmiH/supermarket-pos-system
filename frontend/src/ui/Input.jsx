import React from "react";

const Input = React.forwardRef(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
