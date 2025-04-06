import React, { useState } from "react";

const ImagenConFallback = ({ src, fallback, alt, style, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallback);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      style={style}
      {...props}
    />
  );
};

export default ImagenConFallback;
