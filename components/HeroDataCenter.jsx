"use client";

import { EdgeBox, STONE, STONE_DARK, INK_DETAIL, ACCENT, GLASS } from "./sceneKit";
import { WarehouseRoof, LoadingDock, RoofEquipment } from "./DetailedBuilding";

const FLOOR = "#e7e3d8";

// A single server rack: body, drawer-slot lines, a couple of status LEDs —
// enough shape to read clearly as a rack without heavy detail. Detail is
// mirrored onto both the +Z and -Z faces so a row of these reads correctly
// whether the camera is north at the glass wall or south in the open floor
// area looking across the room — the interior camera stops use both.
function RackUnit({ position, name }) {
  const slotYs = [0.35, 0.65, 0.95, 1.25, 1.55, 1.85];
  const ledYs = [0.5, 1.1, 1.7];
  return (
    <group position={position} name={name}>
      <EdgeBox args={[0.82, 2.2, 0.72]} position={[0, 1.1, 0]} color={STONE_DARK} edgeOpacity={0.4} />
      {[0.37, -0.37].map((z) => (
        <group key={z}>
          {slotYs.map((y, i) => (
            <mesh key={i} position={[0, y, z]}>
              <boxGeometry args={[0.62, 0.05, 0.02]} />
              <meshStandardMaterial color={INK_DETAIL} roughness={0.4} />
            </mesh>
          ))}
          {ledYs.map((y, i) => (
            <mesh key={i} position={[Math.sign(z) * 0.28, y, z * 1.03]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={2.2} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// The hero building — JTT Gigascale. Same warehouse shell language as the
// rest of the compound (ribbed roof, loading dock) so it reads as part of
// the same campus, but one wall is glazed and mullioned to reveal rows of
// compound server racks inside — the "server room" now lives inside the
// hero building itself rather than in a separate compound down the road.
export default function HeroDataCenter({ position, size, equipment = [], dock, rackRows = 2, racksPerRow = 6, name }) {
  const [w, h, d] = size;
  const wallT = 0.2;
  const mullionCount = 6;
  const mullionSpacing = (w - 0.6) / (mullionCount - 1);

  return (
    <group position={[position[0], 0, position[1]]}>
      {/* solid shell: south, east, west */}
      <EdgeBox args={[w, h, wallT]} position={[0, h / 2, -d / 2 + wallT / 2]} color={STONE} name={name} />
      <EdgeBox args={[wallT, h, d]} position={[-w / 2 + wallT / 2, h / 2, 0]} color={STONE} />
      <EdgeBox args={[wallT, h, d]} position={[w / 2 - wallT / 2, h / 2, 0]} color={STONE} />
      {dock && <LoadingDock width={dock.width} depth={dock.depth} position={dock.position} />}

      {/* glazed north wall */}
      <EdgeBox
        args={[w - 0.1, h - 0.1, 0.06]}
        position={[0, h / 2, d / 2 - 0.05]}
        color={GLASS}
        roughness={0.15}
        metalness={0.5}
        transparent
        opacity={0.36}
        edgeOpacity={0.3}
      />
      {Array.from({ length: mullionCount }).map((_, i) => (
        <mesh key={i} position={[-mullionSpacing * ((mullionCount - 1) / 2) + i * mullionSpacing, h / 2, d / 2 + 0.02]}>
          <boxGeometry args={[0.04, h - 0.1, 0.03]} />
          <meshStandardMaterial color={INK_DETAIL} roughness={0.4} transparent opacity={0.5} />
        </mesh>
      ))}
      <mesh position={[0, h * 0.56, d / 2 + 0.02]}>
        <boxGeometry args={[w - 0.1, 0.05, 0.03]} />
        <meshStandardMaterial color={INK_DETAIL} roughness={0.4} transparent opacity={0.5} />
      </mesh>

      {/* interior floor, visible through the glass */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w - 0.3, d - 0.3]} />
        <meshStandardMaterial color={FLOOR} roughness={0.9} />
      </mesh>

      {/* compound rack rows, front detail facing the glass */}
      {Array.from({ length: rackRows }).map((_, r) => {
        const rowZ = d / 2 - 0.65 - r * 1.15;
        const spacing = (w - 1.4) / (racksPerRow - 1);
        return Array.from({ length: racksPerRow }).map((_, i) => (
          <RackUnit
            key={`${r}-${i}`}
            position={[-((racksPerRow - 1) * spacing) / 2 + i * spacing, 0, rowZ]}
            name={`rack_${r}_${i}`}
          />
        ));
      })}

      {/* opaque roof deck — the rack reveal happens through the glazed north
          wall only, not through an open top — plus the same ribbed
          warehouse roof and rooftop fixtures as the building's earlier
          exterior-only design. */}
      <mesh position={[0, h, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      <group position={[0, h, 0]}>
        <WarehouseRoof width={w} depth={d} />
        <RoofEquipment items={equipment} roofY={0.22} />
      </group>
    </group>
  );
}
