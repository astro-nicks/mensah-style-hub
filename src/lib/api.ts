import { API_BASE, MERCHANT_ID, TEAM_SLUG } from "./config";

export type Item = {
  id: string;
  merchant_id: string;
  name: string;
  description?: string;
  price_minor: number;
  currency: string;
  image_urls: string[];
  in_stock: boolean;
};

export type Merchant = {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  brand_colors?: string[];
  whatsapp_number: string;
};

export type Campaign = {
  id: string;
  merchant: Merchant;
  title: string;
  copy_text?: string;
  image_urls?: string[];
  featured_items?: Item[];
  team_slug?: string;
  created_at: number;
};

export type Basket = {
  id: string;
  merchant: Merchant;
  items: Array<Item & { qty: number; item_note?: string }>;
  total_minor: number;
  currency: string;
  customer_name?: string;
  customer_phone?: string;
  customer_note?: string;
};

async function j<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify(await res.json()); } catch {}
    throw new Error(`${res.status} ${res.statusText} ${detail}`);
  }
  return res.json() as Promise<T>;
}

// Convert relative image URLs from API into absolute
// Uses the built-in image proxy (/__image-proxy/) to handle CORS issues
export const imageUrl = (u?: string) => {
  if (!u) return "";
  if (u.startsWith("http")) return u;
  
  // Use internal proxy to avoid CORS issues
  // /__image-proxy/ + API path
  return `/__image-proxy/${u.startsWith("/") ? u.slice(1) : u}`;
};

export const fetchMerchant = () => j<Merchant>(`/merchants/${MERCHANT_ID}`);
export const fetchItems = () => j<Item[]>(`/merchants/${MERCHANT_ID}/items`);
export const fetchItem = (id: string) => j<Item>(`/items/${id}`);
export const fetchCampaigns = () =>
  j<Campaign[]>(`/merchants/${MERCHANT_ID}/campaigns`);

export type BasketLine = { item_id: string; qty: number; item_note?: string };
export const createBasket = (payload: {
  items: BasketLine[];
  customer_name?: string;
  customer_phone?: string;
  customer_note?: string;
}) =>
  j<{ id: string }>(`/baskets`, {
    method: "POST",
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      team_slug: TEAM_SLUG,
      ...payload,
    }),
  });
