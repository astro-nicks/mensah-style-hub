import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Minus, ChevronDown } from "lucide-react";
import { fetchItem, fetchItems } from "@/lib/api";
import { formatCedis } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { ProductImage } from "@/components/ProductImage";

export const Route = createFileRoute("/product/$id")({
  component: Product,
  head: ({ params }) => ({ meta: [{ title: `${params.id} — Mensah Atelier` }] }),
});

const FITS = ["Standard S", "Standard M", "Standard L", "Bespoke"] as const;

function Product() {
  const { id } = Route.useParams();
  const { add } = useCart();
  const { data: item, isLoading } = useQuery({ queryKey: ["item", id], queryFn: () => fetchItem(id) });
  const { data: allItems = [] } = useQuery({ queryKey: ["items"], queryFn: fetchItems });

  const [qty, setQty] = useState(1);
  const [fit, setFit] = useState<typeof FITS[number]>("Standard M");
  const [openCraft, setOpenCraft] = useState(true);
  const [openShip, setOpenShip] = useState(false);

  if (isLoading || !item) {
    return <div className="mx-auto max-w-[1480px] px-8 py-32 text-center text-muted-foreground tracking-luxe text-[10px]">Loading the atelier…</div>;
  }

  const related = allItems.filter((i) => i.id !== item.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1480px] px-8 py-12">
      <p className="text-[10px] tracking-luxe text-muted-foreground">
        <Link to="/" className="link-underline">Home</Link> ·{" "}
        <Link to="/shop" className="link-underline">Shop</Link> · {item.name}
      </p>

      <div className="mt-10 grid md:grid-cols-2 gap-12 lg:gap-20">
        <div className="bg-bone aspect-[4/5] relative overflow-hidden">
          <ProductImage src={item.image_urls?.[0]} alt={item.name} seed={item.id} className="absolute inset-0 h-full w-full" />
        </div>

        <div className="md:pt-6">
          <p className="text-[10px] tracking-luxe text-muted-foreground">Atelier · Mensah Heritage</p>
          <h1 className="font-display text-5xl text-ink mt-4 leading-tight text-balance">{item.name}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {item.description || "A hand-tailored Mensah piece, crafted with master precision."}
          </p>

          <p className="font-display text-3xl text-ink mt-8">{formatCedis(item.price_minor)}</p>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <p className="text-[10px] tracking-luxe text-ink">Select Fitting</p>
              <button className="text-[10px] tracking-luxe text-muted-foreground link-underline">Fit Guide</button>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FITS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFit(f)}
                  className={`py-3 text-[11px] tracking-wide border transition-colors duration-300 ${
                    fit === f ? "bg-ink text-ivory border-ink" : "border-border text-ink hover:border-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {fit === "Bespoke" && (
              <p className="mt-3 text-xs text-muted-foreground italic">
                Bespoke fitting requires an in-person measurement or a digital body scan via our AI Concierge.
              </p>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-ink">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-ink hover:text-ivory transition-colors"><Minus className="h-3 w-3" /></button>
              <span className="px-5 text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-ink hover:text-ivory transition-colors"><Plus className="h-3 w-3" /></button>
            </div>
            <button
              onClick={() => add(item, qty, fit)}
              className="flex-1 bg-ink text-ivory py-4 text-[10px] tracking-luxe hover:bg-accent transition-colors duration-500"
            >
              Add to Basket
            </button>
          </div>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {[
              { open: openCraft, set: setOpenCraft, title: "Craftsmanship", body: "Each piece is tailored by master artisans in Accra and Lagos. Intricate detailing involves hours of hand-finishing using silk threads traditional to West African heritage." },
              { open: openShip, set: setOpenShip, title: "Shipping & Sustainability", body: "Global express shipping within 5–7 business days. Our packaging is 100% plastic-free, using organic cotton dust bags and recycled heritage boxes." },
            ].map((s) => (
              <div key={s.title}>
                <button onClick={() => s.set(!s.open)} className="w-full flex items-center justify-between py-5 text-left">
                  <span className="text-[11px] tracking-luxe text-ink">{s.title}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-500 ${s.open ? "rotate-180" : ""}`} strokeWidth={1.25} />
                </button>
                {s.open && <p className="pb-6 text-sm text-muted-foreground leading-relaxed">{s.body}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-32">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-4xl text-ink">Complete the Look</h2>
            <Link to="/shop" className="text-[10px] tracking-luxe link-underline">View Collection</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => (
              <Link key={r.id} to="/product/$id" params={{ id: r.id }} className="group block">
                <div className="relative aspect-square bg-bone overflow-hidden">
                  <ProductImage src={r.image_urls?.[0]} alt={r.name} seed={r.id} className="absolute inset-0 h-full w-full transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <h4 className="font-display text-lg mt-4">{r.name}</h4>
                <p className="text-sm text-ink/70 mt-1">{formatCedis(r.price_minor)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
