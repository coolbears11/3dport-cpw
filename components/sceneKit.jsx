"use client";

// Shared palette + primitives used across the 3D environment components
// (PlaceholderEnvironment, DetailedBuilding, HeroDataCenter,
// Landscaping) so the vector/blueprint look — solid flat panels with a
// crisp dark edge outline — stays consistent instead of drifting per file.

import { useMemo } from "react";
import * as THREE from "three";

// The models stay pale — the white "abstract infrastructure model" look is
// the identity of this site and it doesn't change. What changed is the
// GROUND the models stand on: sky, earth and site grid are now near-black,
// so the pale massing reads as lit objects on a dark site rather than
// beige-on-beige. High contrast, and it lets the energy pulses actually
// glow instead of sitting flat.
//
// Building surfaces — unchanged, deliberately. Depth still comes from
// shadow and lighting across a few close values, not from dark panels.
export const STONE = "#ece8e0";
export const STONE_DARK = "#ddd8cc";
export const STONE_DEEP = "#cdc7b9";
export const INK = "#14161a";
// Soft warm-grey used for small solid detail fills (equipment housings,
// mullions, rack slot lines) — legible without reading as a dark surface.
// Pure INK is reserved for thin, low-opacity outline strokes only.
export const INK_DETAIL = "#a39c8c";
export const GLASS = "#e9eae4";

// The site: sky, earth, survey grid. These used to be STONE, which is why
// everything sat in one tonal register.
export const SKY = "#0b0c0d";
export const GROUND = "#111316";
export const GRID = "#2b313a";

// Energy. ACCENT green stays the primary pulse colour, but generation
// sources now read as distinct feeds converging on the hall: cool blue off
// the turbines, warm amber off the solar field, green on the final run
// into the building. That's the only place colour is allowed to shout.
export const ACCENT = "#3ef07f";
export const ACCENT_WIND = "#79d2ff";
export const ACCENT_SOLAR = "#ffb454";
export const TRACE = "#46515e";
export const SOLAR_PANEL = "#43607a";

// Landscaping — a muted sage rather than off-white, so planting reads as
// planting against the dark ground instead of glowing like a building.
export const FOLIAGE = "#79876c";
export const FOLIAGE_DARK = "#5c6853";
export const WATER = "#1b2933";
export const PATH = "#262b31";

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
