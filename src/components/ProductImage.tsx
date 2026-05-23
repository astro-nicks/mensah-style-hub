import { useState } from "react";
import { imageUrl } from "@/lib/api";

// Product images from the hackathon API may 404. Show a refined fallback.
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
  
  // Handle CORS issues by adding crossOrigin attribute
  const showFallback = !abs || failed;

  // Deterministic warm gradient per product
  const hash = [...(seed || alt)].reduce((n, c) => n + c.charCodeAt(0), 0);
  const h1 = 30 + (hash % 40);
  const h2 = (h1 + 25) % 360;

  if (showFallback) {
    return (
      <div
        className={`relative flex items-end overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, hsl(${h1} 25% 82%) 0%, hsl(${h2} 18% 62%) 100%)`,
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
      src={abs}
      alt={alt}
      onError={() => setFailed(true)}
      loading="lazy"
      crossOrigin="anonymous"
      className={`object-cover ${className}`}
    />
  );
}
