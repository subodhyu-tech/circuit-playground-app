import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
  Pause,
  Sparkles,
} from "lucide-react";
import { getProduct, partsFor } from "@/data/hardware";
import { HardwareViewer } from "@/components/three/HardwareViewer";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/hardware/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — SiliconLab" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} in 3D — Every Part Explained | SiliconLab`;
    const description = `${product.tagline} Explore an interactive 3D ${product.brand} ${product.name} and click each part for a deep explanation.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: HardwareDetail,
});

function HardwareDetail() {
  const { product } = Route.useLoaderData();
  const parts = partsFor(product);
  const [selected, setSelected] = useState<string | null>(parts[0]?.id ?? null);
  const active = parts.find((p) => p.id === selected) ?? parts[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/hardware"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to catalog
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Badge variant="secondary">{product.brand}</Badge>
        <span className="font-mono text-xs text-muted-foreground">{product.generation}</span>
        <span className="font-mono text-xs text-muted-foreground">{product.year}</span>
      </div>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
        {product.name}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{product.tagline}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <HardwareViewer
          kind={product.kind}
          selected={selected}
          onSelect={setSelected}
          className="h-[420px] lg:h-[560px]"
        />

        <div className="flex flex-col gap-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs text-brand-cyan">
              <MousePointerClick className="size-3.5" /> Click a part on the model
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {parts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    active?.id === p.id
                      ? "border-brand-cyan/60 bg-brand-cyan/10 text-brand-cyan"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {active && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-2xl font-semibold">{active.name}</h2>
              <p className="mt-1 text-sm text-brand-violet">{active.role}</p>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {active.detail.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <p className="mt-4 rounded-lg border border-border bg-secondary/40 px-3 py-2 font-mono text-xs text-foreground">
                {active.spec}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">Why it matters</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {product.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-cyan" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">Key specs</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            {product.specs.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0"
              >
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-mono text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
