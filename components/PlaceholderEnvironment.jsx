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
import { STONE, STONE_DARK, STONE_DEEP, INK_DETAIL, ACCENT, TRACE } from "./sceneKit";
import {
  ZONE_A_BUILDINGS,
  ZONE_A_TURBINES,
  ZONE_A_SOLAR_FIELD,
  ZONE_A_UTILITY_BLOCKS,
  ZONE_A_MERGE_POINT,
  ZONE_A_TREES,
  ZONE_A_SHRUBS,
  ZONE_A_PATHS,
  ZONE_A_POND,
  ZONE_A_BRIDGE,
  MERGE_TO_HERO_WAYPOINTS,
} from "@/data/worldLayout";

const BLADE_LENGTH = 1.7;

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
        <meshStandardMaterial color={STONE_DARK} roughness={0.3} metalness={0.2} />
      </mesh>
      {[-0.28, 0, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.024, 0]}>
          <boxGeometry args={[0.012, 0.01, 0.53]} />
          <meshStandardMaterial color={INK_DETAIL} transparent opacity={0.32} />
        </mesh>
      ))}
      <mesh position={[0, 0.024, 0]}>
        <boxGeometry args={[0.88, 0.01, 0.012]} />
        <meshStandardMaterial color={INK_DETAIL} transparent opacity={0.32} />
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
function GroundGrid({ size = 180, divisions = 48, position = [0, 0.01, 0] }) {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(size, divisions, STONE_DEEP, STONE_DEEP);
    g.material.transparent = true;
    g.material.opacity = 0.16;
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
      <color attach="background" args={[STONE]} />
      <fog attach="fog" args={[STONE, 50, 150]} />

      <ambientLight intensity={0.65} />
      <hemisphereLight args={["#ffffff", STONE_DEEP, 0.5]} />
      <directionalLight
        position={[24, 34, 18]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-far={90}
      />

      {/* ground — sized generously beyond the camera's route so no edge is
          ever visible from the aerial framing. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color={STONE} roughness={0.95} />
      </mesh>
      <GroundGrid />
      <GroundDots width={70} depth={70} center={[0, 0]} />

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
            name={`building_${b.id}`}
          />
        )
      )}
      {ZONE_A_TURBINES.map((t) => (
        <Turbine key={t.name} position={t.position} scale={t.scale} speed={t.speed} name={t.name} />
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

      {/* static neutral traces linking each building to the compound's
          merge point, plus a short animated stub carrying the signal the
          rest of the way into the hero building — "everything feeds JTT." */}
      {zoneATraceWaypoints.map((pts, i) => (
        <GroundTrace key={i} points={pts.map((p) => new THREE.Vector3(...p))} />
      ))}
      <EnergyPaths
        waypoints={MERGE_TO_HERO_WAYPOINTS}
        lineColor={TRACE}
        lineOpacity={0.5}
        lineWidth={1.4}
        pulseColor={ACCENT}
        pulses={1}
        speed={0.08}
      />
    </group>
  );
}
