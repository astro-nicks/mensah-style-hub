import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowDown } from "lucide-react";
import heroImg from "@/assets/hero-mensah.jpg";
import craftImg from "@/assets/craft-mensah.jpg";
import campaign1 from "@/assets/campaign-1.jpg";
import campaign2 from "@/assets/campaign-2.jpg";
import { fetchItems } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { formatCedis } from "@/lib/format";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Mensah — Tailored Excellence, Rooted in Africa" },
      { name: "description", content: "Bespoke West African menswear. Experience the intersection of ancestral craftsmanship and contemporary silhouettes." },
      { property: "og:image", content: heroImg },
    ],
  }),
});

function Home() {
  const { data: items = [] } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
  const featured = items.slice(0, 4);
  const completeTheLook = items.slice(4, 8);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[640px] overflow-hidden bg-ink">
        <img
          src={heroImg}
          alt="Tailored excellence"
          width={1920} height={1080}
          className="absolute inset-0 h-full w-full object-cover animate-zoom-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-ivory text-center px-6">
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] text-balance animate-fade-up">
            Tailored Excellence,
            <br />
            <em className="font-light">Rooted in Africa</em>
          </h1>
          <p className="mt-7 max-w-xl text-sm md:text-base text-ivory/85 leading-relaxed animate-fade-up-slow">
            Experience the intersection of ancestral craftsmanship and
            contemporary silhouettes. Designed for the modern visionary.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-fade-up-slow">
            <Link
              to="/shop"
              className="bg-ivory text-ink px-10 py-4 text-[10px] tracking-luxe hover:bg-accent hover:text-ivory transition-colors duration-500"
            >
              Explore SS24
            </Link>
            <Link
              to="/campaigns"
              className="border border-ivory/70 text-ivory px-10 py-4 text-[10px] tracking-luxe hover:bg-ivory hover:text-ink transition-colors duration-500"
            >
              View Lookbook
            </Link>
          </div>
          <ArrowDown className="absolute bottom-10 h-5 w-5 text-ivory/70 animate-bounce" strokeWidth={1} />
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-[1480px] px-8 py-28">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[10px] tracking-luxe text-muted-foreground">The Collections</p>
            <h2 className="font-display text-4xl md:text-6xl text-ink mt-3 max-w-2xl text-balance">
              Ancestral Weave <em>&</em> Modern Drape
            </h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-[10px] tracking-luxe link-underline">
            View All Collections <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { img: campaign1, tag: "Signature Series", title: "The Sovereign Collection", desc: "Reimagining ceremonial West African silhouettes through a lens of minimalist architectural precision." },
            { img: craftImg, tag: "Craftsmanship", title: "Textural Narratives", desc: "A study in hand-woven wool and silk blends, celebrating the tactile heritage of our artisans." },
          ].map((c) => (
            <article key={c.title} className="group relative overflow-hidden bg-bone aspect-[4/5]">
              <img src={c.img} alt={c.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10 text-ivory">
                <p className="text-[10px] tracking-luxe text-ivory/70">{c.tag}</p>
                <h3 className="font-display text-3xl md:text-4xl mt-2">{c.title}</h3>
                <p className="mt-3 max-w-md text-sm text-ivory/80 leading-relaxed">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="bg-bone py-28">
          <div className="mx-auto max-w-[1480px] px-8">
            <div className="text-center mb-14">
              <p className="text-[10px] tracking-luxe text-muted-foreground">Ready to Wear</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink mt-3">Tailored Heritage</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
              {featured.map((it) => <ProductCard key={it.id} item={it} tag="Atelier Series" />)}
            </div>
            <div className="text-center mt-16">
              <Link to="/shop" className="inline-block border border-ink px-10 py-4 text-[10px] tracking-luxe hover:bg-ink hover:text-ivory transition-colors duration-500">
                Discover All Designs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* COMPLETE THE LOOK */}
      {completeTheLook.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-8 py-28">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-ink">Complete the Look</h2>
            <Link to="/shop" className="text-[10px] tracking-luxe link-underline">View Collection</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {completeTheLook.map((it) => (
              <Link key={it.id} to="/product/$id" params={{ id: it.id }} className="group block">
                <div className="relative aspect-square overflow-hidden bg-bone">
                  <ProductImage src={it.image_urls?.[0]} alt={it.name} seed={it.id} className="absolute inset-0 h-full w-full transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-ink/80 to-transparent">
                    <p className="text-ivory text-[10px] tracking-luxe">Quick Add — {formatCedis(it.price_minor)}</p>
                  </div>
                </div>
                <h4 className="font-display text-lg mt-4">{it.name}</h4>
                <p className="text-[11px] text-muted-foreground mt-1">Atelier Edition</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CAMPAIGNS TEASER */}
      <section className="bg-ink text-ivory py-32">
        <div className="mx-auto max-w-[1480px] px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[10px] tracking-luxe text-ivory/60">The Heritage Collection</p>
            <h2 className="font-display text-5xl md:text-6xl mt-4 leading-[1.05] text-balance">
              The Architecture of Identity.
            </h2>
            <p className="mt-6 text-ivory/75 leading-relaxed max-w-lg">
              A narrative woven into the very fabric of our being. Mensah's
              latest campaign explores the intersection of West African textile
              traditions and the precision of modern architectural tailoring.
            </p>
            <Link to="/campaigns" className="inline-flex mt-8 items-center gap-2 border border-ivory/40 px-8 py-4 text-[10px] tracking-luxe hover:bg-ivory hover:text-ink transition-colors duration-500">
              Explore the Campaign <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={campaign2} alt="" className="aspect-[3/4] object-cover" loading="lazy" />
            <img src={campaign1} alt="" className="aspect-[3/4] object-cover mt-12" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ATELIER */}
      <section className="mx-auto max-w-[1480px] px-8 py-32 grid md:grid-cols-2 gap-16 items-center">
        <img src={craftImg} alt="Mastering the grain" className="aspect-[4/5] object-cover" loading="lazy" />
        <div>
          <p className="text-[10px] tracking-luxe text-muted-foreground">The Atelier</p>
          <h2 className="font-display text-5xl text-ink mt-4 leading-tight text-balance">Mastering the Grain</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Mensah's commitment to quality begins before the first cut. We work
            directly with weavers in Accra and Lagos to develop proprietary
            weaves that incorporate traditional motifs in contemporary weights.
            Every garment carries a piece of history.
          </p>
          <Link to="/concierge" className="inline-flex mt-8 items-center gap-2 link-underline text-[10px] tracking-luxe">
            Discover Our Process <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
