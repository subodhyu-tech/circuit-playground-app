import { useEffect, useState, type ComponentType } from "react";
import { Boxes, Orbit, Pause, Play } from "lucide-react";
import type { ModelKind } from "@/data/hardware";

type SceneProps = {
  kind: ModelKind;
  selected: string | null;
  onSelect: (id: string) => void;
  exploded?: boolean;
  spin?: boolean;
};

export function HardwareViewer(
  props: Omit<SceneProps, "exploded" | "spin"> & { className?: string },
) {
  const { className = "", ...rest } = props;
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [exploded, setExploded] = useState(false);
  const [spin, setSpin] = useState(true);

  useEffect(() => {
    let cancelled = false;
    import("./HardwareModelScene")
      .then((m) => {
        if (!cancelled) setScene(() => m.default as ComponentType<SceneProps>);
      })
      .catch((err) => console.error("Failed to load 3D model", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (on: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur transition-colors ${
      on
        ? "border-brand-cyan/60 bg-brand-cyan/15 text-brand-cyan"
        : "border-border/70 bg-background/70 text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-[#05070d] ${className}`}
    >
      {Scene ? (
        <Scene {...rest} exploded={exploded} spin={spin} />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-32 w-32 animate-pulse rounded-2xl border border-border bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20" />
        </div>
      )}

      <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
        <button onClick={() => setExploded((v) => !v)} className={toggle(exploded)}>
          <Boxes className="size-3.5" />
          {exploded ? "Assembled view" : "Exploded view"}
        </button>
        <button onClick={() => setSpin((v) => !v)} className={toggle(!spin)}>
          {spin ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {spin ? "Pause spin" : "Auto-spin"}
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">
        <Orbit className="size-3" /> Drag to orbit · scroll to zoom · click any part
      </div>
    </div>
  );
}
