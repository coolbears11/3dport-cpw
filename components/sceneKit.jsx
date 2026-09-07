"use client";

// Shared palette + primitives used across the 3D environment components
// (PlaceholderEnvironment, DetailedBuilding, HeroDataCenter,
// Landscaping) so the vector/blueprint look — solid flat panels with a
// crisp dark edge outline — stays consistent instead of drifting per file.

import { useMemo } from "react";
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
export const ACCENT = "#3ef07f";
// Plant hardware — cooling shells, containment, dam wall. A half-step
// deeper than the buildings so generation reads as equipment.
export const PLANT = "#e4e0d7";
export const PLANT_DEEP = "#d2ccbf";
export const TRACE = "#c2bcac";
export const GLASS = "#e9eae4";
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
      <lineSegments geometry={new THREE.EdgesGeometry(geometry)}>
        <lineBasicMaterial color={INK} transparent opacity={edgeOpacity} />
      </lineSegments>
    </group>
  );
}
