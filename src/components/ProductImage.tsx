import { useState } from "react";
import { imageUrl } from "@/lib/api";
import { getPlaceholderImage } from "@/lib/placeholder-images";

// Product images from the hackathon API with Unsplash placeholder fallback.
// 1. Try API image (via proxy)
// 2. If fails, try Unsplash placeholder
// 3. If both fail, show gradient with product name
export function ProductImage({
  src,
  alt,
  className = "",
  seed = "",
}: {
  src?: string;
  alt: string;
  className?: string;
  seed?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [triedPlaceholder, setTriedPlaceholder] = useState(false);
  
  const abs = imageUrl(src);
  const placeholder = getPlaceholderImage(seed);
  
  // Determine which image to try
  const shouldShowFallback = !abs || (failed && triedPlaceholder);
  const imageSrc = !failed ? abs : placeholder;

  // Deterministic warm gradient per product based on seed (last resort)
  const hash = [...(seed || alt)].reduce((n, c) => n + c.charCodeAt(0), 0);
  const hue = 20 + (hash % 60); // Warm tones: 20-80
  const saturation = 30 + (hash % 40); // 30-70%
  const lightness = 60 + (hash % 15); // 60-75%

  if (shouldShowFallback) {
    return (
      <div
        className={`relative flex items-end overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} ${saturation}% ${lightness + 8}%) 0%, hsl(${hue} ${saturation}% ${lightness - 8}%) 100%)`,
        }}
        aria-label={alt}
      >
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,.55),transparent_60%)]" />
        <div className="relative z-10 p-6">
          <p className="font-display text-2xl leading-tight text-ink/85">{alt}</p>
          <p className="mt-2 text-[10px] tracking-luxe text-ink/55">Mensah · Atelier</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={() => {
        if (!failed) {
          setFailed(true);
        } else {
          setTriedPlaceholder(true);
        }
      }}
      loading="lazy"
      crossOrigin="anonymous"
      className={`object-cover ${className}`}
    />
  );
}
