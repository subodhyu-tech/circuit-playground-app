import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Cpu,
  MonitorPlay,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Network,
  Gamepad2,
  Sparkles,
  Search,
  Scale,
  Radio,
} from "lucide-react";
import { Hero3D } from "@/components/three/Hero3D";
import { TopicCard } from "@/components/TopicCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories, topics, trending } from "@/data/tech";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SiliconLab — Learn Chips, PC Hardware & Emerging Tech" },
      {
        name: "description",
        content:
          "An interactive 3D playground for learning CPUs, GPUs, motherboards, RAM, storage, networking, gaming hardware and AI silicon.",
      },
      { property: "og:title", content: "SiliconLab — Learn Chips, PC Hardware & Emerging Tech" },
      {
        property: "og:description",
        content:
          "Explore an interactive chip, search technology topics and compare hardware side by side.",
      },
    ],
  }),
  component: Home,
});

const iconMap = {
  Cpu,
  MonitorPlay,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Network,
  Gamepad2,
  Sparkles,
} as const;

const accentText: Record<string, string> = {
  cyan: "text-brand-cyan",
  violet: "text-brand-violet",
  emerald: "text-brand-emerald",
  amber: "text-brand-amber",
};

function Home() {
  const featured = topics.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-70" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-24 lg:pt-20">
          <div>
            <Badge variant="outline" className="font-mono text-[11px] uppercase tracking-[0.2em]">
              Interactive hardware lab
            </Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">
              Understand the <span className="text-gradient">silicon</span> behind everything you use
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Spin the chip, open a component, and learn how CPUs, GPUs, memory, storage, networks and
              AI accelerators actually work — built for students and tech enthusiasts alike.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/explore">
                  <Search className="size-4" /> Explore topics
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/assistant">
                  <Sparkles className="size-4" /> Ask the AI tutor
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { k: `${topics.length}`, v: "Lessons" },
                { k: `${categories.length}`, v: "Sections" },
                { k: "40+", v: "Component breakdowns" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-bold text-brand-cyan">{s.k}</dt>
                  <dd className="text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[var(--gradient-glow)]" />
            <Hero3D className="h-[380px] w-full overflow-hidden rounded-3xl border border-border sm:h-[460px] lg:h-[560px]" />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Move your pointer across the board to steer the view.
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Nine ways in</h2>
            <p className="mt-2 text-muted-foreground">
              Every section mixes plain-language explanation with real specs.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/explore">
              Browse everything <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = iconMap[c.icon as keyof typeof iconMap];
            return (
              <Link
                key={c.id}
                to="/explore"
                search={{ category: c.id, q: "" }}
                className="group rounded-2xl border border-border bg-card/50 p-5 transition-all hover:-translate-y-1 hover:bg-card"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-secondary">
                  <Icon className={`size-5 ${accentText[c.accent]}`} />
                </span>
                <h3 className="mt-4 font-semibold">{c.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.blurb}</p>
              </Link>
            );
          })}
          <Link
            to="/compare"
            className="group rounded-2xl border border-dashed border-border bg-transparent p-5 transition-all hover:-translate-y-1 hover:bg-card/60"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-secondary">
              <Scale className="size-5 text-brand-cyan" />
            </span>
            <h3 className="mt-4 font-semibold">Comparisons</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              CPU vs GPU, DDR4 vs DDR5, raster vs ray tracing.
            </p>
          </Link>
        </div>
      </section>

      {/* Featured lessons */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Start with these</h2>
          <p className="mt-2 text-muted-foreground">
            Hand-picked lessons that unlock most of the rest.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <TopicCard key={t.slug} topic={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending strip */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-brand-amber">
              <Radio className="size-4" /> Fresh
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">What's moving right now</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/trending">
              Full feed <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {trending.slice(0, 3).map((t) => (
            <div key={t.id} className="glass rounded-2xl p-6">
              <Badge variant="secondary" className="font-mono text-[11px]">
                {t.tag}
              </Badge>
              <h3 className="mt-3 text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-violet/15 via-card to-brand-cyan/12 p-10 text-center">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">Stuck on a concept?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              The AI tutor explains any topic at the level you choose — from &ldquo;explain it like I'm
              12&rdquo; to datasheet detail.
            </p>
            <Button asChild size="lg" className="mt-7">
              <Link to="/assistant">
                <Sparkles className="size-4" /> Open the AI tutor
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
