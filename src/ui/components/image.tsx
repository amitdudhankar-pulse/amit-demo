"use client";

import React, { useEffect, useState } from "react";

const ImageWithFallback = (props: {
  src?: string;
  srcSet?: string;
  alt?: string;
  fallbackSrc: string;
  className?: string;
}) => {
  const { src, srcSet, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setImgSrc(src);
    setFailed(false);
    if (imgSrc?.trim() === "") setImgSrc(fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      {...rest}
      src={imgSrc}
      // Once on the fallback, drop srcSet too or the browser keeps using it
      srcSet={failed ? undefined : srcSet}
      onError={() => {
        setFailed(true);
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export { ImageWithFallback };
