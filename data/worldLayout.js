// Single source of truth for the compound's spatial layout: buildings,
// ground-trace waypoints, and landscaping. PlaceholderEnvironment
// (geometry), Hotspots (marker anchors), and cameraStops (aerial framing)
// all read from here so the camera always frames where things actually are.
//
// World convention: X lateral, Z depth, Y vertical. All "position" tuples
// for buildings/points are [x, z] unless noted — Y is derived (ground = 0,
// building targets sit just above it).
//
// One compound, one story: everything lives in this single cluster now.
// The old second compound + transition corridor were removed — the
// "server room" experience was moved inside project04 (the hero/anchor
// building) instead of living in a separate building down the road. See
// data/cameraStops.js and data/sections.js for how the narrative walks
// through this same geometry.

// Deliberately irregular: one dominant anchor (the hero), a mix of medium
// and small support structures — not a line, not an even grid. Each
// building's massing is matched to the real project it now carries (see
// data/sections.js): Lockheed's low wide hangar, Block 100's twin towers,
// Moxy's podium + tower, Getty Core's taller institutional block. Two
// buildings (project01, project07) carry no project and keep their
// original simple massing — unlabeled campus filler.
export const ZONE_A_BUILDINGS = [
  {
    // Unassigned — campus filler only.
    id: "project01",
    position: [-5, 9],
    size: [2.4, 2.6, 2.4],
    roof: "gable",
    windowFaces: ["front", "right"],
    equipment: [{ type: "vent", offset: [0.5, 0] }],
  },
  {
    // Lockheed Martin B648 Concept — a low, wide assembly hangar with a
    // sawtooth industrial roof and a small glazed office/entry annex,
    // matching the real B648 facility's massing (a long low hall, not a
    // tower).
    id: "project02",
    position: [-9, -2],
    size: [5.8, 1.9, 4],
    roof: "sawtooth",
    windowFaces: [],
    equipment: [
      { type: "ac", offset: [1.4, 1] },
      { type: "fan", offset: [-1.4, -1] },
    ],
    annex: { width: 1.5, height: 1.6, depth: 1.3, position: [3.5, 0.8] },
  },
  {
    // Moxy Hotel — podium + guestroom tower.
    id: "project03",
    position: [-11, 4.5],
    size: [2.6, 6.5, 2.4],
    shape: "podium",
    equipment: [{ type: "vent", offset: [0, 0] }],
  },
  {
    // The hero building — JTT Gigascale. Rendered by HeroDataCenter, not
    // DetailedBuilding: same warehouse shell + ribbed roof + dock as
    // before, plus a glazed wall and interior server racks (rackRows /
    // racksPerRow below) — the "server room" now lives inside this
    // building instead of in a separate compound.
    id: "project04",
    position: [0, 0],
    size: [7.5, 2.6, 6],
    dock: { width: 2.6, depth: 1.3, position: [0, -3.65] },
    equipment: [],
    rackRows: 2,
    racksPerRow: 6,
  },
  {
    // Block 100 Apartments — twin residential towers on one shared podium
    // footprint (the real project is 2 towers, 15 stories each).
    id: "project05",
    position: [11, -3],
    size: [3.6, 7, 2.2],
    shape: "towers",
    equipment: [{ type: "vent", offset: [0, 0] }],
  },
  {
    // Getty Core — taller, multi-level institutional block (5 levels).
    id: "project06",
    position: [8, 4],
    size: [4.2, 4.6, 4],
    roof: "parapet",
    windowFaces: ["front", "right"],
    equipment: [{ type: "ac", offset: [0, 1.4] }],
  },
  {
    // Unassigned — campus filler only.
    id: "project07",
    position: [5, -8],
    size: [2.6, 2.2, 2.8],
    roof: "flat",
    windowFaces: ["front", "left"],
    equipment: [{ type: "fan", offset: [0, 0] }],
  },
];

// Supporting infrastructure scattered through the gaps between clusters so
// the compound reads as inhabited rather than a handful of boxes.
export const ZONE_A_TURBINES = [
  { position: [-2, -10], scale: 1, speed: 1.05, name: "turbine_01_blades" },
  { position: [14, 8], scale: 0.9, speed: 0.85, name: "turbine_02_blades" },
  { position: [-14, -6], scale: 1.05, speed: 1.2, name: "turbine_03_blades" },
];
// A diagonal cascade of solar clusters well off to the east, clear of every
// building footprint — a compound has room to spread these out rather than
// hugging one spot next to the anchor building.
export const ZONE_A_SOLAR_FIELD = {
  origin: [15, -1],
  step: [3.2, -2.3],
  count: 5,
  rows: 3,
  cols: 3,
  rotationY: Math.PI / 7,
};
export const ZONE_A_UTILITY_BLOCKS = [
  { position: [4.3, 3.6], size: [1, 1, 1] },
  { position: [-4.3, 2.8], size: [0.9, 0.7, 0.9] },
  { position: [4.6, -4.2], size: [0.85, 0.6, 0.85] },
  { position: [5.3, -5], size: [0.7, 0.9, 0.7] },
];

// Small, stylized landscaping accents — trees, shrubs, a footpath, a pond
// and footbridge — scattered through the compound's open ground.
export const ZONE_A_TREES = [
  { position: [-7, 7], scale: 1 },
  { position: [2, 8], scale: 0.9 },
  { position: [10, -8.5], scale: 1.05 },
  { position: [-9.5, 8], scale: 0.85 },
  { position: [6, -4.5], scale: 0.95 },
  { position: [13, 2], scale: 1 },
  { position: [-13, 0], scale: 0.9 },
  { position: [3, 10.5], scale: 0.85 },
  { position: [9.5, 9], scale: 0.95 },
  { position: [-5, -6.5], scale: 0.9 },
];
export const ZONE_A_SHRUBS = [
  { position: [1.5, 2.2], scale: 1 },
  { position: [-2, -2.4], scale: 0.9 },
  { position: [-9, -6], scale: 1 },
  { position: [-13.5, -1], scale: 0.85 },
  { position: [5, 6], scale: 0.9 },
  { position: [9, 6.5], scale: 1 },
  { position: [3, -9], scale: 0.85 },
  { position: [12, -5.5], scale: 0.9 },
  { position: [-4, 10.5], scale: 0.85 },
  { position: [-12, 6], scale: 0.9 },
];
export const ZONE_A_PATHS = [
  { from: [0, -1.8], to: [-4, -5] },
  { from: [-4, -5], to: [-6.2, -6] },
];
export const ZONE_A_POND = { position: [-6, -6], radius: 1.1 };
export const ZONE_A_BRIDGE = { position: [-6, -6], length: 2.6, rotationY: Math.PI / 2 };

// Ground-trace network: every building's static neutral trace converges on
// this merge point — which sits right at the hero building's doorstep — and
// a short animated stub then carries a green pulse the rest of the way in,
// visually reading as "everything feeds the hero." Nothing travels beyond
// this single compound anymore.
export const ZONE_A_MERGE_POINT = [0, 0.05, -3];
export const MERGE_TO_HERO_WAYPOINTS = [
  [0, 0.05, -3],
  [0, 0.05, -1.4],
];
