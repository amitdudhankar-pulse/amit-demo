import { useEffect, useState } from "react";
import NextImage from "next/image";
import { Paths } from "@/contants";

type SafeImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

const FALLBACK = Paths.IMAGE.FALLBACK;

export const SafeImage = ({
  src,
  alt,
  width,
  height,
  className,
}: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={imgSrc === FALLBACK}
      onError={() => {
        if (imgSrc !== FALLBACK) {
          setImgSrc(FALLBACK);
        }
      }}
      suppressHydrationWarning
    />
  );
};
