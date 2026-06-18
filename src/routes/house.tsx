import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Box, Copy, Eye, EyeOff, Home, Ruler } from "lucide-react";
import { HOUSE, ROOMS, roomArea } from "@/lib/house-spec";
import houseRef from "@/assets/house-reference.png.asset.json";
import { HouseCanvas } from "@/components/HouseCanvas";

export const Route = createFileRoute("/house")({
  head: () => ({
    meta: [
      { title: "Stone Cottage — 3D House Specs" },
      {
        name: "description",
        content:
          "Interactive 3D model and full build specifications for a 92 sqm, 3-bedroom stone bungalow with pitched blue roof.",
      },
      { property: "og:title", content: "Stone Cottage — 3D House Specs" },
      {
        property: "og:description",
        content: "Interactive 3D model + room-by-room build specs for a 92 sqm stone bungalow.",
      },
      { property: "og:image", content: houseRef.url },
    ],
  }),
  component: HousePage,
});

function HousePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showRoof, setShowRoof] = useState(false);

  const totalArea = useMemo(
    () => ROOMS.reduce((s, r) => s + r.width * r.depth, 0),
    [],
  );

  const selectedRoom = ROOMS.find((r) => r.id === selected) ?? null;

  const copySpecs = () => {
    const lines = [
      `${HOUSE.name}`,
      `Footprint: ~${HOUSE.footprintSqm} sqm`,
      `Roofing: ${HOUSE.roof}`,
      `Walls: ${HOUSE.exteriorWalls}`,
      `Floor: ${HOUSE.floor}`,
      `Ceiling height: ${HOUSE.ceilingHeight} m`,
      ``,
      `ROOMS`,
      ...ROOMS.map(
        (r) => `• ${r.name} — ${r.width} × ${r.depth} m (${roomArea(r)} sqm)`,
      ),
    ].join("\n");
    navigator.clipboard.writeText(lines);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-[#0f1b3d] text-white">
                <Home className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-tight">{HOUSE.name}</span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  3D specs · capstone preview
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={copySpecs}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            <Copy className="h-3.5 w-3.5" /> Copy specs
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[1.6fr_1fr]">
        {/* 3D viewer */}
        <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Box className="h-3.5 w-3.5" /> Interactive model
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>Drag to rotate · scroll to zoom · click a room</span>
              <button
                onClick={() => setShowRoof((v) => !v)}
                className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 hover:bg-accent"
              >
                {showRoof ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                Roof
              </button>
            </div>
          </div>
          <div className="h-[460px] w-full lg:h-[620px]">
            {mounted ? (
              <Suspense fallback={<div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading 3D model…</div>}>
                <HouseScene
                  selectedId={selected}
                  onSelect={setSelected}
                  showRoof={showRoof}
                />
              </Suspense>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading 3D model…</div>
            )}
          </div>
        </section>

        {/* Specs panel */}
        <aside className="flex flex-col gap-5">
          {/* Headline stats */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-white p-3 shadow-sm">
            <Stat label="Footprint" value={`${HOUSE.footprintSqm} m²`} />
            <Stat label="Bedrooms" value="4" />
            <Stat label="Roof sheets" value={`${HOUSE.roofingSheets}`} />
          </div>

          {/* Selected room or full spec */}
          {selectedRoom ? (
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Selected room
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                {selectedRoom.name}
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <Mini label="Width" value={`${selectedRoom.width} m`} />
                <Mini label="Depth" value={`${selectedRoom.depth} m`} />
                <Mini label="Area" value={`${roomArea(selectedRoom)} m²`} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Ruler className="h-3.5 w-3.5" />
                Ceiling height {selectedRoom.height} m · category {selectedRoom.category}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Build specification
              </span>
              <dl className="mt-3 space-y-2 text-sm">
                <SpecRow label="Exterior walls" value={HOUSE.exteriorWalls} />
                <SpecRow label="Roof" value={HOUSE.roof} />
                <SpecRow label="Floor" value={HOUSE.floor} />
                <SpecRow label="Glazing" value={HOUSE.glazing} />
                <SpecRow label="Ceiling height" value={`${HOUSE.ceilingHeight} m`} />
              </dl>
            </div>
          )}

          {/* Room list */}
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Room schedule
              </span>
              <span className="text-[11px] text-muted-foreground">
                Total {totalArea.toFixed(1)} m²
              </span>
            </div>
            <ul className="divide-y divide-border/70">
              {ROOMS.map((r) => {
                const active = selected === r.id;
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelected(active ? null : r.id)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        active ? "bg-[#0f1b3d] text-white" : "hover:bg-accent"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 rounded-sm ring-1 ring-black/10"
                          style={{ background: r.color }}
                        />
                        <span className="font-medium">{r.name}</span>
                      </span>
                      <span
                        className={`tabular-nums text-xs ${
                          active ? "text-white/80" : "text-muted-foreground"
                        }`}
                      >
                        {r.width} × {r.depth} m · {roomArea(r)} m²
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </main>

      {/* Reference */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Source floor plan reference
            </span>
            <span className="text-[11px] text-muted-foreground">
              The 3D model above is derived from this plan
            </span>
          </div>
          <img
            src={houseRef.url}
            alt="Original 3D floor plan reference showing room layout, dimensions and roofing"
            className="block w-full"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#f5f6f8] px-3 py-2">
      <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-display text-lg font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-base font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col border-b border-border/40 pb-2 last:border-none last:pb-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}
