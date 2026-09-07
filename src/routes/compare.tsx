import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Minus, Scale } from "lucide-react";
import { comparisons } from "@/data/tech";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Hardware Comparisons — SiliconLab" },
      {
        name: "description",
        content:
          "CPU vs GPU, DDR4 vs DDR5, SATA vs NVMe and raster vs ray tracing, compared row by row in plain language.",
      },
      { property: "og:title", content: "Hardware Comparisons — SiliconLab" },
      {
        property: "og:description",
        content: "Row-by-row hardware comparisons that explain the trade-offs, not just the numbers.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const [active, setActive] = useState(comparisons[0]!.id);
  const cmp = comparisons.find((c) => c.id === active) ?? comparisons[0]!;

  const aWins = cmp.rows.filter((r) => r.winner === "a").length;
  const bWins = cmp.rows.filter((r) => r.winner === "b").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-emerald">Compare</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Head-to-head technology</h1>
        <p className="mt-4 text-muted-foreground">
          Specs alone rarely answer &ldquo;which should I pick?&rdquo;. Each row explains the trade-off
          behind the number.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {comparisons.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              c.id === active
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <section className="mt-8 glass overflow-hidden rounded-2xl">
        <div className="border-b border-border p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Scale className="size-5 text-brand-cyan" /> {cmp.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{cmp.blurb}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="font-mono">
              {cmp.a}: {aWins} wins
            </Badge>
            <Badge variant="secondary" className="font-mono">
              {cmp.b}: {bWins} wins
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-[1fr] divide-y divide-border sm:grid-cols-[1.1fr_1.4fr_1.4fr] sm:divide-y-0">
          <div className="hidden bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:block">
            Dimension
          </div>
          <div className="hidden bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-cyan sm:block">
            {cmp.a}
          </div>
          <div className="hidden bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-violet sm:block">
            {cmp.b}
          </div>

          {cmp.rows.map((r) => (
            <div key={r.label} className="contents">
              <div className="border-t border-border px-5 py-4 text-sm font-medium">{r.label}</div>
              <div
                className={`border-t border-border px-5 py-4 text-sm ${
                  r.winner === "a" ? "bg-brand-cyan/10 text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {r.winner === "a" ? (
                    <Check className="size-4 text-brand-cyan" />
                  ) : (
                    <Minus className="size-4 opacity-40" />
                  )}
                  {r.a}
                </span>
              </div>
              <div
                className={`border-t border-border px-5 py-4 text-sm ${
                  r.winner === "b" ? "bg-brand-violet/10 text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {r.winner === "b" ? (
                    <Check className="size-4 text-brand-violet" />
                  ) : (
                    <Minus className="size-4 opacity-40" />
                  )}
                  {r.b}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
