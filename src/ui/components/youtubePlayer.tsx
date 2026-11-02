"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }

    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

export default function DiscoverVideoSection({
  videoUrl,
}: {
  videoUrl: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canLoad, setCanLoad] = useState(false);
  const [play, setPlay] = useState(false);

  // ✅ ALWAYS compute before render logic
  const videoId = getYouTubeId(videoUrl);

  // ✅ Hook is ALWAYS called
  useEffect(() => {
    if (!containerRef.current || !videoId) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [videoId]);

  return (
    <div
        className="bg-blbl w-full py-12 flex justify-center">
      <div className="max-w-5xl w-full px-4">
        {/* ❗ Render only if valid video */}
        {!videoId ? null : (
          <div
            ref={containerRef}
            className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden
                       bg-black shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            <div className="aspect-video relative">
              {/* IFRAME */}
              {/* {play && ( */}
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title="Discover Groupify AI"
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              {/* )} */}

            {/* {!play && canLoad && (
            <button
                aria-label="Play video"
                onClick={() => setPlay(true)}
                className="absolute inset-0 group"
            >
                <Image
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt="Discover GroupifyAI"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                priority={false}
                className="object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="relative flex items-center justify-center">
                    <span className="absolute h-20 w-20 rounded-full bg-white/30 animate-ping" />
                    <span
                    className="relative h-16 w-16 rounded-full bg-white flex items-center justify-center
                                shadow-xl text-2xl group-hover:scale-110 transition-transform"
                    >
                    ▶
                    </span>
                </div>
                </div>
            </button>
            )} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
