export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-bone">
      <div className="mx-auto max-w-[1480px] px-8 py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-4xl text-ink">Mensah</p>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Tailored excellence rooted in Africa. A house of bespoke menswear
            built between Accra and Lagos.
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-luxe text-ink/60">The House</p>
          <ul className="mt-5 space-y-3 text-sm text-ink/80">
            <li>Atelier</li><li>Heritage</li><li>Journal</li><li>Press</li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-luxe text-ink/60">Care</p>
          <ul className="mt-5 space-y-3 text-sm text-ink/80">
            <li>Bespoke Service</li><li>Shipping</li><li>Returns</li><li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-[1480px] px-8 py-6 flex justify-between text-[10px] tracking-luxe text-ink/55">
          <span>© Mensah Atelier · {new Date().getFullYear()}</span>
          <span>Tailored in Africa</span>
        </div>
      </div>
    </footer>
  );
}
