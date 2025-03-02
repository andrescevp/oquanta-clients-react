// Declaraciones básicas para formatos de imagen
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

// Declaraciones específicas para parámetros de consulta
declare module '*.png?as=webp' {
  const src: string;
  export default src;
}

declare module '*.jpg?as=webp' {
  const src: string;
  export default src;
}

declare module '*.jpeg?as=webp' {
  const src: string;
  export default src;
}

// Para parámetros de ancho y alto
declare module '*?w=*' {
  const src: string;
  export default src;
}

declare module '*?h=*' {
  const src: string;
  export default src;
}

declare module '*?width=*' {
  const src: string;
  export default src;
}

declare module '*?height=*' {
  const src: string;
  export default src;
}

// Para combinaciones comunes
declare module '*?as=webp&w=*' {
  const src: string;
  export default src;
}

declare module '*?as=webp&h=*' {
  const src: string;
  export default src;
}

declare module '*?w=*&h=*' {
  const src: string;
  export default src;
}

declare module '*?as=webp&w=*&h=*' {
  const src: string;
  export default src;
}