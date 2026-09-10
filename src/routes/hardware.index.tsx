import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Boxes, Search, Layers3 } from "lucide-react";
import { products, productCategories, kindParts } from "@/data/hardware";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/hardware/")({
  head: () => ({
    meta: [
      { title: "3D Hardware Catalog — Every CPU, GPU & Component | SiliconLab" },
      {
        name: "description",
        content:
          "Browse every CPU, graphics card, motherboard, memory kit and SSD in 3D. Click any part of the model to read exactly what it does.",
      },
      { property: "og:title", content: "3D Hardware Catalog | SiliconLab" },
      {
        property: "og:description",
        content: "Interactive 3D models of real CPUs, GPUs, motherboards, RAM and SSDs — click any component for a deep explanation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HardwareCatalog,
});

function HardwareCatalog() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCat = cat === "all" || p.category === cat;
      const inQuery =
        !q ||
        [p.name, p.brand, p.generation, p.tagline].join(" ").toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [query, cat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-2 text-sm text-brand-cyan">
        <Boxes className="size-4" /> 3D hardware catalog
      </div>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Every chip, card and board — <span className="text-gradient">in 3D</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Pick any model to open its interactive 3D view. Click a part on the model — the die, the
        cache, the VRM, the NAND — and read a proper explanation of what it does and why it matters.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search RTX 5090, Ryzen, DDR5…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")} label="All hardware" />
          {productCategories.map((c) => (
            <FilterChip
              key={c.id}
              active={cat === c.id}
              onClick={() => setCat(c.id)}
              label={c.label}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link
            key={p.id}
            to="/hardware/$id"
            params={{ id: p.id }}
            className="group glass-card rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-brand-cyan/50"
          >
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary">{p.brand}</Badge>
              <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
            </div>
            <h2 className="mt-3 font-display text-xl font-semibold group-hover:text-brand-cyan">
              {p.name}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{p.generation}</p>
            <p className="mt-3 text-sm text-muted-foreground">{p.tagline}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-brand-cyan">
              <Layers3 className="size-3.5" />
              {kindParts[p.kind].length} clickable parts
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          Nothing matches “{query}”. Try a brand, a generation or a model number.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? "border-brand-cyan/60 bg-brand-cyan/10 text-brand-cyan"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
