// Camera stops for the continuous 3D environment.
// `position` / `target` are world-space [x, y, z]. `fov` is in degrees.
// CameraRig interpolates smoothly between whichever two stops the current
// scroll progress falls between — see components/CameraRig.jsx.
//
// ONE FLAGSHIP STORY: the whole sequence now lives in a single compound.
// JTT Gigascale (project04, the anchor building) is the hero — it gets the
// closest exterior framing, a dedicated approach beat, and the only
// interior "server room" sequence (which now lives inside the hero
// building itself, not a separate compound). The four supporting projects
// get a single wide exterior stop each, framed identically to the
// establishing shot so they read as "part of the same campus" rather than
// individually zoomed-into subjects. Two buildings (project01, project07)
// carry no project and get no dedicated stop at all — they're still
// visible in every wide shot, just not narrated.
//
// AERIAL SYSTEM: shallow pitch (~33-40 degrees) so real wall facade reads
// alongside the roof, moderate FOV (~24-27), camera pulled back far enough
// that the whole compound stays legible at every exterior stop — hierarchy
// is expressed through distance (hero closer, supporting wider) and screen
// time (more stops around the hero), never through cropping.
const DEG = Math.PI / 180;
function aerialStop(target, azimuthDeg, distance, pitchDeg, fov) {
  const az = azimuthDeg * DEG;
  const pitch = pitchDeg * DEG;
  const horiz = distance * Math.cos(pitch);
  const height = distance * Math.sin(pitch);
  return {
    position: [target[0] + horiz * Math.sin(az), target[1] + height, target[2] + horiz * Math.cos(az)],
    target,
    fov,
  };
}

// The compound's center — also the hero building's own target. Supporting-
// building stops blend their aim point toward this so the whole cluster
// stays in frame instead of cropping down to just that one building.
const COMPOUND_CENTER = [0, 0.5, 0];
function blendTarget(target, t = 0.45) {
  return [
    target[0] * (1 - t) + COMPOUND_CENTER[0] * t,
    target[1],
    target[2] * (1 - t) + COMPOUND_CENTER[2] * t,
  ];
}
function supportingStop(target, azimuthDeg, distance, pitchDeg, fov) {
  return aerialStop(blendTarget(target), azimuthDeg, distance, pitchDeg, fov);
}

export const cameraStops = {
  // --- Phase 1: aerial establishing view over the whole compound
  zoneAEstablish: aerialStop([0, 0.5, 2], 0, 42, 34, 27),

  // --- Phase 2: the hero. Two beats — a gliding approach (pure camera
  // movement, no content yet) then a noticeably closer reveal — give JTT
  // more screen time and a more dramatic framing than any supporting
  // building gets, without ever cropping the building itself.
  jttApproach: aerialStop(COMPOUND_CENTER, 15, 30, 33, 26),
  jttReveal: aerialStop(COMPOUND_CENTER, -20, 24, 35, 25),

  // --- Phase 3: the one deliberate non-aerial exception. The camera
  // descends through the hero building's own glazed wall into its server
  // room, holds on JTT's own infrastructure, then pivots and rises back
  // out. Only JTT is narrated in here — the pivot beat (Interior2) is
  // pure camera movement now, so no supporting project appears inside the
  // hero building. Coordinates are interior/near-building, not aerial —
  // intentional, scoped to this one moment only.
  jttServerEnter: { position: [2, 6, 8], target: [0.5, 1.8, 2.8], fov: 44 },
  jttServerInterior1: { position: [-1.8, 1.7, -1.4], target: [2.2, 1.1, 2.6], fov: 50 },
  jttServerInterior2: { position: [1.8, 1.7, -1.4], target: [-2.2, 1.1, 2.6], fov: 50 },
  jttServerExit: { position: [1, 9, 9], target: [0, 2, 2.5], fov: 40 },

  // --- Phase 4: return to the compound view — same wide establishing
  // language as Phase 1, different azimuth so it reads as "arriving back,"
  // not "repeating" — then the four supporting projects, discovered
  // naturally around the hero, each framed exactly as wide as the
  // establishing shot so none of them compete with JTT for attention.
  campusResume: aerialStop([0, 0.5, 0], -10, 40, 33, 27),
  // Targets follow each project's actual building position (see
  // data/worldLayout.js) — Getty Core sits at project06, Block 100 at
  // project05, Lockheed at project02, Moxy at project03. The sequence
  // below visits them in 02-05 label order, matching hotspotBuildingOrder
  // in data/sections.js.
  gettyCoreReveal: supportingStop([8, 0.5, 4], 75, 32, 36, 26),
  block100Reveal: supportingStop([11, 0.5, -3], 60, 32, 36, 26),
  lockheedReveal: supportingStop([-9, 0.5, -2], -55, 32, 36, 26),
  moxyReveal: supportingStop([-11, 0.5, 4.5], -70, 34, 37, 26),

  // --- Phase 5: closing wide pull-back — a calm, controlled bookend.
  campusFarewell: aerialStop([0, 0.5, -2], 30, 44, 32, 27),
};

// Ordered sequence the scroll timeline walks through.
export const cameraSequence = [
  "zoneAEstablish",
  "jttApproach",
  "jttReveal",
  "jttServerEnter",
  "jttServerInterior1",
  "jttServerInterior2",
  "jttServerExit",
  "campusResume",
  "gettyCoreReveal",
  "block100Reveal",
  "lockheedReveal",
  "moxyReveal",
  "campusFarewell",
];
