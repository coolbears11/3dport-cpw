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

// The fixed isometric setup used for the whole of Layer 1.
const ISO_AZ = 45;
const ISO_PITCH = 30;
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
  // ISOMETRIC. Layer 1 is shot at ONE fixed angle — 30 degrees of
  // elevation, 45 of rotation, on a long lens so perspective flattens
  // toward orthographic. The world moves through the frame; the camera
  // does not swing around. That fixed angle is most of why the reference
  // sites read the way they do, and why an earlier near-top-down opener
  // (78 degrees) felt like a different kind of site entirely.
  sitePlan: aerialStop([-15, 0.5, -3], ISO_AZ, 74, ISO_PITCH, 20),
  // Descend into perspective. Same compound, now with facades.
  // Arrival at Layer 2, still isometric — the handover point. From here
  // on the camera drops into perspective and starts varying per project.
  zoneAEstablish: aerialStop([0, 0.5, 1], ISO_AZ, 44, ISO_PITCH, 24),

  // Viewed from the far end of the cascade looking back toward the
  // compound, so the panels lead the eye into the site. The mirrored
  // angle (-54) would have placed the camera inside the Getty building.

  // --- Phase 1b: the utilities get their own beats. NO new geometry is
  // involved — the turbines, solar cascade and ground traces have always
  // been in this scene, the camera just never stopped on them. Low and
  // close, at or near hub height, because generation equipment only reads
  // as large from underneath.
  windField: aerialStop([-30, 2.6, -12], ISO_AZ, 28, ISO_PITCH, 22),
  // Pulled back to 30: at 26 the camera sat directly over the Lockheed
  // building, which would have crept into the bottom of frame.
  solarField: aerialStop([-26, 0.8, -17], ISO_AZ, 30, ISO_PITCH, 22),
  // Riding the trunk corridor east. Same isometric angle, so this reads
  // as travel along the band rather than as a new camera setup.
  powerConverge: aerialStop([-17, 0.8, -5], ISO_AZ, 30, ISO_PITCH, 23),

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
  "zoneAEstablish",
  "windField",
  "solarField",
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
