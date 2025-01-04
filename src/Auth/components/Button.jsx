import * as React from "react";

export function Button({ children, type = "button" }) {
  return (
    <button
      type={type}
      className="w-full px-16 py-3.5 bg-orange-700 rounded-lg border border-red-500 border-solid text-base font-semibold text-white max-md:px-5"
    >
      {children}
    </button>
  );
}
export default Button;