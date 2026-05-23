import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { fetchItems, type Item } from "@/lib/api";
import { formatCedis } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/concierge")({
  component: Concierge,
  head: () => ({ meta: [{ title: "AI Style Concierge — Mensah" }] }),
});

const OCCASIONS = ["Wedding", "Boardroom", "Evening Gala", "Weekend"] as const;
const SILHOUETTES = [
  { id: "slim", label: "Slim Tailored", desc: "Contoured and modern." },
  { id: "classic", label: "Classic Fit", desc: "Timeless comfort." },
  { id: "relaxed", label: "Relaxed Drape", desc: "Contemporary ease." },
] as const;
const PERSONAS = [
  { id: "minimalist", label: "The Minimalist", desc: "Quiet luxury through monochromatic tones." },
  { id: "heritage", label: "The Heritageist", desc: "Bold patterns celebrating African craftsmanship." },
  { id: "maverick", label: "The Maverick", desc: "Experimental cuts and unexpected details." },
] as const;

function pickRecs(items: Item[], persona: string, occasion: string): Item[] {
  let pool = items;
  if (persona === "heritage") pool = items.filter((i) => /ankara|african|kente|wedding/i.test(i.name + i.description));
  else if (persona === "minimalist") pool = items.filter((i) => /white|black|grey|charcoal|navy|oxford/i.test(i.name + i.description));
  else if (persona === "maverick") pool = items.filter((i) => /blazer|bow|cufflinks|polo|linen/i.test(i.name + i.description));
  if (occasion === "Boardroom") pool = pool.filter((i) => !/polo|shorts|chinos/i.test(i.name)).concat(pool);
  if (pool.length < 3) pool = items;
  const seen = new Set<string>();
  return pool.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true))).slice(0, 3);
}

function Concierge() {
  const { data: items = [] } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
  const { add } = useCart();

  const [occasion, setOccasion] = useState<typeof OCCASIONS[number]>("Boardroom");
  const [silhouette, setSilhouette] = useState<typeof SILHOUETTES[number]["id"]>("slim");
  const [persona, setPersona] = useState<typeof PERSONAS[number]["id"] | null>(null);

  const recs = useMemo(
    () => (persona ? pickRecs(items, persona, occasion) : []),
    [persona, occasion, items],
  );

  return (
    <div className="mx-auto max-w-[1480px] px-8 py-20">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-[10px] tracking-luxe text-accent flex items-center justify-center gap-2">
          <Sparkles className="h-3 w-3" /> Personalized Curation
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-ink mt-5 text-balance">The AI Style Concierge</h1>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          A digital master tailor. Define your intent, and let Mensah's intelligence weave a narrative of style perfectly fitted to your life.
        </p>
      </div>

      {/* Step 1 — Occasion */}
      <section className="mt-24">
        <p className="text-[10px] tracking-luxe text-muted-foreground">Step 01</p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mt-3">Where will you be seen?</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              onClick={() => setOccasion(o)}
              className={`py-6 border text-sm transition-all duration-500 ${
                occasion === o ? "border-ink bg-ink text-ivory" : "border-border hover:border-ink"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </section>

      {/* Step 2 — Silhouette */}
      <section className="mt-20">
        <p className="text-[10px] tracking-luxe text-muted-foreground">Step 02</p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mt-3">Select your preferred silhouette.</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {SILHOUETTES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSilhouette(s.id)}
              className={`p-8 text-left border transition-all duration-500 ${
                silhouette === s.id ? "border-ink bg-bone" : "border-border hover:border-ink"
              }`}
            >
              <p className="font-display text-2xl text-ink">{s.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Step 3 — Persona */}
      <section className="mt-20">
        <p className="text-[10px] tracking-luxe text-muted-foreground">Step 03</p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mt-3">What is your style personality?</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              className={`group p-8 text-left border transition-all duration-500 ${
                persona === p.id ? "border-ink bg-ink text-ivory" : "border-border hover:border-ink"
              }`}
            >
              <p className="font-display text-2xl">{p.label}</p>
              <p className={`mt-2 text-sm ${persona === p.id ? "text-ivory/70" : "text-muted-foreground"}`}>{p.desc}</p>
              <ArrowRight className="h-4 w-4 mt-6 transition-transform group-hover:translate-x-1" strokeWidth={1.25} />
            </button>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      {persona && recs.length > 0 && (
        <section className="mt-24 animate-fade-up">
          <div className="text-center">
            <p className="text-[10px] tracking-luxe text-accent flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" /> Curated for You
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-ink mt-4">Tailoring your recommendations</h2>
            <p className="mt-3 text-muted-foreground text-sm">
              Based on your preference for <em>{PERSONAS.find(p => p.id === persona)?.label}</em> at a <em>{occasion}</em> occasion.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {recs.map((r, idx) => (
              <div key={r.id} className="group">
                <div className="relative aspect-[3/4] bg-bone overflow-hidden">
                  <ProductImage src={r.image_urls?.[0]} alt={r.name} seed={r.id} className="absolute inset-0 h-full w-full transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <p className="text-[10px] tracking-luxe text-muted-foreground mt-5">Selection {String(idx + 1).padStart(2, "0")}</p>
                <h3 className="font-display text-2xl mt-2">{r.name}</h3>
                <p className="text-ink/80 mt-1">{formatCedis(r.price_minor)}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => { recs.forEach((r) => add(r)); }}
              className="inline-block bg-ink text-ivory px-12 py-4 text-[10px] tracking-luxe hover:bg-accent transition-colors duration-500"
            >
              Build Basket
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Added to your basket — <Link to="/cart" className="link-underline">review and send to Mensah →</Link>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
