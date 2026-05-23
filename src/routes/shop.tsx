import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchItems } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
  component: Shop,
  head: () => ({
    meta: [
      { title: "Shop — Mensah Atelier" },
      { name: "description", content: "Discover a fusion of West African craftsmanship and contemporary silhouettes." },
    ],
  }),
});

function Shop() {
  const { data: items = [], isLoading } = useQuery({ queryKey: ["items"], queryFn: fetchItems });

  return (
    <div className="mx-auto max-w-[1480px] px-8 py-20">
      <p className="text-[10px] tracking-luxe text-muted-foreground">
        <Link to="/" className="link-underline">Home</Link> · Ready to Wear
      </p>
      <h1 className="font-display text-5xl md:text-7xl text-ink mt-5 text-balance">Tailored Heritage</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
        Discover a fusion of West African craftsmanship and contemporary
        silhouettes. Each piece is hand-tailored to embody the spirit of modern luxury.
      </p>

      <div className="mt-16 flex items-center justify-between hairline pb-5">
        <p className="text-[11px] tracking-luxe text-muted-foreground">
          {isLoading ? "Curating…" : `Showing ${items.length} of ${items.length} designs`}
        </p>
        <p className="text-[11px] tracking-luxe text-muted-foreground">Sort by: Newest</p>
      </div>

      {isLoading ? (
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-bone" />
              <div className="h-4 w-2/3 bg-bone mt-5" />
              <div className="h-3 w-1/3 bg-bone mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {items.map((it) => <ProductCard key={it.id} item={it} tag="Atelier" />)}
        </div>
      )}
    </div>
  );
}
