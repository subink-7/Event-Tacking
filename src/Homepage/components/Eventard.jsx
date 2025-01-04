import * as React from "react";

export function Eventard({ date, title, image }) {
  return (
    <div className="flex flex-col grow shrink self-stretch my-auto min-w-[240px] w-[291px]">
      <img
        loading="lazy"
        src={image}
        alt={title}
        className="object-contain max-w-full rounded-2xl aspect-[1.18] w-[365px]"
      />
      <div className="flex flex-col mt-5 max-w-full w-[146px]">
        <div className="text-base">{date}</div>
        <div className="self-start mt-1.5 text-2xl font-medium text-center">
          {title}
        </div>
      </div>
    </div>
  );
}