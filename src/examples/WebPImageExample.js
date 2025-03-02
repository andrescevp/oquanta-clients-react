import React from 'react';

// La imagen original será convertida a WebP automáticamente
import originalImage from '../assets/images/example.jpg';
// Asumimos que la ruta WebP será generada con la misma base pero extensión .webp
const webpImage = originalImage.replace(/\.(jpe?g|png)$/, '.webp');

const WebPImageExample = () => {
  return (
    <div className="webp-image-example">
      <h2>Ejemplo de imagen con soporte WebP</h2>
      <picture>
        <source srcSet={webpImage} type="image/webp" />
        <source srcSet={originalImage} type="image/jpeg" /> 
        <img src={originalImage} alt="Imagen con fallback" />
      </picture>
    </div>
  );
};

export default WebPImageExample;
