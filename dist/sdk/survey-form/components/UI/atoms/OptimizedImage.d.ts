import React from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';
interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number | string;
    height?: number | string;
    placeholderSrc?: string;
}
export declare const OptimizedImage: React.FC<OptimizedImageProps>;
export default OptimizedImage;
