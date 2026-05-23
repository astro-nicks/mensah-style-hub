import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-[10px] tracking-luxe text-muted-foreground">404</p>
        <h1 className="font-display text-5xl text-ink mt-3">Off the cutting table.</h1>
        <p className="mt-4 text-sm text-muted-foreground">This piece doesn't exist in our atelier.</p>
        <div className="mt-8">
          <Link to="/" className="inline-block border border-ink px-6 py-3 text-[10px] tracking-luxe hover:bg-ink hover:text-ivory transition-colors duration-500">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-ink">A loose thread.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Something didn't load. Try again.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-block border border-ink px-6 py-3 text-[10px] tracking-luxe hover:bg-ink hover:text-ivory transition-colors duration-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mensah — Tailored Excellence, Rooted in Africa" },
      { name: "description", content: "Bespoke West African menswear. Suits, Kaftans shirts, and trousers hand-tailored in Accra and Lagos." },
      { property: "og:title", content: "Mensah — Tailored Excellence, Rooted in Africa" },
      { property: "og:description", content: "Bespoke West African menswear. Suits, Kaftans shirts, and trousers hand-tailored in Accra and Lagos." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Mensah — Tailored Excellence, Rooted in Africa" },
      { name: "twitter:description", content: "Bespoke West African menswear. Suits, Kaftans shirts, and trousers hand-tailored in Accra and Lagos." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eedf441e-ceaf-4514-9727-4ed4a4472fc1/id-preview-03c20bcc--fcaf209e-036c-47dc-bcc6-6ed28b403b68.lovable.app-1779557300442.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eedf441e-ceaf-4514-9727-4ed4a4472fc1/id-preview-03c20bcc--fcaf209e-036c-47dc-bcc6-6ed28b403b68.lovable.app-1779557300442.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1"><Outlet /></main>
          <Footer />
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}
