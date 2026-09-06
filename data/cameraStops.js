// Camera stops for the continuous 3D environment.
// `position` / `target` are world-space [x, y, z]. `fov` is in degrees.
// CameraRig interpolates smoothly between whichever two stops the current
// scroll progress falls between — see components/CameraRig.jsx.
//
// ONE FLAGSHIP STORY: the whole sequence lives in a single compound. JTT
// Gigascale (project04, the anchor building) is the hero — it gets the
// approach, the closest exterior framing, and the only interior sequence.
//
// CHOREOGRAPHY: the sequence opens nearly top-down, so the compound first
// reads as a site plan — a drawing — before it resolves into buildings.
// That framing is the thesis of the whole portfolio: someone who reads a
// site before he builds it. The camera then descends into perspective and
// stays there until the closing pull-back lifts back toward plan.
//
// Each supporting project now gets its OWN framing rather than a repeat of
// the establishing shot. Distance, pitch and azimuth follow what the
// building actually is: Block 100's twin towers get a low angle so their
// height reads; Lockheed's split pair is viewed close to square-on so the
// gap and the glazed vestibule between the two volumes are legible; the
// Moxy gets a tighter, steeper frame because it's a compact urban block.
// An earlier version framed every supporting building identically so none
// would compete with the hero — which worked, at the cost of four
// interchangeable shots in a row.
//
// Hierarchy is still carried by distance and screen time (the hero is
// closest and gets the most beats), never by cropping.
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

// The compound's center — also the hero building's own target. Supporting
// stops blend their aim point toward this so the cluster stays in frame
// instead of cropping to one building. The blend is lighter than it was
// (0.3 rather than 0.45): enough context to keep the campus readable, but
// the building being narrated is now clearly the subject.
const COMPOUND_CENTER = [0, 0.5, 0];
function blendTarget(target, t = 0.3) {
  return [
    target[0] * (1 - t) + COMPOUND_CENTER[0] * t,
    target[1],
    target[2] * (1 - t) + COMPOUND_CENTER[2] * t,
  ];
}
function supportingStop(target, azimuthDeg, distance, pitchDeg, fov, blend) {
  return aerialStop(blendTarget(target, blend), azimuthDeg, distance, pitchDeg, fov);
}

export const cameraStops = {
  // --- Phase 1: the site plan. High, near-vertical, slightly long lens —
  // the ground grid and the traces between buildings read as linework
  // before anything reads as architecture.
  // Opens over the WHOLE system — both zones in one frame, seen almost
  // straight down, so the first thing read is the relationship between
  // generation and load.
  sitePlan: aerialStop([-24, 0.5, -3], 0, 92, 78, 26),
  // Descend into perspective. Same compound, now with facades.
  zoneAEstablish: aerialStop([0, 0.5, 2], 8, 42, 34, 27),

  // --- Phase 1b: THE UTILITIES, narrated on their own before the hero
  // appears. The turbines, the solar cascade and the trace network were
  // always in the scene but were never the subject of a single shot — the
  // camera flew straight past the things that make the site viable. These
  // three beats are deliberately low and close, at or near hub height,
  // because generation equipment only feels large from underneath.
  //
  // Order is causal: power is made, the site is assessed, everything runs
  // inward. The hero building is the payoff of that sequence, not the
  // opening statement.
  // Layer 1 establishing: high and wide over the power field, far enough
  // out that the emptiness around the equipment is part of the picture.
  powerFieldEstablish: aerialStop([-49, 1, -7], 30, 52, 40, 26),
  // Down among the turbines at close to hub height. Generation equipment
  // only feels large from underneath.
  windField: aerialStop([-55, 3.4, -8], 128, 17, 15, 30),
  // The cooling towers, the tallest silhouette on the site.
  coolingTowers: aerialStop([-47.7, 2.6, -7.9], 66, 16, 17, 29),
  // Viewed from the far end of the cascade looking back toward the
  // compound, so the panels lead the eye into the site. The mirrored
  // angle (-54) would have placed the camera inside the Getty building.
  solarField: aerialStop([-49, 0.9, -22], -46, 20, 21, 30),
  // The switchyard, where the whole field collects before it leaves.
  switchyard: aerialStop([-37, 1.2, -4], -35, 14, 22, 29),
  // THE TRUNK RUN — the transition between layers. The camera sits low
  // over the middle of the easement, the power field receding behind and
  // the compound resolving out of the haze ahead. This is the only shot
  // that contains both zones.
  trunkRun: aerialStop([-22, 1.2, -5.4], 96, 22, 16, 32),
  // Arrival: nearly at ground level, aimed straight up the last stretch
  // into the hero's dock side, so the pulses travel toward the vanishing
  // point rather than across the frame.
  powerConverge: aerialStop([0, 0.9, -3], 178, 12, 10, 34),

  // --- Phase 2: the hero. A low gliding approach, then a closer and more
  // dramatic reveal than any supporting building gets.
  jttApproach: aerialStop(COMPOUND_CENTER, 20, 28, 25, 28),
  jttReveal: aerialStop(COMPOUND_CENTER, -20, 21, 34, 25),

  // --- Phase 3: the one deliberate non-aerial exception. The camera
  // descends through the hero's glazed wall into its server room, holds
  // among the rack rows, then rises back out. Coordinates are interior,
  // not aerial — intentional, and scoped to this single moment.
  jttServerEnter: { position: [2, 6, 8], target: [0.5, 1.8, 2.8], fov: 44 },
  jttServerInterior1: { position: [-1.8, 1.7, -1.4], target: [2.2, 1.1, 2.6], fov: 50 },
  jttServerExit: { position: [1, 9, 9], target: [0, 2, 2.5], fov: 40 },

  // --- Phase 4: the four supporting projects, each framed for what it is.
  // Targets follow each project's actual building position (see
  // data/worldLayout.js) — Getty Core at project06, Block 100 at
  // project05, Lockheed at project02, Moxy at project03. The order matches
  // the 02-05 labels and hotspotBuildingOrder in data/sections.js.

  // Getty Core: an institutional block. Moderate pitch, close enough that
  // the parapet and the window bays register.
  gettyCoreReveal: supportingStop([8, 0.5, 4], 82, 27, 31, 26),
  // Block 100: twin towers, the tallest thing on site. Low pitch so the
  // camera looks ACROSS them rather than down onto them — height is the
  // entire point of this building.
  block100Reveal: supportingStop([11, 0.5, -3], 48, 26, 22, 27, 0.24),
  // Lockheed B648: two volumes with a glazed vestibule between them. A low
  // azimuth views the pair close to square-on, so the gap reads as a gap
  // and the link reads as a link; the low raking pitch catches the
  // sawtooth silhouette against the sky instead of flattening it.
  // Approached from the EAST side: the mirrored angle (-18) puts the Moxy
  // directly between the camera and this building.
  lockheedReveal: supportingStop([-9, 0.5, -2], 22, 25, 20, 28, 0.22),
  // Moxy: a compact urban block, the smallest footprint in the compound.
  // Tighter and steeper — the camera has to come in for this one.
  moxyReveal: supportingStop([-11, 0.5, 4.5], -74, 23, 33, 26, 0.26),

  // --- Phase 5: closing pull-back. Rises past the establishing distance
  // and steepens, so the compound recedes back toward the drawing it
  // started as. A bookend, not a repeat.
  campusFarewell: aerialStop([0, 0.5, -2], 34, 48, 42, 27),
};

// Ordered sequence the scroll timeline walks through. Two beats that
// carried no content were cut rather than left as dead scroll: the second
// server-room pivot (which used to hold a Getty Core card that didn't
// belong inside the hero building) and the campusResume wide shot, which
// repeated the establishing framing immediately before the supporting run.
export const cameraSequence = [
  "sitePlan",
  "powerFieldEstablish",
  "windField",
  "coolingTowers",
  "solarField",
  "switchyard",
  "trunkRun",
  "zoneAEstablish",
  "powerConverge",
  "jttApproach",
  "jttReveal",
  "jttServerEnter",
  "jttServerInterior1",
  "jttServerExit",
  "gettyCoreReveal",
  "block100Reveal",
  "lockheedReveal",
  "moxyReveal",
  "campusFarewell",
];
