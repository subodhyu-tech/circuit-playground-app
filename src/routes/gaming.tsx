import { createFileRoute, Link } from "@tanstack/react-router";
import { Gamepad2, Gauge, Monitor, Zap } from "lucide-react";
import { topics } from "@/data/tech";
import { TopicCard } from "@/components/TopicCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/gaming")({
  head: () => ({
    meta: [
      { title: "Gaming Technology — SiliconLab" },
      {
        name: "description",
        content:
          "Frame pacing, upscaling, input lag and build tiers: how gaming hardware turns silicon into smooth frames.",
      },
      { property: "og:title", content: "Gaming Technology — SiliconLab" },
      {
        property: "og:description",
        content: "Understand frame pacing, upscaling, input lag and how to spec a balanced gaming rig.",
      },
    ],
  }),
  component: GamingPage,
});

const pillars = [
  {
    icon: Gauge,
    title: "Frame consistency",
    body: "1% lows and frame-time variance decide whether a game feels smooth, not the average FPS counter.",
    stat: "Target <8 ms variance",
  },
  {
    icon: Zap,
    title: "Input latency",
    body: "Click-to-photon spans engine, queue, driver and panel. Low-latency modes trim the queue depth.",
    stat: "<25 ms competitive",
  },
  {
    icon: Monitor,
    title: "Display pipeline",
    body: "VRR, refresh rate and panel response finish the job your GPU started — or quietly undo it.",
    stat: "240 Hz OLED",
  },
];

const rigs = [
  { name: "Esports 1080p", gpu: "Mid-tier, 8–12GB", cpu: "6–8 fast cores", ram: "32GB DDR5-6000", fps: "240+ FPS" },
  { name: "Sweet spot 1440p", gpu: "Upper-mid, 12–16GB", cpu: "8 cores", ram: "32GB DDR5-6000", fps: "144 FPS high" },
  { name: "Flagship 4K", gpu: "Top tier, 16GB+", cpu: "8–16 cores", ram: "32–64GB", fps: "120 FPS + RT" },
  { name: "Handheld / SFF", gpu: "APU, shared memory", cpu: "8 efficient cores", ram: "16–24GB LPDDR5X", fps: "40–60 FPS" },
];

function GamingPage() {
  const gamingTopics = topics.filter((t) => t.category === "gaming" || t.category === "gpu");

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-brand-violet">
            <Gamepad2 className="size-4" /> Gaming technology
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-6xl">
            Turning silicon into <span className="text-gradient">smooth frames</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Gaming performance is a pipeline problem. Learn where the milliseconds go, what upscaling
            really does, and how to spend a build budget where it counts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/explore/$slug" params={{ slug: "frame-pacing-and-input-lag" }}>
                Start with frame pacing
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/explore/$slug" params={{ slug: "gaming-rig-tiers" }}>
                See build tiers
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="glass rounded-2xl p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-brand-cyan">
                <p.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              <p className="mt-4 font-mono text-xs text-brand-violet">{p.stat}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-bold">Build tiers at a glance</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3">GPU</th>
                <th className="px-5 py-3">CPU</th>
                <th className="px-5 py-3">Memory</th>
                <th className="px-5 py-3">Expect</th>
              </tr>
            </thead>
            <tbody>
              {rigs.map((r) => (
                <tr key={r.name} className="border-t border-border">
                  <td className="px-5 py-4 font-medium">{r.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.gpu}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.cpu}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.ram}</td>
                  <td className="px-5 py-4 font-mono text-brand-cyan">{r.fps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-16 text-2xl font-bold">Lessons for gamers</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gamingTopics.map((t) => (
            <TopicCard key={t.slug} topic={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
