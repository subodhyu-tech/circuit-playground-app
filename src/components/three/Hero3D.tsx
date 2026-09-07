import { useEffect, useState, type ComponentType } from "react";

function SceneFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-40 w-40 animate-pulse rounded-2xl border border-border bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20" />
    </div>
  );
}

export function Hero3D({ className = "" }: { className?: string }) {
  const [Scene, setScene] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("./HeroScene")
      .then((m) => {
        if (!cancelled) setScene(() => m.default as ComponentType);
      })
      .catch((err) => console.error("Failed to load 3D scene", err));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {Scene ? <Scene /> : <SceneFallback />}
    </div>
  );
}
