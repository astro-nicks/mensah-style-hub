import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/collections")({
  component: () => (
    <div className="mx-auto max-w-[1480px] px-8 py-20">
      <p className="text-[10px] tracking-luxe text-muted-foreground">The Collections</p>
      <h1 className="font-display text-5xl md:text-7xl text-ink mt-5 text-balance">Curated by Season</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
        Browse the full ready-to-wear archive — every silhouette, every fabric.
      </p>
      <div className="mt-10">
        <Link to="/shop" className="inline-block border border-ink px-8 py-4 text-[10px] tracking-luxe hover:bg-ink hover:text-ivory transition-colors duration-500">
          Enter the Shop
        </Link>
      </div>
    </div>
  ),
  head: () => ({ meta: [{ title: "Collections — Mensah Atelier" }] }),
});
