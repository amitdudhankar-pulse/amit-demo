import { useState } from "react";
import { twMerge } from "tailwind-merge";

type LiteYouTubeProps = {
  videoUrl: string;
  className?: string;
};

export default function LiteYouTube({ videoUrl, className }: LiteYouTubeProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={twMerge("relative w-full h-full", className)}
      onClick={() => setLoaded(true)}
      style={{ cursor: "pointer" }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-[2]">
          <button className="bg-white text-black px-4 py-2 rounded-lg">
            ▶ Play
          </button>
        </div>
      )}

      {!loaded && (
        <iframe
          className="w-full h-full rounded-2xl pointer-events-none opacity-90"
          src={videoUrl.replace("embed/", "embed/") + "?autoplay=0"}
          loading="lazy"
        />
      )}

      {loaded && (
        <iframe
          className="w-full h-full rounded-2xl"
          src={videoUrl + "?autoplay=1"}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}
