import * as React from "react";

export function Header() {
  return (
    <div className="flex flex-wrap gap-10 justify-between items-center w-full max-w-[1306px] max-md:max-w-full mt-0">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/23df5bfe05e34071448b6849aa6a1c93fd6d0ac3f66bc043b442e76d6815eb51?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
        alt="Company logo"
        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[100px]"
      />
      <div className="flex gap-5 items-end self-stretch my-auto">
        <div className="text-xl text-center text-black cursor-pointer">Events</div>
        <div className="flex gap-5 items-center">
          <button 
            aria-label="Search"
            className="flex items-center justify-center">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e12b08c9e18c5dfa50ef0bd988adb0bd2a66432d51873513c66f2dea85a0968?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
              alt=""
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
          </button>
          <button 
            aria-label="Menu"
            className="flex items-center justify-center">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/72f250570677b63bf76c409c368034e6b9d91f86a6e253d024c0b101295647eb?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
              alt=""
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[26px]"
            />
          </button>
        </div>
      </div>
    </div>
  );
}