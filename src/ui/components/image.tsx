"use client";

import React, { useEffect, useState } from "react";

const ImageWithFallback = (props: {
  src?: string;
  alt?: string;
  fallbackSrc: string;
  className?: string;
}) => {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => {
    setImgSrc(src);
    if (imgSrc?.trim() === "") setImgSrc(fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export { ImageWithFallback };
