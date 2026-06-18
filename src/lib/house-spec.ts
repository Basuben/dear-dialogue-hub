export type Room = {
  id: string;
  name: string;
  width: number; // x (meters)
  depth: number; // z (meters)
  height: number; // y (meters)
  x: number; // center x
  z: number; // center z
  color: string;
  category: "living" | "bedroom" | "bath" | "porch";
};

// Layout reconstructed from the reference floor plan (~92 sqm footprint).
// Coordinate system: x = left→right, z = back→front (front is +z, the entry side).
export const HOUSE = {
  name: "Stone Cottage — 3 Bed Bungalow",
  footprintSqm: 92,
  roofingSheets: 50,
  exteriorWalls: "Natural dressed stone, mortar pointed",
  roof: "Pitched, blue pre-painted IT5 gauge-30 sheets (50)",
  floor: "Porcelain tile, 600×600 mm",
  ceilingHeight: 3.0,
  glazing: "Powder-coated steel grilles + clear glass casements",
};

export const ROOMS: Room[] = [
  // Central spine
  {
    id: "living",
    name: "Living Room",
    width: 4.0, depth: 7.5, height: 3.0,
    x: 0, z: 0,
    color: "#d9c79a",
    category: "living",
  },
  // Left column — two bedrooms stacked along z
  {
    id: "boy1",
    name: "Boy's Bedroom (Rear)",
    width: 3.5, depth: 3.5, height: 3.0,
    x: -3.75, z: -2.0,
    color: "#a8c4dc",
    category: "bedroom",
  },
  {
    id: "boy2",
    name: "Boy's Bedroom (Front)",
    width: 3.5, depth: 3.5, height: 3.0,
    x: -3.75, z: 2.0,
    color: "#a8c4dc",
    category: "bedroom",
  },
  // Right column
  {
    id: "bed3a",
    name: "Bedroom 3 (Rear)",
    width: 3.0, depth: 3.0, height: 3.0,
    x: 3.5, z: -2.25,
    color: "#b6cfb0",
    category: "bedroom",
  },
  {
    id: "bath",
    name: "Shared Bathroom",
    width: 1.5, depth: 2.5, height: 3.0,
    x: 2.75, z: 0.5,
    color: "#cfe3ec",
    category: "bath",
  },
  {
    id: "bed3b",
    name: "Bedroom 3 (Mid)",
    width: 3.0, depth: 2.0, height: 3.0,
    x: 4.0, z: 0.75,
    color: "#b6cfb0",
    category: "bedroom",
  },
  {
    id: "master",
    name: "Master Bedroom",
    width: 3.5, depth: 3.0, height: 3.0,
    x: 3.75, z: 3.0,
    color: "#e6b89c",
    category: "bedroom",
  },
  // Entry porch — protrudes in front of the living room
  {
    id: "porch",
    name: "Entry Porch",
    width: 2.0, depth: 2.0, height: 2.6,
    x: 0, z: 4.75,
    color: "#cdb79e",
    category: "porch",
  },
];

export function roomArea(r: Room) {
  return +(r.width * r.depth).toFixed(2);
}
