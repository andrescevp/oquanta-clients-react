import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import 'react-lazy-load-image-component/src/effects/blur.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  placeholderSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderSrc
}) => {
  return (
    <LazyLoadImage
      alt={alt}
      src={src}
      width={width}
      height={height}
      effect="blur"
      placeholderSrc={placeholderSrc}
      className={className}
    />
  );
};

export default OptimizedImage;