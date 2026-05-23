import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Item } from "./api";

export type CartLine = {
  id: string;
  name: string;
  price_minor: number;
  image?: string;
  qty: number;
  note?: string;
};

type Ctx = {
  lines: CartLine[];
  count: number;
  totalMinor: number;
  add: (item: Item, qty?: number, note?: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "mensah-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const add = useCallback((item: Item, qty = 1, note?: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.id === item.id ? { ...l, qty: l.qty + qty, note: note ?? l.note } : l,
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price_minor: item.price_minor,
          image: item.image_urls?.[0],
          qty,
          note,
        },
      ];
    });
  }, []);

  const remove = useCallback(
    (id: string) => setLines((p) => p.filter((l) => l.id !== id)),
    [],
  );
  const setQty = useCallback((id: string, qty: number) => {
    setLines((p) =>
      qty <= 0
        ? p.filter((l) => l.id !== id)
        : p.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Ctx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const totalMinor = lines.reduce((n, l) => n + l.qty * l.price_minor, 0);
    return { lines, count, totalMinor, add, remove, setQty, clear };
  }, [lines, add, remove, setQty, clear]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
