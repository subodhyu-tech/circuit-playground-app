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

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function LiveFeed() {
  const fetchFeed = useServerFn(getLiveTechFeed);
  const { data, isLoading, isFetching, refetch, isError } = useQuery({
    queryKey: ["live-tech-feed"],
    queryFn: () => fetchFeed(),
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000,
  });

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-emerald/70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-brand-emerald" />
          </span>
          Live feed
        </h2>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
            Auto-updates every 5 min · Hacker News + DEV Community
          </span>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
            {data ? `Updated ${timeAgo(data.fetchedAt)}` : "Refresh"}
          </button>
        </div>
      </div>

      {isError && (
        <p className="mt-6 text-sm text-muted-foreground">
          The live feed is unreachable right now — curated updates are still below.
        </p>
      )}

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-card/40" />
          ))}

        {data?.stories.map((s) => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-border bg-card/50 p-4 transition-colors hover:border-brand-cyan/50 hover:bg-card"
          >
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="rounded-full bg-brand-cyan/15 px-2 py-0.5 font-medium text-brand-cyan">
                {s.topic}
              </span>
              <span className="font-mono">{s.source}</span>
              <span className="rounded-full border border-border px-1.5 py-px text-[10px]">{s.via}</span>
              <span>·</span>
              <time>{timeAgo(s.publishedAt)}</time>
            </div>
            <h3 className="mt-2 text-sm font-semibold leading-snug group-hover:text-brand-cyan">
              {s.title}
            </h3>
            <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="size-3" /> {s.points}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="size-3" /> {s.comments}
              </span>
              <span className="inline-flex items-center gap-1">
                <ExternalLink className="size-3" /> Read
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
