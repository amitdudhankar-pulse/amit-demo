import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import React, { ReactElement, useRef } from "react";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import { twMerge } from "tailwind-merge";
import { ItemListingAnimation } from "./animations";

function HorizontalScroller<T>(props: {
  className?: string;
  dataList: T[];
  builder: (data: T, i: number, className?: string) => ReactElement;
}) {
  const [emblaRef, emblaAPI] = useEmblaCarousel({ dragFree: true }, [
    WheelGesturesPlugin(),
  ]);
  const ref = useRef<HTMLDivElement>(null);
  const buttonClassName = twMerge(
    "border-2  border-boundary bg-white rounded-full size-11 p-1",
    "hover:bg-button-focus hover:text-primary hover:border-boundary",
    "cursor-pointer",
    "shadow-button",
    "sm:block hidden"
  );
  return (
    <div className="relative flex flex-col w-full overflow-visible h-full">
      <div
        id="embla-overflow-container"
        className={twMerge(
          "relative flex flex-col overflow-x-clip w-full gap-4 h-full",
          props.className
        )}
        ref={emblaRef}
      >
        <div
          ref={ref}
          id="embla-scroll-container"
          className="flex gap-5 px-4 items-stretch"
        >
          {props.dataList.map((e, i) =>
            props.builder(e, i, "anim-card flex-1")
          )}
        </div>
      </div>
      <GoArrowLeft
        className={twMerge(
          buttonClassName,
          "absolute lg:-left-8 -left-4 20 top-[40%]"
        )}
        onClick={() => emblaAPI?.scrollPrev()}
      />
      <GoArrowRight
        className={twMerge(
          buttonClassName,
          "absolute lg:-right-8 -right-4 z-20 top-[40%]"
        )}
        onClick={() => emblaAPI?.scrollNext()}
      />
    </div>
  );
}

export { HorizontalScroller };
