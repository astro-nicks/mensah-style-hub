/**
 * Placeholder image generator for products when API images are unavailable.
 * Uses deterministic mapping so the same product always gets the same image.
 */

const MENSWEAR_IMAGES = [
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop",  // Black suit
  "https://images.unsplash.com/photo-1591047990806-c854b0aeb70a?w=500&h=600&fit=crop",  // Navy suit
  "https://images.unsplash.com/photo-1629008950182-c16663a1974e?w=500&h=600&fit=crop",  // Brown suit
  "https://images.unsplash.com/photo-1564896876-0d1dc1f5d8ae?w=500&h=600&fit=crop",     // Blue shirt
  "https://images.unsplash.com/photo-1608032158040-915481f47140?w=500&h=600&fit=crop",  // White dress shirt
  "https://images.unsplash.com/photo-1576566588028-3a4ee3fa735d?w=500&h=600&fit=crop",  // Blazer
  "https://images.unsplash.com/photo-1615996001375-4fc47bada7e0?w=500&h=600&fit=crop",  // Trousers
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop",    // Tie
  "https://images.unsplash.com/photo-1552062407-291b188d6eec?w=500&h=600&fit=crop",    // Accessories
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&h=600&fit=crop",  // Casual shirt
];

/**
 * Get a deterministic placeholder image for a product ID.
 * Same product ID always returns the same image URL.
 */
export function getPlaceholderImage(productId?: string): string {
  if (!productId) return MENSWEAR_IMAGES[0];
  
  // Use hash of product ID to deterministically pick an image
  const hash = [...productId].reduce((n, c) => n + c.charCodeAt(0), 0);
  const index = hash % MENSWEAR_IMAGES.length;
  return MENSWEAR_IMAGES[index];
}
