import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart";
import { FALLBACK_WHATSAPP } from "@/lib/config";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/concierge", label: "AI Style Concierge" },
  { to: "/campaigns", label: "Campaigns" },
] as const;

export function Header() {
  const { count } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const stylistHref = `https://wa.me/${FALLBACK_WHATSAPP.replace(/[^\d]/g, "")}?text=${encodeURIComponent("Hello Mensah, I'd like to book a stylist.")}`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-ivory/85 border-b border-border/60">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between px-8 py-5">
        <Link to="/" className="font-display text-3xl tracking-tight text-ink">
          Mensah
        </Link>

        <nav className="hidden lg:flex items-center gap-10 text-[11px] tracking-luxe text-ink/80">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="link-underline"
              data-active={path === n.to || (n.to !== "/" && path.startsWith(n.to))}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <a
            href={stylistHref}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-block border border-ink px-5 py-2.5 text-[10px] tracking-luxe text-ink hover:bg-ink hover:text-ivory transition-colors duration-500"
          >
            Book a Stylist
          </a>
          <Link to="/cart" className="relative text-ink hover:text-accent transition-colors">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-ink text-ivory text-[9px] flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
          <button className="text-ink hover:text-accent transition-colors" aria-label="Account">
            <User className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </header>
  );
}
