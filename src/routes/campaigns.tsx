import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCampaigns } from "@/lib/api";
import { ProductImage } from "@/components/ProductImage";
import campaign1 from "@/assets/campaign-1.jpg";
import campaign2 from "@/assets/campaign-2.jpg";
import craftImg from "@/assets/craft-mensah.jpg";

export const Route = createFileRoute("/campaigns")({
  component: Campaigns,
  head: () => ({
    meta: [
      { title: "Campaigns — Mensah Atelier" },
      { name: "description", content: "The Architecture of Identity — Mensah's latest campaigns." },
      { property: "og:image", content: campaign1 },
    ],
  }),
});

const STATIC_CAMPAIGNS = [
  { id: "lagos", title: "Lagos: The New Renaissance", copy: "Exploring the heartbeat of contemporary Nigerian tailoring and urban spirit.", image: campaign1, tag: "Campaign 01" },
  { id: "artisan", title: "The Artisan's Breath", copy: "A visual tribute to the hands that weave the future of heritage fashion.", image: craftImg, tag: "Campaign 02" },
  { id: "heritage", title: "Architecture of Identity", copy: "Where West African textile traditions meet architectural tailoring.", image: campaign2, tag: "Campaign 03" },
];

function Campaigns() {
  const { data: apiCampaigns = [] } = useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
    retry: false,
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden bg-ink">
        <img src={campaign1} alt="" className="absolute inset-0 h-full w-full object-cover animate-zoom-out opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end px-8 pb-20 max-w-[1480px] mx-auto">
          <p className="text-[10px] tracking-luxe text-ivory/70 animate-fade-up">The Heritage Collection</p>
          <h1 className="font-display text-5xl md:text-7xl text-ivory mt-4 max-w-3xl text-balance animate-fade-up">
            The Architecture of Identity.
          </h1>
          <p className="mt-5 max-w-xl text-ivory/80 animate-fade-up-slow">
            A narrative woven into the very fabric of our being. Mensah's latest
            campaign explores the intersection of West African textile traditions
            and the precision of modern architectural tailoring.
          </p>
        </div>
      </section>

      {/* QUOTE */}
      <section className="mx-auto max-w-4xl px-8 py-28 text-center">
        <p className="text-[10px] tracking-luxe text-accent">✦ Atelier Notes</p>
        <blockquote className="font-display text-3xl md:text-4xl text-ink mt-6 leading-snug italic text-balance">
          "Tailoring is the silent language of a man's journey, spoken in the drape of wool and the crispness of linen."
        </blockquote>
        <p className="mt-8 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          In this collection, we return to the source. Every stitch in a Mensah
          garment is a dialogue between the artisan and the wearer.
        </p>
      </section>

      {/* CAMPAIGNS LIST */}
      <section className="bg-bone py-24">
        <div className="mx-auto max-w-[1480px] px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] tracking-luxe text-muted-foreground">Curated Essentials</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink mt-3">Active Campaigns</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STATIC_CAMPAIGNS.map((c) => (
              <article key={c.id} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-bone">
                  <img src={c.image} alt={c.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                </div>
                <p className="text-[10px] tracking-luxe text-muted-foreground mt-5">{c.tag}</p>
                <h3 className="font-display text-2xl text-ink mt-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.copy}</p>
              </article>
            ))}
          </div>

          {apiCampaigns.length > 0 && (
            <div className="mt-20">
              <p className="text-[10px] tracking-luxe text-muted-foreground">Live from the Atelier</p>
              <h3 className="font-display text-3xl text-ink mt-2 mb-10">From the API</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {apiCampaigns.map((c) => (
                  <article key={c.id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-bone">
                      <ProductImage src={c.image_urls?.[0]} alt={c.title} seed={c.id} className="absolute inset-0 h-full w-full transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <p className="text-[10px] tracking-luxe text-muted-foreground mt-5">Campaign</p>
                    <h4 className="font-display text-2xl text-ink mt-2">{c.title}</h4>
                    {c.copy_text && <p className="text-sm text-muted-foreground mt-2">{c.copy_text}</p>}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="text-center py-28 px-8">
        <h2 className="font-display text-4xl md:text-5xl text-ink text-balance">Tailored in Africa.</h2>
        <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
          Each recommendation is more than just a garment; it's a piece of our heritage.
        </p>
        <Link to="/shop" className="inline-block mt-8 border border-ink px-10 py-4 text-[10px] tracking-luxe hover:bg-ink hover:text-ivory transition-colors duration-500">
          Discover Our Heritage
        </Link>
      </section>
    </div>
  );
}
