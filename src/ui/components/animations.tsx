import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { RefObject, useEffect } from "react";
import { getHeapSpaceStatistics } from "v8";

const ITEM_LISTING_FROM = {
  opacity: 0,
  x: 28,
  y: 40,
  scale: 0.95,
};
gsap.registerPlugin(ScrollTrigger);

const useItemListingAnimation = ({
  start = "top bottom-=10%",
  ...props
}: {
  start?: string;
  end?: string;
  selector: string;
  ref: RefObject<HTMLDivElement | null>;
  from: {
    y?: number;
    x?: number;
    scale?: number;
    opacity?: number;
  };
}) => {
  // useEffect(() => {
  //   if (!props.ref.current) return;
  //   const items = props.ref.current.querySelectorAll(props.selector);
  //   items.forEach((e) => {
  //     const rect = e.getBoundingClientRect();
  //     if (rect.top >= window.innerHeight) gsap.set(e, props.from);
  //   });
  //   ScrollTrigger.batch(items, {
  //     start,
  //     // onLeaveBack: (batch) => {
  //     //   gsap.set(batch, props.from);
  //     // },
  //     onEnter: (batch) => {
  //       gsap.killTweensOf(batch);
  //       gsap.to(batch, {
  //         opacity: 100,
  //         y: 0,
  //         x: 0,
  //         scale: 1,
  //         duration: 0.2,
  //         ease: "quart.out",
  //         stagger: (index) => {
  //           return Math.min(0.6, index * 0.15);
  //         },
  //       });
  //     },
  //   });
  //   ScrollTrigger.refresh();
  //   return () => {
  //     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  //   };
  // }, []);

  useEffect(() => {
    if (typeof window === "undefined") return; // ⛔ Block on server
    if (!props.ref.current) return;

    const items = props.ref.current.querySelectorAll(props.selector);

    items.forEach((e) => {
      const rect = e.getBoundingClientRect();
      if (rect.top >= window.innerHeight) gsap.set(e, props.from);
    });

    ScrollTrigger.batch(items, {
      start,
      onEnter: (batch) => {
        gsap.killTweensOf(batch);
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 0.2,
          ease: "quart.out",
          stagger: (index) => Math.min(0.6, index * 0.15),
        });
      },
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
};

const ItemListingAnimation = {
  useAnimation: useItemListingAnimation,
  DEFAULT: {
    from: ITEM_LISTING_FROM,
  },
};

export { ItemListingAnimation };
