import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { categories, topics, learningPaths, getTopic, type CategoryId } from "@/data/tech";
import { TopicCard } from "@/components/TopicCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ExploreSearch = { q?: string | undefined; category?: CategoryId | "all" | undefined };

export const Route = createFileRoute("/explore/")({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
    category:
      typeof search["category"] === "string" &&
      categories.some((c) => c.id === search["category"])
        ? (search["category"] as CategoryId)
        : "all",
  }),
  head: () => ({
    meta: [
      { title: "Explore Technology Topics — SiliconLab" },
      {
        name: "description",
        content:
          "Search interactive lessons on CPUs, GPUs, motherboards, RAM, storage, networking, gaming hardware and AI silicon.",
      },
      { property: "og:title", content: "Explore Technology Topics — SiliconLab" },
      {
        property: "og:description",
        content: "Searchable, interactive breakdowns of every major PC and chip technology.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const search = Route.useSearch();
  const q = search.q ?? "";
  const category = search.category ?? "all";
  const navigate = useNavigate({ from: "/explore/" });

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return topics.filter((t) => {
      const matchesCat = category === "all" || t.category === category;
      const matchesText =
        !needle ||
        [t.title, t.tagline, t.intro, ...t.tags].join(" ").toLowerCase().includes(needle);
      return matchesCat && matchesText;
    });
  }, [q, category]);

  const set = (next: Partial<ExploreSearch>) =>
    navigate({ search: (prev: ExploreSearch) => ({ ...prev, ...next }), replace: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-cyan">Explorer</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Search the tech library</h1>
        <p className="mt-4 text-muted-foreground">
          {topics.length} interactive lessons across nine hardware and emerging-tech areas. Filter by
          section or search by keyword — try &ldquo;cache&rdquo;, &ldquo;VRAM&rdquo; or &ldquo;latency&rdquo;.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Search topics, tags and concepts..."
            className="h-12 pl-10 text-base"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" /> Sections
          </span>
          <button
            onClick={() => set({ category: "all" })}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              category === "all"
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => set({ category: c.id })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === c.id
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((t) => (
          <TopicCard key={t.slug} topic={t} />
        ))}
      </div>

      {results.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          Nothing matched that search yet. Clear the filters or try a broader keyword.
        </p>
      )}

      <section className="mt-20">
        <h2 className="text-2xl font-bold">Guided learning paths</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Prefer structure? Follow a path end to end.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {learningPaths.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
              <ol className="mt-4 grid gap-2">
                {p.steps.map((slug, i) => {
                  const t = getTopic(slug);
                  if (!t) return null;
                  return (
                    <li key={slug}>
                      <Link
                        to="/explore/$slug"
                        params={{ slug }}
                        className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Badge variant="outline" className="font-mono">
                          {i + 1}
                        </Badge>
                        {t.title}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
