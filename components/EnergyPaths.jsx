"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// Draws a neutral ground trace through a sequence of waypoints, with one or
// two small pulses of green light traveling along it — the "energy
// movement" placeholder. The base line stays neutral/static per the
// diagrammatic infrastructure-map language; only the traveling pulses read
// as "live" energy.
export default function EnergyPaths({
  waypoints,
  pulses = 2,
  lineColor = "#c8c2b3",
  pulseColor = "#3ef07f",
  lineOpacity = 0.35,
  lineWidth = 1.2,
  speed = 0.06,
}) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(waypoints.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.4),
    [waypoints]
  );

  const points = useMemo(() => curve.getPoints(120), [curve]);
  const pulseRefs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const offset = i / pulses;
      const progress = ((t * speed + offset) % 1 + 1) % 1;
      const point = curve.getPointAt(progress);
      mesh.position.copy(point);
    });
  });

  return (
    <group>
      <Line points={points} color={lineColor} transparent opacity={lineOpacity} lineWidth={lineWidth} />
      {Array.from({ length: pulses }).map((_, i) => (
        <mesh key={i} ref={(el) => (pulseRefs.current[i] = el)}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial
            color={pulseColor}
            emissive={pulseColor}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
