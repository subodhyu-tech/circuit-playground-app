import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Wallet } from "lucide-react";
import type { ModelKind } from "@/data/hardware";
import { getProduct } from "@/data/hardware";
import { byKind, metricFor, presets } from "@/data/build";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Budget Tracker — Log Your PC Builds | SiliconLab" },
      {
        name: "description",
        content:
          "Log what you actually paid for your PC builds and compare the cost against SiliconLab's planner preset builds.",
      },
      { property: "og:title", content: "PC Budget Tracker — SiliconLab" },
      {
        property: "og:description",
        content: "Track your own builds and see how they stack up against preset builds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackerPage,
});

const SLOTS: { kind: ModelKind; label: string }[] = [
  { kind: "cpu", label: "Processor" },
  { kind: "gpu", label: "Graphics card" },
  { kind: "motherboard", label: "Motherboard" },
  { kind: "ram", label: "Memory" },
  { kind: "ssd", label: "Storage" },
];

type Build = {
  id: string;
  name: string;
  picks: Record<ModelKind, string>;
  paid: Record<ModelKind, number>;
  createdAt: number;
};

const KEY = "siliconlab.builds.v1";

const presetTotal = (picks: Record<ModelKind, string>) =>
  SLOTS.reduce((a, s) => a + (metricFor(picks[s.kind])?.price ?? 0), 0);

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function blankForm() {
  const picks = {} as Record<ModelKind, string>;
  const paid = {} as Record<ModelKind, number>;
  for (const s of SLOTS) {
    const first = byKind(s.kind)[0];
    picks[s.kind] = first?.id ?? "";
    paid[s.kind] = metricFor(first?.id ?? null)?.price ?? 0;
  }
  return { name: "", picks, paid };
}

function TrackerPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [compareTo, setCompareTo] = useState(presets[1]?.id ?? "");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setBuilds(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(builds));
  }, [builds, loaded]);

  const formTotal = SLOTS.reduce((a, s) => a + (Number(form.paid[s.kind]) || 0), 0);
  const preset = presets.find((p) => p.id === compareTo) ?? presets[0];
  const presetSum = preset ? presetTotal(preset.picks) : 0;

  const save = () => {
    const b: Build = {
      id: crypto.randomUUID(),
      name: form.name.trim() || `My build #${builds.length + 1}`,
      picks: form.picks,
      paid: form.paid,
      createdAt: Date.now(),
    };
    setBuilds((prev) => [b, ...prev]);
    setForm(blankForm());
  };

  const totals = useMemo(
    () =>
      builds.map((b) => ({
        b,
        total: SLOTS.reduce((a, s) => a + (Number(b.paid[s.kind]) || 0), 0),
        street: presetTotal(b.picks),
      })),
    [builds],
  );
  const maxBar = Math.max(presetSum, ...totals.map((t) => t.total), 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2 text-xs font-medium text-brand-cyan">
        <Wallet className="size-4" /> Budget tracker
      </div>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Log your builds. See how they stack up.
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Record what you actually paid for each part and compare against street prices and the
        Build Planner presets. Saved in this browser.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">Add a build</h2>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Build name (e.g. Living-room rig)"
            className="mt-4 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand-cyan/60"
          />
          <div className="mt-4 space-y-3">
            {SLOTS.map((s) => (
              <div key={s.kind} className="grid grid-cols-[1fr_110px] gap-2">
                <label className="text-xs text-muted-foreground">
                  {s.label}
                  <select
                    value={form.picks[s.kind]}
                    onChange={(e) => {
                      const id = e.target.value;
                      setForm({
                        ...form,
                        picks: { ...form.picks, [s.kind]: id },
                        paid: { ...form.paid, [s.kind]: metricFor(id)?.price ?? 0 },
                      });
                    }}
                    className="mt-1 w-full rounded-lg border border-border bg-background/60 px-2 py-2 text-sm text-foreground"
                  >
                    {byKind(s.kind).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-muted-foreground">
                  Paid ($)
                  <input
                    type="number"
                    min={0}
                    value={form.paid[s.kind]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paid: { ...form.paid, [s.kind]: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-background/60 px-2 py-2 font-mono text-sm text-foreground"
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="font-mono text-lg">{usd(formTotal)}</span>
            <button
              onClick={save}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-violet px-4 py-2 text-sm font-semibold text-background"
            >
              <Plus className="size-4" /> Save build
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Compare with a preset</h2>
            <select
              value={compareTo}
              onChange={(e) => setCompareTo(e.target.value)}
              className="rounded-lg border border-border bg-background/60 px-2 py-1.5 text-sm"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          {preset && (
            <p className="mt-2 text-sm text-muted-foreground">
              {preset.blurb} Street total: <span className="font-mono text-foreground">{usd(presetSum)}</span>
            </p>
          )}

          <div className="mt-5 space-y-4">
            <Bar label={`Preset: ${preset?.name}`} value={presetSum} max={maxBar} accent="violet" />
            {totals.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No builds yet — add your first one on the left.
              </p>
            )}
            {totals.map(({ b, total, street }) => {
              const diff = total - presetSum;
              return (
                <div key={b.id} className="rounded-xl border border-border/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {SLOTS.map((s) => getProduct(b.picks[s.kind])?.name).filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    <button
                      aria-label={`Delete ${b.name}`}
                      onClick={() => setBuilds((prev) => prev.filter((x) => x.id !== b.id))}
                      className="rounded-full p-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <Bar label="You paid" value={total} max={maxBar} accent="cyan" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className={diff > 0 ? "text-destructive" : "text-brand-cyan"}>
                      {diff > 0 ? `${usd(diff)} more` : `${usd(-diff)} less`} than preset
                    </span>
                    <span className={total > street ? "text-destructive" : "text-brand-cyan"}>
                      {total > street
                        ? `${usd(total - street)} over street price`
                        : `Saved ${usd(street - total)} vs street price`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, value, max, accent }: { label: string; value: number; max: number; accent: "cyan" | "violet" }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground">{usd(value)}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full ${accent === "cyan" ? "bg-brand-cyan" : "bg-brand-violet"}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
