"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cameraSequence, cameraStops } from "@/data/cameraStops";

function smoothstep(t) {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

// Reads a scroll progress ref (0..1, updated by ScrollTrigger in
// ThreeExperience) and smoothly interpolates the camera through the
// ordered list of camera stops. Progress is deliberately read from a ref
// rather than React state so this can update every frame without
// re-rendering the component tree — that's what keeps the motion jitter-free.
export default function CameraRig({ progressRef }) {
  const { camera } = useThree();

  const stops = useMemo(() => cameraSequence.map((id) => cameraStops[id]), []);
  const segments = stops.length - 1;

  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const smoothedPos = useRef(new THREE.Vector3(...stops[0].position));
  const smoothedLookAt = useRef(new THREE.Vector3(...stops[0].target));
  const smoothedFov = useRef(stops[0].fov ?? 40);

  useFrame((_, delta) => {
    const progress = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const scaled = progress * segments;
    const segIndex = Math.min(Math.floor(scaled), segments - 1);
    const localT = smoothstep(scaled - segIndex);

    const from = stops[segIndex];
    const to = stops[segIndex + 1];

    targetPos.current.set(...from.position).lerp(
      new THREE.Vector3(...to.position),
      localT
    );
    targetLookAt.current.set(...from.target).lerp(
      new THREE.Vector3(...to.target),
      localT
    );
    const targetFov = THREE.MathUtils.lerp(from.fov ?? 40, to.fov ?? 40, localT);

    // Frame-rate independent damping: removes any residual step/jitter from
    // discrete scroll ticks without introducing a laggy "chase camera" feel.
    const damp = 1 - Math.pow(0.0025, delta);
    smoothedPos.current.lerp(targetPos.current, damp);
    smoothedLookAt.current.lerp(targetLookAt.current, damp);
    smoothedFov.current = THREE.MathUtils.lerp(smoothedFov.current, targetFov, damp);

    camera.position.copy(smoothedPos.current);
    camera.lookAt(smoothedLookAt.current);
    if (Math.abs(camera.fov - smoothedFov.current) > 0.01) {
      camera.fov = smoothedFov.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
