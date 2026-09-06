"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import EnergyPaths from "./EnergyPaths";
import DetailedBuilding from "./DetailedBuilding";
import HeroDataCenter from "./HeroDataCenter";
import Landscaping from "./Landscaping";
import GroundDots from "./GroundDots";
import {
  STONE,
  STONE_DARK,
  STONE_DEEP,
  INK_DETAIL,
  ACCENT,
  ACCENT_WIND,
  ACCENT_SOLAR,
  ACCENT_WATER,
  TRACE,
  SKY,
  GROUND,
  GRID,
  PLANT,
  PLANT_DEEP,
} from "./sceneKit";
import {
  ZONE_A_BUILDINGS,
  ZONE_A_TURBINES,
  ZONE_A_SOLAR_FIELD,
  ZONE_A_UTILITY_BLOCKS,
  ZONE_A_MERGE_POINT,
  ZONE_U_COOLING_TOWERS,
  ZONE_U_SUBSTATION,
  ZONE_U_TANKS,
  ZONE_U_FEEDS,
  ZONE_U_SWITCHYARD_NODE,
  TRUNK_WAYPOINTS,
  ZONE_A_TREES,
  ZONE_A_SHRUBS,
  ZONE_A_PATHS,
  ZONE_A_POND,
  ZONE_A_BRIDGE,
  MERGE_TO_HERO_WAYPOINTS,
} from "@/data/worldLayout";

const BLADE_LENGTH = 1.7;

// Which colour a feed pulses, by what generates it.
const FEED_COLORS = { wind: ACCENT_WIND, solar: ACCENT_SOLAR, water: ACCENT_WATER };

// Tapered blade profile — narrow root, a wide shoulder, tapering to a point
// at the tip — extruded thin. Built once and shared across every turbine
// instance since the shape never varies.
function createBladeGeometry() {
  const L = BLADE_LENGTH;
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.045);
  shape.lineTo(0, 0.045);
  shape.quadraticCurveTo(L * 0.2, 0.11, L * 0.45, 0.07);
  shape.lineTo(L * 0.92, 0.015);
  shape.lineTo(L, 0);
  shape.lineTo(L * 0.92, -0.015);
  shape.lineTo(L * 0.45, -0.07);
  shape.quadraticCurveTo(L * 0.2, -0.11, 0, -0.045);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: false });
  geometry.translate(0, 0, -0.0125);
  return geometry;
}
const bladeGeometry = createBladeGeometry();

function towerRadiusAt(f, rBottom, rTop) {
  return THREE.MathUtils.lerp(rBottom, rTop, f);
}

// Classic 3-blade wind turbine: a tapered, segmented tower (thin raised
// bands mark the segment joints), a hub, and tapered blades swept from a
// shared geometry so all three stay identical — only the whole group's
// rotation animates. Named to match the future Blender export
// (`turbine_0N_blades`).
function Turbine({ position = [0, 0], scale = 1, speed = 1, name }) {
  const bladesRef = useRef();
  const towerHeight = 4.6;
  const rBottom = 0.15;
  const rTop = 0.06;

  useFrame((_, delta) => {
    if (bladesRef.current) bladesRef.current.rotation.z += delta * speed;
  });

  return (
    <group position={[position[0], 0, position[1]]} scale={scale}>
      <mesh position={[0, towerHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[rTop, rBottom, towerHeight, 14]} />
        <meshStandardMaterial color={STONE} roughness={0.6} />
      </mesh>
      {[0.32, 0.64].map((f, i) => {
        const r = towerRadiusAt(f, rBottom, rTop) + 0.015;
        return (
          <mesh key={i} position={[0, towerHeight * f, 0]}>
            <cylinderGeometry args={[r, r, 0.05, 14]} />
            <meshStandardMaterial color={INK_DETAIL} roughness={0.5} />
          </mesh>
        );
      })}
      <mesh position={[0, towerHeight, 0.15]} castShadow>
        <boxGeometry args={[0.26, 0.24, 0.4]} />
        <meshStandardMaterial color={INK_DETAIL} roughness={0.5} />
      </mesh>
      <group ref={bladesRef} name={name} position={[0, towerHeight, 0.36]}>
        {[0, 120, 240].map((deg) => (
          <mesh key={deg} geometry={bladeGeometry} rotation={[0, 0, THREE.MathUtils.degToRad(deg)]} castShadow>
            <meshStandardMaterial color={STONE} roughness={0.45} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// A single PV module: a flat tilted panel with thin inset lines marking
// individual cells, so it reads as an actual solar panel rather than a
// blank tile.
function SolarPanel({ position }) {
  return (
    <group position={[position[0], 0.4, position[1]]} rotation={[-Math.PI / 5, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.04, 0.55]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.28} metalness={0.28} />
      </mesh>
      {[-0.28, 0, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.024, 0]}>
          <boxGeometry args={[0.012, 0.01, 0.53]} />
          <meshStandardMaterial color={ACCENT_SOLAR} transparent opacity={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.024, 0]}>
        <boxGeometry args={[0.88, 0.01, 0.012]} />
        <meshStandardMaterial color={ACCENT_SOLAR} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// A small tilted block of panels, all sharing one yaw so the block reads as
// a single oriented module.
function SolarCluster({ position, rows = 3, cols = 3, rotationY = 0 }) {
  const spacing = 1.05;
  const panels = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      panels.push([(c - (cols - 1) / 2) * spacing, (r - (rows - 1) / 2) * spacing]);
    }
  }
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      {panels.map((p, i) => (
        <SolarPanel key={i} position={p} />
      ))}
    </group>
  );
}

// A diagonal cascade of solar clusters, staggered along a line — the
// staircase-of-panel-blocks arrangement, spread across open ground rather
// than one dense grid hugging a single spot.
function SolarArray({ origin = [0, 0], step = [3, -2], count = 4, rows = 3, cols = 3, rotationY = 0 }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <SolarCluster
          key={i}
          position={[origin[0] + step[0] * i, origin[1] + step[1] * i]}
          rows={rows}
          cols={cols}
          rotationY={rotationY}
        />
      ))}
    </group>
  );
}

// A hyperbolic cooling tower: a flared lower shell and a slightly belled
// upper shell meeting at a waist, with a rim lip. Two stacked cylinders
// approximate the hyperboloid closely enough at this scale, and it gives
// the power field the tallest, most immediately readable silhouette on
// the site.
function CoolingTower({ position = [0, 0], scale = 1 }) {
  const lowerH = 3.2;
  const upperH = 1.5;
  const rBase = 1.85;
  const rWaist = 1.02;
  const rLip = 1.3;
  return (
    <group position={[position[0], 0, position[1]]} scale={scale}>
      <mesh position={[0, lowerH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[rWaist, rBase, lowerH, 28, 1, true]} />
        <meshStandardMaterial color={PLANT} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, lowerH + upperH / 2, 0]} castShadow>
        <cylinderGeometry args={[rLip, rWaist, upperH, 28, 1, true]} />
        <meshStandardMaterial color={PLANT} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* rim lip, and a recessed disc so the throat doesn't read hollow */}
      <mesh position={[0, lowerH + upperH, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rLip, 0.05, 8, 28]} />
        <meshStandardMaterial color={PLANT_DEEP} roughness={0.7} />
      </mesh>
      <mesh position={[0, lowerH + upperH - 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[rLip * 0.97, 28]} />
        <meshStandardMaterial color={PLANT_DEEP} roughness={0.95} />
      </mesh>
      {/* base skirt columns */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * rBase * 0.96, 0.22, Math.cos(a) * rBase * 0.96]}>
            <boxGeometry args={[0.12, 0.44, 0.12]} />
            <meshStandardMaterial color={PLANT_DEEP} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

// The switchyard: a fenced pad carrying transformer housings, lattice
// gantries and insulator stacks. This is where every feed in the power
// field is collected before the trunk line leaves for the compound.
function Substation({ position = [0, 0], rotationY = 0 }) {
  const padW = 5.4;
  const padD = 3.6;
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[padW, padD]} />
        <meshStandardMaterial color={PLANT_DEEP} roughness={0.95} />
      </mesh>
      {/* transformer housings */}
      {[-1.5, 0.1, 1.7].map((x, i) => (
        <group key={x} position={[x, 0, -0.6]}>
          <EdgeBox args={[1.05, 0.95, 1.1]} position={[0, 0.48, 0]} color={PLANT} edgeOpacity={0.32} />
          {/* radiator fins */}
          {[-0.42, -0.14, 0.14, 0.42].map((z) => (
            <mesh key={z} position={[0.58, 0.48, z]}>
              <boxGeometry args={[0.1, 0.7, 0.06]} />
              <meshStandardMaterial color={PLANT_DEEP} roughness={0.6} />
            </mesh>
          ))}
          {/* bushings */}
          {[-0.28, 0.28].map((z) => (
            <mesh key={z} position={[0, 1.16, z]}>
              <cylinderGeometry args={[0.07, 0.1, 0.44, 10]} />
              <meshStandardMaterial color={INK_DETAIL} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      {/* lattice gantry spanning the pad */}
      {[-2.2, 2.2].map((x) => (
        <mesh key={x} position={[x, 1.1, 1.1]}>
          <boxGeometry args={[0.12, 2.2, 0.12]} />
          <meshStandardMaterial color={INK_DETAIL} roughness={0.55} />
        </mesh>
      ))}
      <mesh position={[0, 2.14, 1.1]}>
        <boxGeometry args={[4.5, 0.1, 0.1]} />
        <meshStandardMaterial color={INK_DETAIL} roughness={0.55} />
      </mesh>
      {/* insulator stacks hanging from the gantry */}
      {[-1.5, 0, 1.5].map((x) => (
        <mesh key={x} position={[x, 1.72, 1.1]}>
          <cylinderGeometry args={[0.05, 0.05, 0.72, 8]} />
          <meshStandardMaterial color={PLANT_DEEP} roughness={0.5} />
        </mesh>
      ))}
      {/* perimeter fence posts */}
      {Array.from({ length: 10 }).map((_, i) => {
        const t = i / 10;
        const per = 2 * (padW + padD);
        const d = t * per;
        let x, z;
        if (d < padW) { x = -padW / 2 + d; z = -padD / 2; }
        else if (d < padW + padD) { x = padW / 2; z = -padD / 2 + (d - padW); }
        else if (d < 2 * padW + padD) { x = padW / 2 - (d - padW - padD); z = padD / 2; }
        else { x = -padW / 2; z = padD / 2 - (d - 2 * padW - padD); }
        return (
          <mesh key={i} position={[x, 0.34, z]}>
            <boxGeometry args={[0.05, 0.68, 0.05]} />
            <meshStandardMaterial color={INK_DETAIL} transparent opacity={0.6} roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

// Squat storage tanks with a domed cap and a banding ring.
function StorageTank({ position = [0, 0], radius = 1.2, height = 1.6 }) {
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 22]} />
        <meshStandardMaterial color={PLANT} roughness={0.8} />
      </mesh>
      <mesh position={[0, height * 0.62, 0]}>
        <cylinderGeometry args={[radius + 0.02, radius + 0.02, 0.06, 22]} />
        <meshStandardMaterial color={PLANT_DEEP} roughness={0.6} />
      </mesh>
      <mesh position={[0, height, 0]} castShadow>
        <sphereGeometry args={[radius, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={PLANT} roughness={0.8} />
      </mesh>
    </group>
  );
}

// A small equipment block — utility clutter that reads as "inhabited site"
// without adding architectural detail.
function UtilityBlock({ position, size = [1, 1, 1] }) {
  return (
    <mesh position={[position[0], size[1] / 2, position[1]]} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={STONE_DEEP} roughness={0.7} metalness={0.03} />
    </mesh>
  );
}

// A thin, neutral, static ground trace — the diagrammatic "wiring" that
// makes the compound read as a connected system even where no energy is
// actively animated along it.
function GroundTrace({ points }) {
  return <Line points={points} color={TRACE} transparent opacity={0.3} lineWidth={1} />;
}

// A large, sparse blueprint-style grid lying flat on the ground, reinforcing
// the "site plan / infrastructure map" reading from the aerial camera.
function GroundGrid({ size = 280, divisions = 52, position = [0, 0.01, 0] }) {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(size, divisions, GRID, GRID);
    g.material.transparent = true;
    g.material.opacity = 0.2;
    g.position.set(...position);
    return g;
  }, [size, divisions, position]);
  return <primitive object={grid} />;
}

// One compound, one flagship story: JTT Gigascale (project04, the anchor
// building) is rendered by HeroDataCenter with its interior server room;
// every other building is a standard DetailedBuilding. Which ones carry a
// project card is entirely a data/sections.js concern — every building
// here renders regardless, so the compound always reads as a full campus.
export default function PlaceholderEnvironment() {
  const zoneATraceWaypoints = ZONE_A_BUILDINGS.map(({ position }) => [
    [position[0], 0.05, position[1]],
    ZONE_A_MERGE_POINT,
  ]);

  return (
    <group>
      <color attach="background" args={[SKY]} />
      {/* Fog pushed well out: the power field sits ~48 units from the
          compound and both have to stay legible from a mid-trunk camera. */}
      <fog attach="fog" args={[SKY, 90, 260]} />

      <ambientLight intensity={0.68} />
      <hemisphereLight args={["#ffffff", GROUND, 0.5]} />
      <directionalLight
        position={[24, 34, 18]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-far={90}
      />

      {/* ground — sized generously beyond the camera's route so no edge is
          ever visible from the aerial framing. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 200]} />
        <meshStandardMaterial color={GROUND} roughness={0.95} />
      </mesh>
      <GroundGrid />
      {/* Two dot fields, not three. Each one is a large per-point draw and
          tripling them was a meaningful share of the memory blowup. The
          ground the trunk crosses is meant to read as empty anyway. */}
      <GroundDots width={64} depth={64} center={[0, 0]} />
      <GroundDots width={46} depth={40} center={[-50, -6]} />

      {/* future .glb integration point: replace everything below with
          <InfrastructureModel /> loading /public/models/infrastructure.glb
          once the Blender asset exists. Named groups/meshes
          (building_project_0N, turbine_0N_blades) already match what that
          file is expected to contain. */}

      {/* --- the compound: 7 buildings, one of which (project04, JTT
          Gigascale) is the hero and carries the interior server room. --- */}
      {ZONE_A_BUILDINGS.map((b) =>
        b.id === "project04" ? (
          <HeroDataCenter
            key={b.id}
            position={b.position}
            size={b.size}
            dock={b.dock}
            equipment={b.equipment}
            rackRows={b.rackRows}
            racksPerRow={b.racksPerRow}
            name={`building_${b.id}`}
          />
        ) : (
          <DetailedBuilding
            key={b.id}
            position={b.position}
            size={b.size}
            shape={b.shape}
            roof={b.roof}
            windowFaces={b.windowFaces}
            equipment={b.equipment}
            dock={b.dock}
            annex={b.annex}
            split={b.split}
            name={`building_${b.id}`}
          />
        )
      )}
      {/* --- LAYER 1: the power field, far west of the compound --- */}
      {ZONE_A_TURBINES.map((t) => (
        <Turbine key={t.name} position={t.position} scale={t.scale} speed={t.speed} name={t.name} />
      ))}
      {ZONE_U_COOLING_TOWERS.map((c, i) => (
        <CoolingTower key={i} position={c.position} scale={c.scale} />
      ))}
      <Substation position={ZONE_U_SUBSTATION.position} rotationY={ZONE_U_SUBSTATION.rotationY} />
      {ZONE_U_TANKS.map((t, i) => (
        <StorageTank key={i} position={t.position} radius={t.radius} height={t.height} />
      ))}
      <SolarArray
        origin={ZONE_A_SOLAR_FIELD.origin}
        step={ZONE_A_SOLAR_FIELD.step}
        count={ZONE_A_SOLAR_FIELD.count}
        rows={ZONE_A_SOLAR_FIELD.rows}
        cols={ZONE_A_SOLAR_FIELD.cols}
        rotationY={ZONE_A_SOLAR_FIELD.rotationY}
      />
      {ZONE_A_UTILITY_BLOCKS.map((u, i) => (
        <UtilityBlock key={i} position={u.position} size={u.size} />
      ))}
      <Landscaping
        trees={ZONE_A_TREES}
        shrubs={ZONE_A_SHRUBS}
        paths={ZONE_A_PATHS}
        pond={ZONE_A_POND}
        bridge={ZONE_A_BRIDGE}
      />

      {/* Buildings connect to the merge point with static neutral traces —
          they consume, they don't generate. */}
      {zoneATraceWaypoints.map((pts, i) => (
        <GroundTrace key={i} points={pts.map((p) => new THREE.Vector3(...p))} />
      ))}

      {/* Layer 1 internal feeds: each generation source gathers to the
          switchyard, colour-coded by what makes the power. Routed through
          a dogleg so they read as easements following property lines
          rather than as spokes on a wheel. */}
      {ZONE_U_FEEDS.map((f, i) => (
        <EnergyPaths
          key={`ufeed-${i}`}
          waypoints={[f.from, f.via, ZONE_U_SWITCHYARD_NODE]}
          lineColor={TRACE}
          lineOpacity={0.4}
          lineWidth={1.1}
          pulseColor={FEED_COLORS[f.type] ?? ACCENT_WIND}
          pulses={2}
          speed={0.05}
        />
      ))}

      {/* THE TRUNK: Layer 1 to Layer 2. The single longest element in the
          scene, and the thing that makes two distant zones read as one
          system. Wider and brighter than the feeds that fill it. */}
      <EnergyPaths
        waypoints={TRUNK_WAYPOINTS}
        lineColor={TRACE}
        lineOpacity={0.62}
        lineWidth={2.2}
        pulseColor={ACCENT}
        pulses={4}
        speed={0.055}
      />

      {/* The last few metres, into the hero building itself. */}
      <EnergyPaths
        waypoints={MERGE_TO_HERO_WAYPOINTS}
        lineColor={TRACE}
        lineOpacity={0.7}
        lineWidth={2}
        pulseColor={ACCENT}
        pulses={2}
        speed={0.14}
      />
    </group>
  );
}
