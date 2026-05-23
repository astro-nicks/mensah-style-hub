import { imageUrl } from "@/lib/api";

// Display only images from the API. No fallbacks, no gradients.
export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const abs = imageUrl(src);

  if (!abs) {
    return <div className={`bg-gray-200 ${className}`} />;
  }

  return (
    <img
      src={abs}
      alt={alt}
      loading="lazy"
      crossOrigin="anonymous"
      className={`object-cover ${className}`}
    />
  );
}
