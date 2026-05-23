import { Link } from "@tanstack/react-router";
import type { Item } from "@/lib/api";
import { formatCedis } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";

export function ProductCard({ item, tag }: { item: Item; tag?: string }) {
  const { add } = useCart();
  return (
    <div className="group">
      <Link to="/product/$id" params={{ id: item.id }} className="block relative overflow-hidden bg-bone aspect-[4/5]">
        <ProductImage
          src={item.image_urls?.[0]}
          alt={item.name}
          seed={item.id}
          className="absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <button
          onClick={(e) => { e.preventDefault(); add(item); }}
          className="absolute bottom-4 left-4 right-4 py-3 bg-ivory/95 text-ink text-[10px] tracking-luxe opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
        >
          Add to Basket
        </button>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          {tag && <p className="text-[10px] tracking-luxe text-muted-foreground mb-1.5">{tag}</p>}
          <Link to="/product/$id" params={{ id: item.id }} className="font-display text-xl leading-snug text-ink hover:text-accent transition-colors">
            {item.name}
          </Link>
        </div>
        <span className="font-display text-lg text-ink whitespace-nowrap">{formatCedis(item.price_minor)}</span>
      </div>
    </div>
  );
}
