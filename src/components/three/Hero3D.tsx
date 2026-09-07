import { Suspense, lazy, useEffect, useState } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

function SceneFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-40 w-40 animate-pulse rounded-2xl border border-border bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20" />
    </div>
  );
}

export function Hero3D({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={`relative ${className}`}>
      {mounted ? (
        <Suspense fallback={<SceneFallback />}>
          <HeroScene />
        </Suspense>
      ) : (
        <SceneFallback />
      )}
    </div>
  );
}
