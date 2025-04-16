import * as React from "react";

export function Footer() {
  return (
    <div className="flex overflow-hidden flex-col justify-center self-stretch px-20 py-8 mt-28 w-full bg-red-500 bg-opacity-10 max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col  py-12 pr-24 pl-24 w-full bg-red-50 rounded-2xl max-md:px-5 max-md:max-w-full justify-between">
        <div className="flex flex-wrap gap-10 items-center max-md:max-w-full">
          <div className="self-stretch my-auto text-2xl font-medium leading-8 text-center text-red-500">
            Promote culture, preserve
            <br /> identity, inspire pride.
          </div>
          <div className="flex gap-2.5 items-center self-stretch p-11 my-auto bg-white h-[184px] min-h-[184px] rounded-[92px] w-[184px] max-md:px-5">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/23df5bfe05e34071448b6849aa6a1c93fd6d0ac3f66bc043b442e76d6815eb51?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
              alt="Company logo"
              className="object-contain self-stretch my-auto aspect-square w-[100px]"
            />
          </div>
          <nav className="flex gap-10 items-start self-stretch my-auto min-w-[240px]">
            <div className="flex flex-col text-base text-red-500">
              <h3 className="text-xl font-bold leading-none">Quick Links</h3>
              <ul>
                <li className="mt-4">
                  <a href="#about" className="hover:underline">About Us</a>
                </li>
                <li className="mt-4">
                  <a href="#customers" className="hover:underline">Our Customers</a>
                </li>
                <li className="mt-4">
                  <a href="#feedback" className="hover:underline">Share Feedback</a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold leading-none text-red-500">
                Follow Us on:
              </h3>
              <div className="flex gap-1.5 items-center self-start mt-4">
                <div className="flex flex-col self-stretch my-auto text-base text-red-500 w-[76px]">
                  <a href="#facebook" className="hover:underline">Facebook</a>
                  <a href="#instagram" className="mt-4 hover:underline">Instagram</a>
                  <a href="#twitter" className="mt-4 hover:underline">Twitter</a>
                </div>
                <div className="flex flex-col self-stretch my-auto w-6">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/f78a224ecb95f4a44dda7ec4321edf4bacac237b8b4a066db629921dce15d7e7?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
                    alt=""
                    className="object-contain w-6 aspect-square"
                  />
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7c4927490621273f1363317467ceb6bfe689dadf1dc04a92066b1b8e6c078775?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
                    alt=""
                    className="object-contain mt-4 w-6 aspect-square"
                  />
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/08ec7678c1e96f855e7f654d8b0f19d8cbb42dfc34e4f356889da7c3409ed428?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
                    alt=""
                    className="object-contain mt-4 w-6 aspect-square"
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}