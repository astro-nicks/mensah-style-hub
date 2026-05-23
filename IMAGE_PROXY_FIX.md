# Image Proxy Fix — CORS Issue Resolution

## Problem
Images from the Hackathon API were not displaying on the Lovable-published site. The app was falling back to the gradient placeholders because:
1. **CORS (Cross-Origin Resource Sharing) restrictions** — The Hackathon API images were being blocked by the browser when requests came from a different domain (Lovable's domain)
2. **No CORS headers** — The API may not have `Access-Control-Allow-Origin` headers configured for external requests

## Solution
Implemented a **server-side image proxy** that:
1. Intercepts requests to `/__image-proxy/*` on the server
2. Fetches images from the Hackathon API on the server (no CORS issues on server-to-server)
3. Returns the image with proper `Access-Control-Allow-Origin: *` headers
4. Caches aggressively with `Cache-Control: public, max-age=31536000` (1 year)

## Changes Made

### 1. **Server-Side Image Proxy** (`src/server.ts`)
Added `handleImageProxy()` function that:
- Listens for `/__image-proxy/` requests
- Extracts the API path (e.g., `/images/product-1.jpg`)
- Fetches from `https://api-hackathon.codedematrixtech.com/{path}`
- Returns image with CORS-friendly headers
- Includes error handling and logging

```typescript
const API_BASE = "https://api-hackathon.codedematrixtech.com";

async function handleImageProxy(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  
  if (!url.pathname.startsWith("/__image-proxy/")) {
    return null;
  }

  const apiPath = url.pathname.replace("/__image-proxy/", "/");
  
  try {
    const apiUrl = `${API_BASE}${apiPath}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return new Response("Image not found", { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new Response(buffer, {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
        "access-control-allow-origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response("Failed to proxy image", { status: 500 });
  }
}
```

### 2. **Updated Image URL Helper** (`src/lib/api.ts`)
Modified `imageUrl()` to generate proxy URLs:

```typescript
export const imageUrl = (u?: string) => {
  if (!u) return "";
  if (u.startsWith("http")) return u;
  
  // Use internal proxy to avoid CORS issues
  return `/__image-proxy/${u.startsWith("/") ? u.slice(1) : u}`;
};
```

**Before**: `imageUrl("/images/product.jpg")` → `https://api-hackathon.codedematrixtech.com/images/product.jpg` (blocked by CORS)

**After**: `imageUrl("/images/product.jpg")` → `/__image-proxy/images/product.jpg` (proxied by our server)

### 3. **Added CORS Attributes** (`src/components/ProductImage.tsx`)
Added `crossOrigin="anonymous"` to the `<img>` tag for better CORS handling:

```typescript
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
```

## How It Works

1. **User visits site** → Browser renders ProductCard/ProductImage components
2. **imageUrl() is called** with API image path (e.g., `/images/kofi-product-1.jpg`)
3. **URL is transformed** → `/__image-proxy/images/kofi-product-1.jpg`
4. **Browser sends request** to `/__image-proxy/...` (same domain, no CORS issues)
5. **Server receives request** → Extracts API path → Fetches from Hackathon API
6. **Server returns image** with:
   - `Content-Type: image/jpeg` (or detected type)
   - `Access-Control-Allow-Origin: *` (safe for client-side access)
   - `Cache-Control: public, max-age=31536000` (caches for 1 year)
7. **Browser displays image** ✅

## Fallback Behavior
If the proxy fails or image is not found:
- The `ProductImage` component catches the error via `onError`
- Falls back to a beautiful **gradient placeholder** with product name
- Maintains visual consistency and graceful degradation

## Performance Impact
- **Minimal overhead**: Server-side fetch is fast (same network as API)
- **Aggressive caching**: Images cached for 1 year (immutable)
- **No client-side overhead**: Removed any need for client-side CORS workarounds
- **Better for Lovable**: Images now served through the same domain

## Testing
To verify the fix works:
1. Deploy to Lovable
2. Open the site (from Lovable's domain, not localhost)
3. Check Network tab → `/__image-proxy/images/...` requests should return 200
4. Images should display instead of gradient placeholders
5. Check DevTools Console for no CORS errors

## Future Improvements
1. Add image format conversion (WebP, AVIF for better compression)
2. Add image resizing/optimization on the server
3. Add CDN support for even faster delivery
4. Monitor proxy errors and alert on failures
5. Add request rate limiting if needed

## Rollback
To rollback this fix:
1. Revert `src/server.ts` to original (remove `handleImageProxy`)
2. Revert `src/lib/api.ts` `imageUrl()` to direct URL:
   ```typescript
   export const imageUrl = (u?: string) =>
     !u ? "" : u.startsWith("http") ? u : `${API_BASE}${u}`;
   ```
3. Remove `crossOrigin="anonymous"` from `src/components/ProductImage.tsx`
