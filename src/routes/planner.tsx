import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Check, Cpu, Gauge, Wand2, Zap } from "lucide-react";
import type { ModelKind } from "@/data/hardware";
import { byKind, livePriceUrl, metricFor, presets, pricesReviewed } from "@/data/build";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "PC Build Planner — Budget & Performance | SiliconLab" },
      {
        name: "description",
        content:
          "Pick a CPU, GPU, motherboard, RAM kit and SSD, then see the total budget, power draw, compatibility and gaming versus creator performance of your build.",
      },
      { property: "og:title", content: "PC Build Planner — SiliconLab" },
      {
        property: "og:description",
        content: "Assemble a PC part by part and compare budget, wattage and performance instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const SLOTS: { kind: ModelKind; label: string }[] = [
  { kind: "cpu", label: "Processor" },
  { kind: "gpu", label: "Graphics card" },
  { kind: "motherboard", label: "Motherboard" },
  { kind: "ram", label: "Memory" },
  { kind: "ssd", label: "Storage" },
];

type Picks = Record<ModelKind, string | null>;

const empty: Picks = { cpu: null, gpu: null, motherboard: null, ram: null, ssd: null };

function PlannerPage() {
  const [picks, setPicks] = useState<Picks>(empty);

  const summary = useMemo(() => {
    const chosen = SLOTS.map((s) => metricFor(picks[s.kind])).filter(
      (m): m is NonNullable<typeof m> => m !== null,
    );
    const price = chosen.reduce((a, m) => a + m.price, 0);
    const watts = chosen.reduce((a, m) => a + m.watts, 0) + 60; // fans, drives, headroom
    const weight = { cpu: 0.3, gpu: 0.45, motherboard: 0.05, ram: 0.12, ssd: 0.08 } as Record<
      ModelKind,
      number
    >;
    let gaming = 0;
    let creator = 0;
    let filled = 0;
    for (const s of SLOTS) {
      const m = metricFor(picks[s.kind]);
      if (!m) continue;
      filled += weight[s.kind];
      gaming += m.gaming * weight[s.kind];
      creator += m.creator * weight[s.kind];
    }
    return {
      price,
      watts,
      psu: Math.ceil(((watts * 1.4) / 50) * 50) / 1,
      gaming: filled ? Math.round(gaming / filled) : 0,
      creator: filled ? Math.round(creator / filled) : 0,
      complete: SLOTS.every((s) => picks[s.kind]),
    };
  }, [picks]);

  const issues = useMemo(() => {
    const out: string[] = [];
    const cpu = metricFor(picks.cpu);
    const board = metricFor(picks.motherboard);
    if (cpu?.platform === "Apple") {
      out.push("Apple silicon is soldered into its own machine — it cannot be paired with a desktop motherboard, GPU or RAM kit.");
    } else if (cpu?.platform && board?.platform && cpu.platform !== board.platform) {
      out.push(
        `Socket mismatch: your processor uses ${cpu.platform} but the motherboard is ${board.platform}. Pick a board on the same socket.`,
      );
    }
    const gpu = metricFor(picks.gpu);
    if (cpu && gpu && gpu.gaming - cpu.gaming > 20) {
      out.push("The graphics card is far stronger than the processor — expect the CPU to cap frame rates at 1080p.");
    }
    if (cpu && gpu && cpu.gaming - gpu.gaming > 25) {
      out.push("The processor heavily outclasses the graphics card — spending more on the GPU would buy more frames.");
    }
    return out;
  }, [picks]);

  const bar = (value: number, tone: string) => (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div className={`h-full rounded-full ${tone} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-brand-cyan">
          <Wand2 className="size-4" /> Build planner
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Plan your PC, part by part</h1>
        <p className="mt-4 text-muted-foreground">
          Choose a processor, graphics card, motherboard, memory kit and drive. The budget, power
          draw, compatibility and performance balance update as you go.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => setPicks({ ...p.picks })}
            title={p.blurb}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-cyan/60 hover:text-brand-cyan"
          >
            {p.name}
          </button>
        ))}
        <button
          onClick={() => setPicks(empty)}
          className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {SLOTS.map((slot) => {
            const options = byKind(slot.kind);
            return (
              <section key={slot.kind} className="glass-card rounded-2xl p-5">
                <h2 className="font-display text-lg font-semibold">{slot.label}</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {options.map((o) => {
                    const m = metricFor(o.id)!;
                    const active = picks[slot.kind] === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() =>
                          setPicks((prev) => ({ ...prev, [slot.kind]: active ? null : o.id }))
                        }
                        className={`rounded-xl border p-3 text-left transition-colors ${
                          active
                            ? "border-brand-cyan/70 bg-brand-cyan/10"
                            : "border-border hover:border-brand-cyan/40 hover:bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{o.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {o.brand} · {o.year}
                            </p>
                          </div>
                          {active && <Check className="size-4 shrink-0 text-brand-cyan" />}
                        </div>
                        <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                          <span className="text-foreground">${m.price}</span>
                          <span>{m.watts} W</span>
                          <Link
                            to="/hardware/$id"
                            params={{ id: o.id }}
                            className="text-brand-violet hover:underline"
                          >
                            3D view
                          </Link>
                          <a
                            href={livePriceUrl(o.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-brand-emerald hover:underline"
                          >
                            Live price
                          </a>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold">Your build</h2>

            <dl className="mt-4 space-y-2 text-sm">
              {SLOTS.map((s) => {
                const product = byKind(s.kind).find((p) => p.id === picks[s.kind]);
                const m = metricFor(picks[s.kind]);
                return (
                  <div
                    key={s.kind}
                    className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0"
                  >
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="text-right">
                      {product ? (
                        <>
                          <span className="block text-xs">{product.name}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            ${m?.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not chosen</span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-5 flex items-end justify-between">
              <span className="text-sm text-muted-foreground">Estimated total</span>
              <span className="font-display text-3xl font-bold text-brand-cyan">
                ${summary.price.toLocaleString()}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Gauge className="size-3.5" /> Gaming
                  </span>
                  <span className="font-mono">{summary.gaming}</span>
                </div>
                <div className="mt-1.5">{bar(summary.gaming, "bg-brand-cyan")}</div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Cpu className="size-3.5" /> Creation &amp; AI
                  </span>
                  <span className="font-mono">{summary.creator}</span>
                </div>
                <div className="mt-1.5">{bar(summary.creator, "bg-brand-violet")}</div>
              </div>
            </div>

            <p className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 font-mono text-xs">
              <Zap className="size-3.5 text-brand-amber" />
              {summary.watts} W load · {Math.max(450, Math.round((summary.watts * 1.4) / 50) * 50)} W
              PSU suggested
            </p>

            {issues.length > 0 && (
              <ul className="mt-4 space-y-2">
                {issues.map((i) => (
                  <li
                    key={i}
                    className="flex gap-2 rounded-lg border border-brand-amber/40 bg-brand-amber/10 p-3 text-xs text-brand-amber"
                  >
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            )}

            {summary.complete && issues.length === 0 && (
              <p className="mt-4 flex gap-2 rounded-lg border border-brand-emerald/40 bg-brand-emerald/10 p-3 text-xs text-brand-emerald">
                <Check className="mt-0.5 size-3.5 shrink-0" />
                Everything here fits together — balanced parts and matching sockets.
              </p>
            )}

            <p className="mt-4 text-[11px] text-muted-foreground">
              Prices are typical US street prices last reviewed {pricesReviewed} — use the
              "Live price" link on any part to see today's actual retail listings.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
