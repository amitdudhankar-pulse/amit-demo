"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface ClientLogo {
  id: number;
  name: string;
  company_url?: string | null;
  logo: string | null;
}

interface Props {
  items: ClientLogo[];
}

export default function TrustedBySlider({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initAnimation = async () => {
      if (!trackRef.current || cancelled) return;

      // ✅ Correct GSAP lazy import
      const { gsap } = await import("gsap");

      const track = trackRef.current;

      requestAnimationFrame(() => {
        if (!track || cancelled) return;

        const totalWidth = track.scrollWidth / 2;

        tweenRef.current = gsap.to(track, {
          x: -totalWidth,
          duration: 30,
          ease: "linear",
          repeat: -1,
          force3D: true,
        });
      });
    };

    // ⏳ Delay animation for better TBT / LCP
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(initAnimation);
    } else {
      setTimeout(initAnimation, 200);
    }

    // ⏸ Pause animation when tab is hidden
    const handleVisibility = () => {
      if (!tweenRef.current) return;
      document.hidden
        ? tweenRef.current.pause()
        : tweenRef.current.resume();
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      tweenRef.current?.kill();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="overflow-hidden py-4">
      <h3 className="text-start text-3xl font-bold mb-4">
        Trusted by Leading Brands
      </h3>

      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center gap-16 whitespace-nowrap will-change-transform"
        >
          {[...items, ...items].map((client, index) => (
            <a
              key={`${client.id}-${index}`}
              href={client.company_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 opacity-80 hover:opacity-100 transition"
            >
              <div className="w-40 h-20 flex items-center justify-center">
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={160}
                    height={80}
                    className="object-contain"
                    sizes="160px"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {client.name}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
