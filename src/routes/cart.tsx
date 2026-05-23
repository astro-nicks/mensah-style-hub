import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus, X, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatCedis } from "@/lib/format";
import { createBasket } from "@/lib/api";
import { API_BASE, FALLBACK_WHATSAPP } from "@/lib/config";
import { ProductImage } from "@/components/ProductImage";

export const Route = createFileRoute("/cart")({
  component: Cart,
  head: () => ({ meta: [{ title: "Your Basket — Mensah Atelier" }] }),
});

function Cart() {
  const { lines, totalMinor, setQty, remove, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendToMerchant() {
    if (lines.length === 0) return;
    setSending(true);
    setError(null);

    let basketId: string | undefined;
    try {
      const res = await createBasket({
        items: lines.map((l) => ({ item_id: l.id, qty: l.qty, item_note: l.note })),
        customer_name: name || undefined,
        customer_phone: phone || undefined,
        customer_note: note || undefined,
      });
      basketId = res.id;
    } catch (e) {
      // API often rejects out-of-stock items — we still complete the flow via WhatsApp.
      console.warn("Basket POST failed (continuing with WhatsApp):", e);
      setError("Note: basket couldn't be saved server-side (items out of stock). Opening WhatsApp anyway with your order.");
    }

    const summaryLines = lines.map((l) => `• ${l.name} × ${l.qty}${l.note ? ` (${l.note})` : ""} — ${formatCedis(l.price_minor * l.qty)}`);
    const text = [
      "Hello Mensah Atelier — I'd like to place an order:",
      "",
      ...summaryLines,
      "",
      `Total: ${formatCedis(totalMinor)}`,
      name ? `Name: ${name}` : "",
      phone ? `Phone: ${phone}` : "",
      note ? `Note: ${note}` : "",
      basketId ? `\nBasket: ${API_BASE}/baskets/${basketId}` : "",
    ].filter(Boolean).join("\n");

    const wa = `https://wa.me/${FALLBACK_WHATSAPP.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank");
    setSending(false);
    if (basketId) clear();
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-32 text-center">
        <p className="text-[10px] tracking-luxe text-muted-foreground">Your Basket</p>
        <h1 className="font-display text-5xl text-ink mt-4">An empty atelier.</h1>
        <p className="mt-4 text-muted-foreground">Begin curating your wardrobe with our heritage pieces.</p>
        <Link to="/shop" className="inline-block mt-8 border border-ink px-10 py-4 text-[10px] tracking-luxe hover:bg-ink hover:text-ivory transition-colors duration-500">
          Enter the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-16">
      <p className="text-[10px] tracking-luxe text-muted-foreground">Cart & Checkout</p>
      <h1 className="font-display text-5xl md:text-6xl text-ink mt-4">Your Basket</h1>

      <div className="mt-12 grid lg:grid-cols-[1fr_420px] gap-16">
        {/* LINES */}
        <div className="divide-y divide-border border-t border-b border-border">
          {lines.map((l) => (
            <div key={l.id} className="py-8 flex gap-6">
              <div className="w-28 h-36 bg-bone overflow-hidden flex-shrink-0">
                <ProductImage src={l.image} alt={l.name} seed={l.id} className="h-full w-full" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl text-ink">{l.name}</h3>
                {l.note && <p className="text-xs text-muted-foreground mt-1">Fit: {l.note}</p>}
                <p className="text-sm text-muted-foreground mt-2">Color: Atelier · Crafting Time: 4–6 Weeks</p>
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center border border-ink">
                    <button onClick={() => setQty(l.id, l.qty - 1)} className="p-2 hover:bg-ink hover:text-ivory transition"><Minus className="h-3 w-3" /></button>
                    <span className="px-4 text-sm">{l.qty}</span>
                    <button onClick={() => setQty(l.id, l.qty + 1)} className="p-2 hover:bg-ink hover:text-ivory transition"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => remove(l.id)} className="text-[10px] tracking-luxe text-muted-foreground hover:text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
              <p className="font-display text-xl text-ink whitespace-nowrap">{formatCedis(l.price_minor * l.qty)}</p>
            </div>
          ))}
        </div>

        {/* CHECKOUT */}
        <aside className="bg-bone p-8 h-fit lg:sticky lg:top-28">
          <p className="text-[10px] tracking-luxe text-muted-foreground">Order Summary</p>
          <div className="mt-4 flex justify-between items-baseline">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-display text-3xl text-ink">{formatCedis(totalMinor)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Final fitting and shipping discussed via WhatsApp.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-[10px] tracking-luxe text-ink">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value.slice(0, 80))} className="mt-2 w-full bg-transparent border-b border-ink py-2 text-sm focus:outline-none focus:border-accent" placeholder="Your name" />
            </div>
            <div>
              <label className="text-[10px] tracking-luxe text-ink">WhatsApp</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value.slice(0, 30))} className="mt-2 w-full bg-transparent border-b border-ink py-2 text-sm focus:outline-none focus:border-accent" placeholder="+233…" />
            </div>
            <div>
              <label className="text-[10px] tracking-luxe text-ink">Notes</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 500))} rows={3} className="mt-2 w-full bg-transparent border-b border-ink py-2 text-sm focus:outline-none focus:border-accent resize-none" placeholder="Fit preferences, occasion, deadline…" />
            </div>
          </div>

          <button
            disabled={sending}
            onClick={sendToMerchant}
            className="mt-8 w-full bg-ink text-ivory py-4 text-[10px] tracking-luxe hover:bg-accent transition-colors duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {sending ? "Sending…" : "Send to Mensah on WhatsApp"}
          </button>

          {error && <p className="mt-3 text-xs text-muted-foreground italic">{error}</p>}

          <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-ink">The Personal Touch.</strong> Our Lead
            Tailor will personally reach out via WhatsApp to confirm
            measurements, discuss fabric, and schedule your fitting.
          </p>
        </aside>
      </div>
    </div>
  );
}
