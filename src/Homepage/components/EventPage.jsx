import * as React from "react";


import { Eventard } from "./Eventard";





const upcomingEvents = [
  {
    date: "8 December",
    title: "Yomari Punhi",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/6b8fcfbe4cef8db1b815bad97be278d358ccca533e79ff181206e2d70e575f32?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
  },
  {
    date: "8 December",
    title: "Udhauli Parva",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/e0a8b3cc0cc52eb55a0b7e679ace61ad13ac81c058766b8cf802254bb5223ada?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
  },
  {
    date: "9 December",
    title: "Matina Paru",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/72da5e9234f09d4d6fdba0c6f6b9a7e2045c491163340bb4cebb7f679b1e292a?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
  }
];

export default function EventsPage() {
  return (
    <div className="flex overflow-hidden flex-col items-center pt-10 bg-white ">
   
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/606897a42dd2949a562d0fc9bec01211ef20ece62d7178d2c8954ba50e7872a4?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
        alt="Cultural event banner"
        className="object-contain self-stretch mt-16 w-full aspect-[4.88] max-md:mt-10 max-md:max-w-full"
      />
      <div className="flex flex-wrap gap-0.5 items-end mt-16 max-w-full text-xl font-light text-center text-black w-[933px] max-md:mt-10">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c71bd83708c4d13461bc75075d878344f65ad101ab0eb5a9c937de34b2bf4f1?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
          alt=""
          className="object-contain shrink-0 self-start aspect-square w-[50px]"
        />
        <div className="grow shrink mt-8 w-[818px] max-md:max-w-full">
          In the heart of Nepal, diversity blooms like a garden of vibrant
          cultures, each petal telling its own story, yet together creating a
          masterpiece of harmony and pride. From the towering Himalayas to the
          fertile plains, every step reveals a mosaic of traditions. Here, unity
          is not just a choice but a way of life, celebrated in every festival,
          language, and smile.
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7d3719bc0454f79e77f78659bd070f337d60752d172cb4e5f67b8797110ed05?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
          alt=""
          className="object-contain shrink-0 mt-24 aspect-square w-[50px] max-md:mt-10"
        />
      </div>
      <div className="flex flex-col mt-16 w-full max-w-[1234px] max-md:mt-10 max-md:max-w-full">
        <h2 className="text-2xl font-bold text-red-500 max-md:max-w-full">
          Upcoming events:
        </h2>
        <div className="flex flex-wrap gap-10 items-center mt-8 w-full text-black max-md:max-w-full">
          {upcomingEvents.map((event, index) => (
            <Eventard key={index} {...event} />
          ))}
        </div>
      </div>
   
    
    </div>
  );
}