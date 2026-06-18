import { lazy, Suspense, useEffect, useState } from "react";

const HouseScene = lazy(() =>
  import("@/components/HouseScene").then((m) => ({ default: m.HouseScene })),
);

export function HouseCanvas({
  selectedId,
  onSelect,
  showRoof,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  showRoof: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        Loading 3D model…
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          Loading 3D model…
        </div>
      }
    >
      <HouseScene selectedId={selectedId} onSelect={onSelect} showRoof={showRoof} />
    </Suspense>
  );
}
