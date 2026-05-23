# Mensah Style Hub — Project Context

## Project Overview

**Mensah Style Hub** is a fashion e-commerce storefront built for **Kofi Menswear**, a bespoke West African menswear merchant. It's a frontend application for the Coded Matrix Hackathon that integrates with a shared backend API for WhatsApp-based merchant commerce.

The application showcases tailored excellence rooted in African heritage, combining ancestral craftsmanship with contemporary silhouettes. It allows customers to browse products, build baskets, and send orders directly to the merchant via WhatsApp.

## Tech Stack

- **Framework**: TanStack Start (React-based full-stack framework)
- **Routing**: TanStack Router with file-based routing
- **Data Fetching**: TanStack React Query
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI (unstyled) + custom shadow components
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite
- **Hosting**: Cloudflare (via Wrangler)
- **Package Manager**: Bun
- **Language**: TypeScript
- **Icons**: Lucide React

## Project Structure

```
mensah-style-hub/
├── src/
│   ├── routes/              # File-based route definitions
│   │   ├── __root.tsx       # Root layout wrapper
│   │   ├── index.tsx        # Homepage with hero, featured products, campaigns
│   │   ├── shop.tsx         # Product catalog/shop page
│   │   ├── product.$id.tsx  # Individual product detail page
│   │   ├── cart.tsx         # Shopping basket & WhatsApp order flow
│   │   ├── campaigns.tsx    # Marketing campaigns/lookbooks
│   │   ├── collections.tsx  # Collections listing
│   │   └── concierge.tsx    # Bespoke service/atelier info
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Footer
│   │   ├── ProductCard.tsx  # Reusable product card component
│   │   ├── ProductImage.tsx # Product image with placeholder
│   │   └── ui/              # Radix UI + Tailwind shadow components
│   ├── lib/
│   │   ├── api.ts           # API client & type definitions (Items, Merchants, Baskets, Campaigns)
│   │   ├── config.ts        # Configuration (API_BASE, MERCHANT_ID, TEAM_SLUG, WHATSAPP)
│   │   ├── cart.tsx         # Cart context & state management
│   │   ├── format.ts        # Currency formatting (pesewas -> GHS)
│   │   ├── utils.ts         # Utility functions
│   │   └── error-*.ts       # Error handling & boundary utilities
│   ├── assets/              # Static images (hero, campaigns, craft)
│   ├── router.tsx           # Router configuration
│   ├── start.ts             # TanStack Start client entry point
│   └── server.ts            # SSR error wrapper
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── wrangler.jsonc           # Cloudflare Workers configuration
└── package.json             # Dependencies & scripts
```

## Core Features

### 1. **Homepage (Hero + Featured Products)**
- Eye-catching hero section with animated gradient overlay
- Featured product grid (first 4 items)
- "Complete the Look" section (items 5-8)
- Campaign teaser section
- Atelier/craftsmanship storytelling
- **Route**: `/` (`src/routes/index.tsx`)

### 2. **Shop/Catalog Page**
- Browse all merchant items (Kofi Menswear's 20 products)
- Grid layout (2 cols mobile, 4 cols desktop)
- Loading states with skeleton animation
- Product cards with images, names, prices
- **Route**: `/shop` (`src/routes/shop.tsx`)

### 3. **Product Detail Page**
- Individual product information
- Multiple image gallery support
- Price display in Ghanaian Cedis (GHS)
- Stock status indicator
- Add-to-cart with quantity selector
- **Route**: `/product/$id` (`src/routes/product.$id.tsx`)

### 4. **Shopping Cart**
- Persistent local storage (key: `mensah-cart-v1`)
- Increment/decrement quantities
- Remove items
- Item-level notes (e.g., "Size L")
- Real-time total calculation in pesewas → GHS
- **Cart Context**: `src/lib/cart.tsx` (provides `useCart()` hook)

### 5. **WhatsApp Order Flow**
- Customer enters name, phone, order note
- POST to `/baskets` endpoint with merchant_id, items, team_slug
- Order summary formatted with prices
- Deep-link to WhatsApp (`https://wa.me/<number>?text=<encoded-summary>`)
- Error handling for out-of-stock items (still opens WhatsApp)
- **Merchant WhatsApp**: +233257323509 (fallback)

### 6. **Campaigns Page**
- Marketing campaigns & lookbook pages
- Hybrid: static campaigns (fallback) + API-fetched campaigns
- Campaign cards with images, titles, copy
- Featured items within campaigns
- **Route**: `/campaigns` (`src/routes/campaigns.tsx`)

### 7. **Collections & Concierge**
- Additional brand storytelling pages
- Bespoke service information
- Links to atelier process

## API Integration

**API Base**: `https://api-hackathon.codedematrixtech.com`

### Data Types

```typescript
// Item (Product)
{
  id: string;
  merchant_id: string;
  name: string;
  price_minor: number;      // pesewas (÷100 = GHS)
  currency: "GHS";
  image_urls: string[];     // relative URLs, e.g. "/images/..."
  in_stock: boolean;
}

// Merchant
{
  id: string;
  name: string;
  logo_url?: string;
  brand_colors?: string[];
  whatsapp_number: string;  // +233... format
}

// Basket (Order)
{
  id: string;
  merchant: Merchant;
  items: Array<Item & { qty, item_note? }>;
  total_minor: number;
  currency: "GHS";
  customer_name?: string;
  customer_phone?: string;
  customer_note?: string;
}

// Campaign
{
  id: string;
  merchant: Merchant;
  title: string;
  copy_text?: string;
  image_urls?: string[];
  featured_items?: Item[];
  team_slug?: string;
  created_at: number;
}
```

### Key API Endpoints Used

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/merchants/{id}` | Fetch merchant details |
| GET | `/merchants/{id}/items` | List all items for merchant |
| GET | `/items/{id}` | Get single item |
| POST | `/baskets` | Create order (with merchant_id, items, customer info, team_slug) |
| GET | `/baskets/{id}` | Fetch basket with live prices |
| GET | `/merchants/{id}/campaigns` | Fetch campaigns for merchant |
| POST | `/campaigns` | Create campaign (team_slug tagged) |

### Configuration (`src/lib/config.ts`)

```typescript
export const API_BASE = "https://api-hackathon.codedematrixtech.com";
export const MERCHANT_ID = "kofi-menswear";
export const TEAM_SLUG = "team-astronix";
export const FALLBACK_WHATSAPP = "+233257323509";
```

**Merchant Choices**: `kofi-menswear`, `rashida-tailors`, `amina-stitches`

## Cart State Management

Cart is managed via React Context (`src/lib/cart.tsx`):

```typescript
// CartLine structure
{
  id: string;           // item.id
  name: string;         // item.name
  price_minor: number;  // item.price_minor
  image?: string;       // item.image_urls[0]
  qty: number;
  note?: string;        // e.g., size/color preference
}

// useCart() hook provides:
{
  lines: CartLine[];
  count: number;        // total items
  totalMinor: number;   // total price in pesewas
  add(item, qty?, note?);
  remove(id);
  setQty(id, qty);      // qty ≤ 0 removes
  clear();
}
```

- **Persistence**: `localStorage.setItem("mensah-cart-v1", JSON.stringify(lines))`
- **Lifecycle**: Loads on mount, syncs to localStorage on every change

## Design System & Styling

### Color Palette (Tailwind)

- **Primary**: `ink` (#1a1a1a), `ivory` (#f5f0ed)
- **Accent**: `accent` (gold/warm tone)
- **Neutral**: `bone` (#fafaf0), `muted-foreground`

### Typography

- **Display Font**: Used for headings (serif/elegant)
- **Body Font**: Inter (via Tailwind default)
- **Tracking**: `tracking-luxe` (custom letter-spacing for luxury feel)

### Key Classes

- `animate-zoom-out`: Hero image parallax/zoom animation
- `animate-fade-up`, `animate-fade-up-slow`: Staggered fade-in animations
- `link-underline`: Custom link styling with underline effect
- `hairline`: Thin border separator

## Form Handling & Validation

- **Library**: React Hook Form + Zod
- **Components**: Radix UI + custom shadow components (button, input, textarea, etc.)
- **Cart form**: Customer name, phone, order note
- **Validation**: Zod schema (optional in current implementation; can be stricter)

## Image Handling

- **Local Assets**: Imported directly (`hero-mensah.jpg`, `craft-mensah.jpg`, etc.)
- **API Images**: Relative URLs (`/images/...`, `/uploads/...`)
- **Image Component**: `ProductImage.tsx` with lazy loading & fallback placeholder
- **Absolute URL Helper**: `imageUrl(u)` converts relative → absolute paths

## Development Workflow

### Scripts

```bash
npm run dev              # Start dev server (Vite)
npm run build            # Build for production
npm run build:dev        # Build in dev mode
npm run preview          # Preview production build
npm run lint             # ESLint check
npm run format           # Prettier formatting
```

### Environment & Deployment

- **Build Tool**: Vite with TanStack Start
- **Deploy Target**: Cloudflare Workers (SSR via Wrangler)
- **Config**: `wrangler.jsonc`

## Key Considerations & Gotchas

1. **Prices in Pesewas**: All prices are in pesewas (minor units, like cents). Divide by 100 for GHS display via `formatCedis()`.

2. **Immutable Baskets**: Once created, baskets can't be edited—you must create a new one to change an order.

3. **Image URLs**: API returns relative paths (`/images/...`). Must be prefixed with `API_BASE` when using in `<img src>`.

4. **Out-of-Stock Handling**: If items are out of stock when creating a basket, the API returns 422. The app continues to WhatsApp anyway (graceful degradation).

5. **Cart Persistence**: Uses `localStorage`. Falls back silently if storage unavailable (try/catch blocks).

6. **Team Slug**: Used to tag baskets & campaigns in the shared backend. Multiple teams can share the same merchant. No authentication—data is public within the shared database.

7. **Customer PII**: No real customer data should be committed; only fake names/numbers for demos. All text is stored verbatim—XSS vulnerability risk if another team posts malicious content.

## File-Based Routing (TanStack Router)

Routes are auto-generated from the `src/routes/` directory structure:

- `index.tsx` → `/`
- `shop.tsx` → `/shop`
- `product.$id.tsx` → `/product/:id`
- `cart.tsx` → `/cart`
- `campaigns.tsx` → `/campaigns`
- `collections.tsx` → `/collections`
- `concierge.tsx` → `/concierge`
- `__root.tsx` → Root layout (wraps all routes)

**Generated Route Tree**: `src/routeTree.gen.ts` (auto-updated by Vite plugin)

## Performance & UX

- **Query Caching**: TanStack Query caches API responses with `queryKey: ["items"]`, `["campaigns"]`, etc.
- **Image Optimization**: Lazy loading (`loading="lazy"`), aspect-ratio constraints
- **Animations**: CSS animations for smooth hero parallax, fade-in effects
- **Responsive**: Mobile-first (2-col grid → 4-col on desktop)
- **Error Boundaries**: Custom error page & error capture utilities for SSR safety

## Future Enhancements / Opportunities

1. **Product Filtering**: Sort by price, filter by category/collection
2. **Search**: Product search functionality
3. **Wishlist**: Save favorite items
4. **Team Dashboard**: Admin view of baskets & campaigns (via `/teams/{slug}` endpoint)
5. **Campaign Image Upload**: POST to `/uploads` for campaign images
6. **Variant Selection**: Size/color picker with conditional stock checking
7. **Order Tracking**: Link to WhatsApp message/order confirmation
8. **A/B Testing**: Campaign performance metrics
9. **Analytics**: Track clicks, cart abandonment, conversion funnel
10. **Multi-Language**: Support Twi, Hausa, or other African languages

## Resources

- **OpenAPI Docs**: `/openapi.json` (full schema)
- **Interactive API Docs**: `/docs` (Swagger UI at API base)
- **API Quickstart**: https://api-hackathon.codedematrixtech.com
- **TanStack Start Docs**: https://tanstack.com/start
- **Tailwind CSS**: https://tailwindcss.com
- **Radix UI**: https://radix-ui.com
