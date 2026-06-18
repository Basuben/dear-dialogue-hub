import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Edges, Grid } from "@react-three/drei";
import { Suspense } from "react";
import { ROOMS, type Room } from "@/lib/house-spec";

function RoomBox({
  room,
  selectedId,
  onSelect,
}: {
  room: Room;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const isSelected = selectedId === room.id;
  const isDim = selectedId !== null && !isSelected;
  return (
    <group position={[room.x, room.height / 2, room.z]}>
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect(room.id);
        }}
      >
        <boxGeometry args={[room.width, room.height, room.depth]} />
        <meshStandardMaterial
          color={room.color}
          transparent
          opacity={isDim ? 0.18 : isSelected ? 0.95 : 0.78}
          roughness={0.85}
        />
        <Edges threshold={15} color={isSelected ? "#0f1b3d" : "#3b4a6b"} />
      </mesh>
      {(isSelected || selectedId === null) && (
        <Html
          position={[0, room.height / 2 + 0.4, 0]}
          center
          distanceFactor={14}
          occlude
          style={{ pointerEvents: "none" }}
        >
          <div className="whitespace-nowrap rounded-md bg-[#0f1b3d]/90 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-white shadow-lg">
            {room.name}
            <span className="ml-1.5 text-[10px] font-normal text-white/70">
              {room.width}×{room.depth} m
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

function Roof() {
  // Simple pitched roof shape over the main rectangle
  const w = 11.5;
  const d = 8.5;
  const h = 1.8;
  return (
    <group position={[0.2, 3.0, 0]}>
      <mesh castShadow>
        <coneGeometry args={[Math.max(w, d) / 1.7, h, 4, 1]} />
        <meshStandardMaterial color="#1d4e89" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

export function HouseScene({
  selectedId,
  onSelect,
  showRoof,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  showRoof: boolean;
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [14, 12, 14], fov: 38 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      onPointerMissed={() => onSelect(null)}
      style={{ background: "linear-gradient(180deg, #e9eef6 0%, #f7f8fb 100%)" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Suspense fallback={null}>
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#eef0ee" />
        </mesh>
        <Grid
          position={[0, 0.01, 0]}
          args={[30, 30]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#b8c1d1"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#6b7a99"
          fadeDistance={28}
          fadeStrength={1}
          infiniteGrid={false}
        />

        {ROOMS.map((r) => (
          <RoomBox key={r.id} room={r} selectedId={selectedId} onSelect={onSelect} />
        ))}

        {showRoof && <Roof />}
      </Suspense>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={36}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 1, 0]}
      />
    </Canvas>
  );
}
