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
// industrial "sawtooth" silhouette. Each tooth slopes across its own
// width (a short run, so the pitch actually reads from the air) rather
// than across the building's full depth, and the tall edge of each tooth
// carries a glazed north-light riser, which is the whole point of a
// sawtooth roof.
function SawtoothRoof({ width, depth, teeth = 4, rise = 0.5, color = STONE_DARK }) {
  const toothWidth = width / teeth;
  const slantLen = Math.sqrt(toothWidth * toothWidth + rise * rise);
  const angle = Math.atan2(rise, toothWidth);
  return (
    <group>
      {Array.from({ length: teeth }).map((_, i) => (
        <group key={i} position={[-width / 2 + toothWidth * (i + 0.5), 0, 0]}>
          <mesh position={[0, rise / 2, 0]} rotation={[0, 0, -angle]} castShadow>
            <boxGeometry args={[slantLen, 0.07, depth]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[toothWidth / 2, rise / 2, 0]}>
            <boxGeometry args={[0.05, rise, depth * 0.94]} />
            <meshStandardMaterial color={GLASS} roughness={0.25} metalness={0.4} transparent opacity={0.7} />
          </mesh>
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
function TowersShell({ size, name, equipment = [] }) {
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
            {/* mechanical rides the left tower's roof. Offsets are relative
                to that roof, not the overall footprint — at the footprint
                centre it would hang in the gap between the two towers. */}
            {i === 0 && <RoofEquipment items={equipment} roofY={0.02} />}
          </group>
        </group>
      ))}
    </group>
  );
}

// A low parking podium carrying a guestroom block that steps back only
// slightly, plus a rooftop deck — an urban hotel on a tight lot, which is
// what the Moxy actually is (7 storeys, 163 keys, two garage levels, a
// roof bar). An earlier version made the upper block barely half the
// podium width, which read as a slender tower on a wide slab.
function PodiumShell({ size, name, equipment = [] }) {
  const [pw, totalH, pd] = size;
  const podiumH = totalH * 0.3;
  const towerH = totalH - podiumH;
  const towerW = pw * 0.9;
  const towerD = pd * 0.88;
  const deckW = towerW * 0.62;
  const deckD = towerD * 0.55;
  return (
    <group>
      {/* two-level parking podium */}
      <EdgeBox args={[pw, podiumH, pd]} position={[0, podiumH / 2, 0]} color={STONE} name={name} />
      <BuildingWindows size={[pw, podiumH, pd]} faces={["front", "left"]} rows={2} />

      {/* guestroom block, stepped back slightly on all sides */}
      <group position={[0, podiumH, 0]}>
        {/* mechanical sits on the podium roof, in the setback strip */}
        <RoofEquipment items={equipment} roofY={0.02} />
        <EdgeBox args={[towerW, towerH, towerD]} position={[0, towerH / 2, 0]} color={STONE} />
        <BuildingWindows size={[towerW, towerH, towerD]} faces={["front", "back", "left", "right"]} rows={5} />
        <group position={[0, towerH, 0]}>
          <ParapetRoof width={towerW} depth={towerD} />
          {/* roof deck — the rooftop bar */}
          <mesh position={[0, 0.03, deckD * 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[deckW, deckD]} />
            <meshStandardMaterial color={STONE_DARK} roughness={0.85} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Two separate volumes with open ground between them, joined by a low
// glazed link — the B648 Vestibule's actual arrangement, where the
// vestibule is the connector rather than a wing tacked onto one side.
// `split` tunes the pairing: `gap` is the clear distance between the two
// volumes, `ratio` how the remaining width divides between them, and
// `heightRatio` / `depthRatio` size the second volume against the first.
function SplitShell({ size, name, roof = "flat", windowFaces = [], equipment = [], split = {} }) {
  const [w, h, d] = size;
  const gap = split.gap ?? w * 0.16;
  const ratio = split.ratio ?? 0.5;
  const hB = h * (split.heightRatio ?? 1);
  const dB = d * (split.depthRatio ?? 1);
  const solid = w - gap;
  const wA = solid * ratio;
  const wB = solid - wA;
  const xA = -w / 2 + wA / 2;
  const xB = w / 2 - wB / 2;

  const linkW = gap + 0.4;
  const linkH = split.linkHeight ?? Math.min(h, hB) * 0.62;
  const linkD = split.linkDepth ?? d * 0.42;
  const sillH = linkH * 0.22;

  return (
    <group>
      {/* volume A — the larger hall */}
      <group position={[xA, 0, 0]}>
        <EdgeBox args={[wA, h, d]} position={[0, h / 2, 0]} color={STONE} name={name} />
        <BuildingWindows size={[wA, h, d]} faces={windowFaces} />
        <group position={[0, h, 0]}>
          <Roof type={roof} width={wA} depth={d} />
          <RoofEquipment items={equipment} roofY={roof === "flat" ? 0.02 : 0.04} />
        </group>
      </group>

      {/* volume B */}
      <group position={[xB, 0, 0]}>
        <EdgeBox args={[wB, hB, dB]} position={[0, hB / 2, 0]} color={STONE} />
        <BuildingWindows size={[wB, hB, dB]} faces={windowFaces} />
        <group position={[0, hB, 0]}>
          <Roof type={roof} width={wB} depth={dB} />
        </group>
      </group>

      {/* the vestibule itself — solid sill, glazed above, own parapet */}
      <group position={[(xA + wA / 2 + xB - wB / 2) / 2, 0, 0]}>
        <EdgeBox args={[linkW, sillH, linkD]} position={[0, sillH / 2, 0]} color={STONE_DARK} edgeOpacity={0.4} />
        <EdgeBox
          args={[linkW, linkH - sillH, linkD]}
          position={[0, sillH + (linkH - sillH) / 2, 0]}
          color={GLASS}
          roughness={0.2}
          metalness={0.45}
          transparent
          opacity={0.42}
          edgeOpacity={0.35}
        />
        <group position={[0, linkH, 0]}>
          <ParapetRoof width={linkW} depth={linkD} />
        </group>
      </group>
    </group>
  );
}

// A general-purpose compound building. Five shapes: a massed box (solid
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
  split,
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
        <TowersShell size={size} name={name} equipment={equipment} />
      </group>
    );
  }

  if (shape === "podium") {
    return (
      <group position={[position[0], 0, position[1]]}>
        <PodiumShell size={size} name={name} equipment={equipment} />
      </group>
    );
  }

  if (shape === "split") {
    return (
      <group position={[position[0], 0, position[1]]}>
        <SplitShell
          size={size}
          name={name}
          roof={roof}
          windowFaces={windowFaces}
          equipment={equipment}
          split={split}
        />
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
