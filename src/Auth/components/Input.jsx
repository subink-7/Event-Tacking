import * as React from "react";


export function Input({ label, type = "text", id, error }) {
  return (
    <div className="flex flex-col mt-4 w-full first:mt-0 text-white">
    <label htmlFor={id} className="whitespace-nowrap">
      {label}
    </label>
    <input
      id={id}
      type={type}
      name={id}
      required
      aria-required="true"
      className="flex mt-2.5 w-full rounded-lg border border-red-500 border-solid bg-white bg-opacity-70 min-h-[45px] px-3"
    />
  </div>
  );
}
export default Input;