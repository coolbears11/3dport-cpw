"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERTEX_SHADER = `
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    vec4 mvPosition = viewMatrix * worldPosition;
    gl_PointSize = 5.5;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vWorldPos;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.3, d);
    float waveA = sin(vWorldPos.z * 0.34 - uTime * 1.1) * 0.5 + 0.5;
    float waveB = sin(vWorldPos.x * 0.22 + uTime * 0.55) * 0.5 + 0.5;
    float wave = waveA * 0.65 + waveB * 0.35;
    float alpha = edge * mix(0.04, 0.5, wave);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// A large field of small dots across the ground, their opacity driven by a
// slow two-axis sine wave so the grid appears/disappears in a traveling
// ripple rather than sitting static — the "dynamic ground texture" layer,
// on top of the static blueprint grid lines.
export default function GroundDots({
  width = 90,
  depth = 150,
  center = [0, -45],
  spacing = 2.2,
  color = "#b5afa0",
}) {
  const materialRef = useRef();

  const geometry = useMemo(() => {
    const positions = [];
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(depth / spacing);
    for (let i = 0; i <= cols; i += 1) {
      for (let j = 0; j <= rows; j += 1) {
        const x = center[0] - width / 2 + i * spacing;
        const z = center[1] - depth / 2 + j * spacing;
        positions.push(x, 0.02, z);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [width, depth, center[0], center[1], spacing]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color]
  );

  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
