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
    // Lockheed Martin B648 Vestibule — two separate low volumes with
    // open ground between them, joined by a glazed vestibule link. The
    // vestibule is the connector between the two buildings, which is why
    // this reads as a split pair rather than one hall with a bolted-on
    // annex. Sawtooth industrial roof on both volumes.
    id: "project02",
    position: [-9, -2],
    size: [7.2, 2.4, 4],
    shape: "split",
    roof: "sawtooth",
    windowFaces: ["front"],
    split: {
      gap: 1.1,
      ratio: 0.56,
      heightRatio: 0.78,
      depthRatio: 0.85,
      linkHeight: 1.5,
      linkDepth: 1.8,
    },
    equipment: [
      { type: "ac", offset: [1.2, 1] },
      { type: "fan", offset: [-1.2, -1] },
    ],
  },
  {
    // Moxy Hotel — a 7-storey, 163-key hotel on a 0.76-acre lot: two
    // levels of podium parking with the guestroom block stepping back only
    // slightly above, and the rooftop bar deck on top. Compact and urban,
    // not a slender tower — the lot is too small for one.
    id: "project03",
    position: [-11, 4.5],
    size: [3.4, 5.2, 3],
    shape: "podium",
    // Mechanical rides the podium roof in the setback strip. Anything at
    // offset [0, 0] would sit dead centre on the guestroom roof, in the
    // middle of the bar deck.
    equipment: [{ type: "ac", offset: [0.9, 0.6] }],
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

// =====================================================================
// LAYER 1 — THE POWER FIELD
// =====================================================================
// Generation lives in its own region, far west of the compound, with open
// ground between the two. That distance is the point: power is acquired
// and developed somewhere else, then carried to the load. Previously all
// of this sat scattered *inside* the compound, ten units from the hero
// building, which made generation read as landscaping around the offices
// rather than as its own layer of the business.
//
// Everything here is positioned relative to open ground around
// [-48, -6]. The trunk line at the bottom of this file is what ties it
// back to the compound.
export const ZONE_U_CENTER = [-48, -6];

// Turbines spread widely — a wind field is mostly empty space.
export const ZONE_A_TURBINES = [
  { position: [-58, -14], scale: 1, speed: 1.05, name: "turbine_01_blades" },
  { position: [-45, -19], scale: 0.92, speed: 0.85, name: "turbine_02_blades" },
  { position: [-53, 2], scale: 1.08, speed: 1.2, name: "turbine_03_blades" },
  { position: [-63, -3], scale: 0.88, speed: 0.95, name: "turbine_04_blades" },
];

// The solar cascade, stepping away on a diagonal across open ground.
export const ZONE_A_SOLAR_FIELD = {
  origin: [-41, -15],
  step: [-4.1, -3.1],
  // Four clusters, stepped further apart. Six at a tighter step was 270
  // panel meshes on its own — and a sparse field reads better anyway.
  count: 4,
  rows: 3,
  cols: 3,
  rotationY: Math.PI / 7,
};

// Two hyperbolic cooling towers — the tallest silhouette on the whole
// site, and the thing that most immediately reads as "generation."
export const ZONE_U_COOLING_TOWERS = [
  { position: [-50, -7], scale: 1 },
  { position: [-45.4, -8.8], scale: 0.86 },
];

// The switchyard: where every feed in this zone is collected before it
// leaves for the compound. Sited at the eastern edge of the power field,
// pointing at the load.
export const ZONE_U_SUBSTATION = { position: [-37, -4], rotationY: Math.PI / 16 };

// Storage tanks, off on their own.
export const ZONE_U_TANKS = [
  { position: [-57, 5], radius: 1.3, height: 1.7 },
  { position: [-53.6, 6.4], radius: 0.95, height: 1.35 },
  { position: [-59.4, 7.4], radius: 0.8, height: 1.1 },
];
// Small equipment clutter. Some stays in the compound (buildings need
// their own gear), some sits out in the power field as switchgear.
export const ZONE_A_UTILITY_BLOCKS = [
  { position: [4.3, 3.6], size: [1, 1, 1] },
  { position: [-4.3, 2.8], size: [0.9, 0.7, 0.9] },
  { position: [4.6, -4.2], size: [0.85, 0.6, 0.85] },
  { position: [5.3, -5], size: [0.7, 0.9, 0.7] },
  { position: [-40.5, -7.4], size: [1.1, 0.8, 1.1] },
  { position: [-42.2, -6.2], size: [0.8, 0.6, 0.8] },
  { position: [-55.2, -10.6], size: [0.9, 0.7, 0.9] },
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

// =====================================================================
// THE TRUNK — Layer 1 to Layer 2
// =====================================================================
// The long run from the power field's switchyard to the compound's merge
// point. Routed as orthogonal doglegs rather than a straight diagonal,
// the way a real transmission easement follows property lines — and the
// way the reference sites draw them. This single line is what makes the
// two zones read as one system instead of two unrelated scenes, and it
// carries the camera between them.
export const TRUNK_WAYPOINTS = [
  [-36.5, 0.05, -4],
  [-24, 0.05, -4],
  [-24, 0.05, -6.5],
  [-9, 0.05, -6.5],
  [-9, 0.05, -3],
  [0, 0.05, -3],
];

// Feeds inside the power field, each gathering to the switchyard before
// anything leaves for the compound.
export const ZONE_U_FEEDS = [
  { from: [-58, 0.05, -14], via: [-46, 0.05, -14], type: "wind" },
  { from: [-45, 0.05, -19], via: [-41, 0.05, -14], type: "wind" },
  { from: [-53, 0.05, 2], via: [-44, 0.05, 2], type: "wind" },
  { from: [-63, 0.05, -3], via: [-44, 0.05, -3], type: "wind" },
  { from: [-41, 0.05, -15], via: [-39, 0.05, -12], type: "solar" },
  { from: [-50, 0.05, -7], via: [-42, 0.05, -7], type: "water" },
];
export const ZONE_U_SWITCHYARD_NODE = [-36.5, 0.05, -4];
