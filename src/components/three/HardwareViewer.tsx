import { useEffect, useState, type ComponentType } from "react";
import type { ModelKind } from "@/data/hardware";

type SceneProps = {
  kind: ModelKind;
  selected: string | null;
  onSelect: (id: string) => void;
};

export function HardwareViewer(props: SceneProps & { className?: string }) {
  const { className = "", ...rest } = props;
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);

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

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-[#05070d] ${className}`}>
      {Scene ? (
        <Scene {...rest} />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-32 w-32 animate-pulse rounded-2xl border border-border bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20" />
        </div>
      )}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">
        Drag to orbit · scroll to zoom · click any part
      </div>
    </div>
  );
}
