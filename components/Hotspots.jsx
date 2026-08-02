"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { ZONE_A_BUILDINGS } from "@/data/worldLayout";
import { hotspotBuildingOrder } from "@/data/sections";
import styles from "./Hotspots.module.css";

function rangeOpacity(p, { start, end, ramp }) {
  if (p >= start && p <= end) return 1;
  if (p < start && p > start - ramp) return 1 - (start - p) / ramp;
  if (p > end && p < end + ramp) return 1 - (p - end) / ramp;
  return 0;
}

// One circular marker per project-bearing building — JTT (01) plus the
// four supporting projects, in that order. Buildings with no project
// assigned (see data/sections.js) get no marker at all. Visibility is
// faded in/out imperatively across two windows: before the user enters
// the hero's server room, and again after they return to the compound —
// markers stay hidden while the camera is inside the building.
export default function Hotspots({ progressRef, fadeRanges }) {
  const refs = useRef([]);
  const buildings = useMemo(
    () => hotspotBuildingOrder.map((id) => ZONE_A_BUILDINGS.find((b) => b.id === id)).filter(Boolean),
    []
  );

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const opacity = Math.max(...fadeRanges.map((range) => rangeOpacity(p, range)));

    refs.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = opacity;
      el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
    });
  });

  return (
    <>
      {buildings.map((b, i) => (
        <Html
          key={b.id}
          position={[b.position[0], b.size[1] + 0.9, b.position[1]]}
          center
          zIndexRange={[10, 0]}
          occlude={false}
        >
          <div
            ref={(el) => (refs.current[i] = el)}
            className={i === 0 ? `${styles.hotspot} ${styles.hero}` : styles.hotspot}
            style={{ opacity: 0 }}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
          </div>
        </Html>
      ))}
    </>
  );
}
