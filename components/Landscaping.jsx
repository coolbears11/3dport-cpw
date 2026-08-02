"use client";

import { EdgeBox, INK_DETAIL, FOLIAGE, FOLIAGE_DARK, WATER, PATH, STONE_DEEP } from "./sceneKit";

// Small, stylized site-plan dressing — trees, shrubs, a paved path, a pond,
// a footbridge. Kept deliberately toy-scaled and low-poly so it reads as
// "landscaping accents on a blueprint" rather than a realistic terrain.

function Tree({ position, scale = 1 }) {
  return (
    <group position={[position[0], 0, position[1]]} scale={scale}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 0.56, 8]} />
        <meshStandardMaterial color={INK_DETAIL} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <coneGeometry args={[0.34, 0.62, 10]} />
        <meshStandardMaterial color={FOLIAGE} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.98, 0]} castShadow>
        <coneGeometry args={[0.24, 0.44, 10]} />
        <meshStandardMaterial color={FOLIAGE_DARK} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Shrub({ position, scale = 1 }) {
  return (
    <group position={[position[0], 0.16, position[1]]} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial color={FOLIAGE} roughness={0.9} />
      </mesh>
      <mesh position={[0.16, -0.05, 0.08]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={FOLIAGE_DARK} roughness={0.9} />
      </mesh>
    </group>
  );
}

// A thin paved strip between two points — decorative walking path, not a
// navigable system.
function PathSegment({ from, to, width = 0.55 }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[1] + to[1]) / 2;
  return (
    <mesh position={[midX, 0.015, midZ]} rotation={[-Math.PI / 2, angle, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color={PATH} roughness={0.95} />
    </mesh>
  );
}

// A small flat pond — soft blue-grey, slightly glossy, sized to read as a
// site-plan water feature rather than a lake.
function Pond({ position, radius = 1.3 }) {
  return (
    <mesh position={[position[0], 0.018, position[1]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[radius, 24]} />
      <meshStandardMaterial color={WATER} roughness={0.15} metalness={0.2} />
    </mesh>
  );
}

// A small footbridge deck with two rail lines, spanning a pond or path
// crossing.
function Bridge({ position, length = 2.4, rotationY = 0 }) {
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      <EdgeBox args={[0.7, 0.1, length]} position={[0, 0.09, 0]} color={STONE_DEEP} edgeOpacity={0.4} roughness={0.7} />
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.24, 0]}>
          <boxGeometry args={[0.04, 0.28, length]} />
          <meshStandardMaterial color={INK_DETAIL} transparent opacity={0.55} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function Landscaping({ trees = [], shrubs = [], paths = [], pond, bridge }) {
  return (
    <group>
      {trees.map((t, i) => (
        <Tree key={i} position={t.position} scale={t.scale ?? 1} />
      ))}
      {shrubs.map((s, i) => (
        <Shrub key={i} position={s.position} scale={s.scale ?? 1} />
      ))}
      {paths.map((p, i) => (
        <PathSegment key={i} from={p.from} to={p.to} width={p.width} />
      ))}
      {pond && <Pond position={pond.position} radius={pond.radius} />}
      {bridge && <Bridge position={bridge.position} length={bridge.length} rotationY={bridge.rotationY ?? 0} />}
    </group>
  );
}
