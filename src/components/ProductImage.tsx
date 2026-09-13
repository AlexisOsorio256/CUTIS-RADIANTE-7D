"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Imagen con fallback elegante: si la foto real aún no está en /public/images,
 * muestra un degradado rosa con las iniciales (nunca rompe el diseño).
 */
export default function ProductImage({ src, alt, className = "", sizes, priority }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-blush-100 via-brand-50 to-nude ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-serif text-4xl text-brand-500/70">CR</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill={!className.includes("w-")}
      width={className.includes("w-") ? 900 : undefined}
      height={className.includes("w-") ? 900 : undefined}
      className={className.includes("w-") ? className : `object-cover ${className}`}
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
