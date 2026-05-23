import { useState } from "react";
import { imageUrl } from "@/lib/api";
import { getPlaceholderImage } from "@/lib/placeholder-images";

// Product images from the hackathon API may not be available.
// Falls back to Unsplash placeholder images, then gradient as last resort.
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
  const abs = imageUrl(src);
  const placeholder = getPlaceholderImage(seed);
  
  // Show fallback if no URL or image failed (after trying placeholder)
  const showGradient = failed;

  // Deterministic warm gradient per product based on seed (last resort fallback)
  const hash = [...(seed || alt)].reduce((n, c) => n + c.charCodeAt(0), 0);
  const hue = 20 + (hash % 60); // Warm tones: 20-80
  const saturation = 30 + (hash % 40); // 30-70%
  const lightness = 60 + (hash % 15); // 60-75%

  if (showGradient) {
    // Beautiful gradient fallback if both API and placeholder fail
    return (
      <div
        className={`relative flex items-end overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} ${saturation}% ${lightness + 8}%) 0%, hsl(${hue} ${saturation}% ${lightness - 8}%) 100%)`,
        }}
        aria-label={alt}
      >
        {/* Subtle radial highlight */}
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,.55),transparent_60%)]" />
        
        {/* Product info overlay */}
        <div className="relative z-10 p-6">
          <p className="font-display text-2xl leading-tight text-ink/85">{alt}</p>
          <p className="mt-2 text-[10px] tracking-luxe text-ink/55">Mensah · Atelier</p>
        </div>
      </div>
    );
  }

  // Try API image first, then placeholder
  const imageSrc = abs || placeholder;

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={() => setFailed(true)}
      loading="lazy"
      crossOrigin="anonymous"
      className={`object-cover ${className}`}
    />
  );
}
