"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { EdgeBox, STONE, STONE_DARK, STONE_DEEP, INK, INK_DETAIL, GLASS } from "./sceneKit";

// A grid of small recessed glass panes on one vertical face — reads as
// windows from the aerial camera without needing texture maps. `width`/
// `height` are the face's own dimensions; the group is positioned/rotated
// by the caller to sit flush against whichever side of the building it
// belongs to.
function FaceWindows({ width, height, rows = 2, cols = 3 }) {
  const panes = useMemo(() => {
    const marginX = width * 0.14;
    const marginY = height * 0.18;
    const usableW = width - marginX * 2;
    const usableH = height - marginY * 2;
    const cellW = usableW / cols;
    const cellH = usableH / rows;
    const paneW = cellW * 0.72;
    const paneH = cellH * 0.66;
    const list = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = -usableW / 2 + cellW * (c + 0.5);
        const y = -usableH / 2 + cellH * (r + 0.5) + marginY - height / 2 + height / 2;
        list.push([x, -height / 2 + marginY + cellH * r + cellH / 2, paneW, paneH]);
      }
    }
    return list;
  }, [width, height, rows, cols]);

  return (
    <group position={[0, 0, 0.03]}>
      {panes.map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color={GLASS} roughness={0.25} metalness={0.4} transparent opacity={0.82} />
        </mesh>
      ))}
    </group>
  );
}

// Positions a FaceWindows grid flush against one of the building's four
// vertical sides.
function BuildingWindows({ size, faces = ["front", "left"], rows, cols }) {
  const [w, h, d] = size;
  const faceConfig = {
    front: { width: w, position: [0, h / 2, d / 2], rotation: [0, 0, 0] },
    back: { width: w, position: [0, h / 2, -d / 2], rotation: [0, Math.PI, 0] },
    left: { width: d, position: [-w / 2, h / 2, 0], rotation: [0, -Math.PI / 2, 0] },
    right: { width: d, position: [w / 2, h / 2, 0], rotation: [0, Math.PI / 2, 0] },
  };
  return (
    <>
      {faces.map((face) => {
        const cfg = faceConfig[face];
        if (!cfg) return null;
        const faceCols = cols ?? Math.max(1, Math.round(cfg.width / 1.1));
        const faceRows = rows ?? Math.max(1, Math.min(3, Math.round(h / 1.5)));
        return (
          <group key={face} position={cfg.position} rotation={cfg.rotation}>
            <FaceWindows width={cfg.width} height={h} rows={faceRows} cols={faceCols} />
          </group>
        );
      })}
    </>
  );
}

// A pitched (gable) roof: two tilted slabs meeting at a ridge running along
// the building's X axis. Approximate, not mitered — reads fine as a pitched
// silhouette from the aerial camera.
function GableRoof({ width, depth, rise = 0.8, color = STONE_DARK }) {
  const half = depth / 2;
  const slantLen = Math.sqrt(half * half + rise * rise);
  const angle = Math.atan2(rise, half);
  return (
    <group>
      {[1, -1].map((sign) => (
        <mesh key={sign} position={[0, rise / 2, (sign * half) / 2]} rotation={[sign * angle, 0, 0]} castShadow>
          <boxGeometry args={[width + 0.2, 0.08, slantLen]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// A single-slope shed roof, low edge at -Z, high edge at +Z.
function ShedRoof({ width, depth, rise = 0.7, color = STONE_DARK }) {
  const slantLen = Math.sqrt(depth * depth + rise * rise);
  const angle = Math.atan2(rise, depth);
  return (
    <mesh position={[0, rise / 2, 0]} rotation={[-angle, 0, 0]} castShadow>
      <boxGeometry args={[width + 0.2, 0.08, slantLen]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

// Repeating shed-roof teeth across the building's width — the classic
// industrial "sawtooth" silhouette.
function SawtoothRoof({ width, depth, teeth = 3, rise = 0.55, color = STONE_DARK }) {
  const toothWidth = width / teeth;
  return (
    <group>
      {Array.from({ length: teeth }).map((_, i) => (
        <group key={i} position={[-width / 2 + toothWidth * (i + 0.5), 0, 0]}>
          <ShedRoof width={toothWidth} depth={depth} rise={rise} color={color} />
        </group>
      ))}
    </group>
  );
}

// A ribbed/corrugated warehouse roof — evenly spaced parallel fins running
// the building's full depth, the datacenter-warehouse look (heatsink-like
// corrugation rather than a pitched silhouette).
export function WarehouseRoof({ width, depth, ribCount = 26, ribHeight = 0.22, color = STONE_DARK }) {
  const spacing = width / ribCount;
  const ribDepth = depth * 0.82;
  const ribZ = depth * 0.06;
  return (
    <group>
      {Array.from({ length: ribCount }).map((_, i) => (
        <mesh key={i} position={[-width / 2 + spacing * (i + 0.5), ribHeight / 2, ribZ]} castShadow>
          <boxGeometry args={[spacing * 0.5, ribHeight, ribDepth]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// A low loading-dock platform protruding from one side of the building at
// ground level.
export function LoadingDock({ width = 1.8, depth = 1, position = [0, 0] }) {
  return (
    <EdgeBox
      args={[width, 0.28, depth]}
      position={[position[0], 0.14, position[1]]}
      color={STONE_DARK}
      edgeOpacity={0.4}
      roughness={0.75}
    />
  );
}

// A raised perimeter lip on an otherwise flat roof.
export function ParapetRoof({ width, depth, color = STONE_DARK }) {
  const t = 0.12;
  const rim = 0.24;
  return (
    <group position={[0, rim / 2, 0]}>
      <EdgeBox args={[width + 0.1, rim, t]} position={[0, 0, depth / 2]} color={color} edgeOpacity={0.35} />
      <EdgeBox args={[width + 0.1, rim, t]} position={[0, 0, -depth / 2]} color={color} edgeOpacity={0.35} />
      <EdgeBox args={[t, rim, depth + 0.1]} position={[width / 2, 0, 0]} color={color} edgeOpacity={0.35} />
      <EdgeBox args={[t, rim, depth + 0.1]} position={[-width / 2, 0, 0]} color={color} edgeOpacity={0.35} />
    </group>
  );
}

function Roof({ type = "flat", width, depth }) {
  switch (type) {
    case "gable":
      return <GableRoof width={width} depth={depth} />;
    case "shed":
      return <ShedRoof width={width} depth={depth} />;
    case "sawtooth":
      return <SawtoothRoof width={width} depth={depth} />;
    case "parapet":
      return <ParapetRoof width={width} depth={depth} />;
    case "warehouse":
      return <WarehouseRoof width={width} depth={depth} />;
    default:
      return null;
  }
}

// A rooftop exhaust fan — cylinder housing + cone cap.
function RoofFan({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.42, 16]} />
        <meshStandardMaterial color={STONE_DEEP} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <coneGeometry args={[0.34, 0.2, 16]} />
        <meshStandardMaterial color={INK_DETAIL} roughness={0.5} />
      </mesh>
    </group>
  );
}

// A boxy rooftop AC/electrical unit with a few grille lines.
function RoofACUnit({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <EdgeBox args={[0.9, 0.5, 0.7]} position={[0, 0.25, 0]} color={STONE_DEEP} edgeOpacity={0.4} />
      {[-0.2, 0, 0.2].map((z) => (
        <mesh key={z} position={[0.46, 0.25, z]}>
          <boxGeometry args={[0.02, 0.3, 0.06]} />
          <meshStandardMaterial color={INK_DETAIL} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// A short vent/pipe stack.
function RoofVentStack({ position = [0, 0, 0], scale = 1 }) {
  return (
    <mesh position={[position[0], position[1] + 0.3, position[2]]} scale={scale} castShadow>
      <cylinderGeometry args={[0.08, 0.1, 0.6, 10]} />
      <meshStandardMaterial color={STONE_DEEP} roughness={0.55} />
    </mesh>
  );
}

const EQUIPMENT_KINDS = { fan: RoofFan, ac: RoofACUnit, vent: RoofVentStack };

export function RoofEquipment({ items = [], roofY }) {
  return (
    <>
      {items.map((item, i) => {
        const Kind = EQUIPMENT_KINDS[item.type] ?? RoofFan;
        return <Kind key={i} position={[item.offset[0], roofY, item.offset[1]]} scale={item.scale ?? 1} />;
      })}
    </>
  );
}

// A tall cylindrical building — silo/tank-massed, used for the compound's
// circular structures. Simple accent bands stand in for paneling detail
// since a grid of flat windows doesn't wrap a curved face cleanly.
function CylinderShell({ size, name }) {
  const [dia, h] = size;
  const r = dia / 2;
  const geometry = useMemo(() => new THREE.CylinderGeometry(r, r, h, 22), [r, h]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  return (
    <group>
      <mesh geometry={geometry} position={[0, h / 2, 0]} castShadow receiveShadow name={name}>
        <meshStandardMaterial color={STONE} roughness={0.8} metalness={0.03} />
      </mesh>
      <lineSegments geometry={edges} position={[0, h / 2, 0]}>
        <lineBasicMaterial color={INK} transparent opacity={0.22} />
      </lineSegments>
      {[0.32, 0.62, 0.88].map((f, i) => (
        <mesh key={i} position={[0, h * f, 0]}>
          <cylinderGeometry args={[r + 0.015, r + 0.015, 0.05, 22]} />
          <meshStandardMaterial color={STONE_DARK} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, h + 0.32, 0]} castShadow>
        <coneGeometry args={[r * 1.04, 0.62, 22]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.6} />
      </mesh>
    </group>
  );
}

// Twin residential towers sharing one footprint — Block 100's actual
// massing (2 towers, 15 stories each) rather than a single block.
function TowersShell({ size, name }) {
  const [totalW, h, d] = size;
  const gap = totalW * 0.22;
  const towerW = (totalW - gap) / 2;
  const offsetX = (towerW + gap) / 2;
  return (
    <group>
      {[-1, 1].map((side, i) => (
        <group key={side} position={[side * offsetX, 0, 0]}>
          <EdgeBox args={[towerW, h, d]} position={[0, h / 2, 0]} color={STONE} name={i === 0 ? name : undefined} />
          <BuildingWindows size={[towerW, h, d]} faces={["front", "back", "left", "right"]} rows={5} />
          <group position={[0, h, 0]}>
            <ParapetRoof width={towerW} depth={d} />
          </group>
        </group>
      ))}
    </group>
  );
}

// A podium base with a single slender tower centered on top — a hotel's
// classic massing (podium, "jump" lobby, guestroom tower).
function PodiumShell({ size, name }) {
  const [pw, totalH, pd] = size;
  const podiumH = Math.min(totalH * 0.28, 1.6);
  const towerH = totalH - podiumH;
  const towerW = pw * 0.52;
  const towerD = pd * 0.6;
  return (
    <group>
      <EdgeBox args={[pw, podiumH, pd]} position={[0, podiumH / 2, 0]} color={STONE} name={name} />
      <BuildingWindows size={[pw, podiumH, pd]} faces={["front", "left"]} rows={1} />
      <group position={[0, podiumH, 0]}>
        <ParapetRoof width={pw} depth={pd} />
      </group>
      <group position={[0, podiumH, 0]}>
        <EdgeBox args={[towerW, towerH, towerD]} position={[0, towerH / 2, 0]} color={STONE} />
        <BuildingWindows size={[towerW, towerH, towerD]} faces={["front", "back", "left", "right"]} rows={4} />
        <group position={[0, towerH, 0]}>
          <ParapetRoof width={towerW} depth={towerD} />
        </group>
      </group>
    </group>
  );
}

// A general-purpose compound building. Four shapes: a massed box (solid
// shell, a windowed facade or two, one of several roof silhouettes, and
// rooftop mechanical fixtures), a tall cylinder (silo-massed, accent bands
// instead of windows), twin towers, or a podium + tower. Enough variety
// across the cluster that it reads as a real campus instead of repeated
// boxes, while staying simple procedural geometry (no textures/materials
// beyond flat color + glass tint).
export default function DetailedBuilding({
  position,
  size = [2, 3, 2],
  shape = "box",
  roof = "flat",
  windowFaces = ["front", "left"],
  equipment = [],
  dock,
  annex,
  name,
}) {
  const [w, h, d] = size;

  if (shape === "cylinder") {
    return (
      <group position={[position[0], 0, position[1]]}>
        <CylinderShell size={size} name={name} />
        <RoofEquipment items={equipment} roofY={h + 0.62} />
      </group>
    );
  }

  if (shape === "towers") {
    return (
      <group position={[position[0], 0, position[1]]}>
        <TowersShell size={size} name={name} />
        <RoofEquipment items={equipment} roofY={h + 0.12} />
      </group>
    );
  }

  if (shape === "podium") {
    return (
      <group position={[position[0], 0, position[1]]}>
        <PodiumShell size={size} name={name} />
        <RoofEquipment items={equipment} roofY={h + 0.12} />
      </group>
    );
  }

  const roofEquipY = roof === "parapet" ? 0.1 : roof === "warehouse" ? 0.22 : 0.02;

  return (
    <group position={[position[0], 0, position[1]]}>
      <EdgeBox args={[w, h, d]} position={[0, h / 2, 0]} color={STONE} name={name} />
      <BuildingWindows size={size} faces={windowFaces} />
      {dock && <LoadingDock width={dock.width} depth={dock.depth} position={dock.position} />}
      {annex && (
        <group position={[annex.position[0], 0, annex.position[1]]}>
          <EdgeBox args={[annex.width, annex.height, annex.depth]} position={[0, annex.height / 2, 0]} color={STONE} />
          <BuildingWindows size={[annex.width, annex.height, annex.depth]} faces={["front"]} rows={1} />
          <group position={[0, annex.height, 0]}>
            <ParapetRoof width={annex.width} depth={annex.depth} />
          </group>
        </group>
      )}
      <group position={[0, h, 0]}>
        <Roof type={roof} width={w} depth={d} />
        <RoofEquipment items={equipment} roofY={roofEquipY} />
      </group>
    </group>
  );
}
