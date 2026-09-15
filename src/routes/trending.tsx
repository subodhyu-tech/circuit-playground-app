import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, MessageSquare, Radio, RefreshCw, TrendingUp } from "lucide-react";
import { categories, categoryById, trending } from "@/data/tech";
import { getLiveTechFeed } from "@/lib/newsfeed.functions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/trending")({
  head: () => ({
    meta: [
      { title: "Trending & New Technology — SiliconLab" },
      {
        name: "description",
        content:
          "A curated feed of new silicon, benchmarks and rumours across CPUs, GPUs, memory, networking and AI hardware.",
      },
      { property: "og:title", content: "Trending & New Technology — SiliconLab" },
      {
        property: "og:description",
        content: "Curated updates on chips, GPUs, memory, networking and AI hardware.",
      },
    ],
  }),
  component: TrendingPage,
});

const tagStyle: Record<string, string> = {
  New: "bg-brand-cyan/15 text-brand-cyan",
  Rumour: "bg-brand-amber/15 text-brand-amber",
  "Deep dive": "bg-brand-violet/15 text-brand-violet",
  Benchmark: "bg-brand-emerald/15 text-brand-emerald",
};

function TrendingPage() {
  const [filter, setFilter] = useState<string>("all");
  const items = trending.filter((t) => filter === "all" || t.category === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-brand-amber">
          <Radio className="size-4" /> Live-ready feed
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Trending &amp; new technology</h1>
        <p className="mt-4 text-muted-foreground">
          A live stream of hardware, chip and AI news, refreshed automatically, plus our curated
          explainers underneath.
        </p>
      </header>

      <LiveFeed />

      <h2 className="mt-16 font-display text-2xl font-semibold">Curated explainers</h2>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            filter === "all"
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Everything
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              filter === c.id
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="group grid gap-4 rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:bg-card sm:grid-cols-[140px_1fr]"
          >
            <div className="flex flex-col gap-2">
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${tagStyle[item.tag]}`}
              >
                {item.tag}
              </span>
              <time className="font-mono text-xs text-muted-foreground">{item.date}</time>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
              <Link
                to="/explore"
                search={{ category: item.category, q: "" }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-cyan hover:underline"
              >
                <TrendingUp className="size-4" /> Learn the fundamentals in{" "}
                {categoryById(item.category).name}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-14 text-center text-muted-foreground">
          No updates in this section yet — check back soon.
        </p>
      )}
    </div>
  );
}
