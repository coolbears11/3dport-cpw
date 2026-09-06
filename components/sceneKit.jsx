"use client";

// Shared palette + primitives used across the 3D environment components
// (PlaceholderEnvironment, DetailedBuilding, HeroDataCenter,
// Landscaping) so the vector/blueprint look — solid flat panels with a
// crisp dark edge outline — stays consistent instead of drifting per file.

import { useEffect, useMemo } from "react";
import * as THREE from "three";

// A clean white/off-white "abstract infrastructure model" palette — tonal
// variation stays subtle (a few close-value greys) so depth reads from
// shadows and lighting rather than dark contrasting surfaces. ACCENT green
// is reserved exclusively for the energy pulses/LEDs; every other element
// — including landscaping — stays inside this monochrome family.
export const STONE = "#ece8e0";
export const STONE_DARK = "#ddd8cc";
export const STONE_DEEP = "#cdc7b9";
export const INK = "#14161a";
// Soft warm-grey used for small solid detail fills (equipment housings,
// mullions, rack slot lines) — legible without reading as a dark surface.
// Pure INK is reserved for thin, low-opacity outline strokes only.
export const INK_DETAIL = "#a39c8c";
// Energy. The site stays near-white; colour arrives almost entirely
// through the utility network, the way it does on the references. Each
// generation type gets its own hue so a glance at the ground tells you
// what is feeding what: cool blue off the turbines, warm amber off the
// solar field, green on the trunk run into the compound.
export const ACCENT = "#3ef07f";
export const ACCENT_WIND = "#5ab9ff";
export const ACCENT_SOLAR = "#ffb454";
export const ACCENT_WATER = "#63dad2";
export const ACCENT_PINK = "#ff8fc4";
// Trace lines are pale enough to vanish at distance and only resolve as
// linework when the camera comes down — sparse sites read as sparse.
export const TRACE = "#c2bcac";
export const GLASS = "#e9eae4";

// The site surface. Kept as its own tokens rather than reusing STONE, so
// ground, sky and survey grid can be tuned without touching the massing.
export const SKY = "#f7f6f3";
export const GROUND = "#f1efea";
export const GRID = "#ded9cf";
// Utility-zone hardware: cooling tower shells, transformer housings and
// tank farms. A half-step deeper than the buildings so the power field
// reads as equipment rather than architecture.
export const PLANT = "#e4e0d7";
export const PLANT_DEEP = "#d2ccbf";
export const FOLIAGE = "#ddd8cb";
export const FOLIAGE_DARK = "#cac4b4";
export const WATER = "#e2e4de";
export const PATH = "#f2efe7";

// Shared flat-panel look: a solid box plus a crisp dark edge outline — what
// reads as "simple modern vector" at a distance instead of relying on
// texture detail.
export function EdgeBox({
  args,
  position = [0, 0, 0],
  rotation,
  color = STONE,
  edgeOpacity = 0.18,
  roughness = 0.8,
  metalness = 0.03,
  transparent = false,
  opacity = 1,
  name,
}) {
  const geometry = useMemo(() => new THREE.BoxGeometry(...args), [args.join(",")]);
  // The edge outline MUST be memoised alongside the box. Built inline in
  // the JSX it was reallocated on every single render and never released,
  // so each EdgeBox leaked a GPU buffer per render. With ~70 of them live
  // in a scroll-driven scene that re-renders constantly, memory climbed
  // until the browser tab was killed — the page would load correctly and
  // then die a few seconds later.
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  // Release both when this box unmounts; three.js does not garbage collect
  // GPU resources on its own.
  useEffect(() => {
    return () => {
      geometry.dispose();
      edges.dispose();
    };
  }, [geometry, edges]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} castShadow receiveShadow name={name}>
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          transparent={transparent}
          opacity={opacity}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={INK} transparent opacity={edgeOpacity} />
      </lineSegments>
    </group>
  );
}
