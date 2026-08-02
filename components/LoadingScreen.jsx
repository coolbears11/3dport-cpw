"use client";

import { useProgress } from "@react-three/drei";
import styles from "./LoadingScreen.module.css";

// Suspense fallback for the 3D scene. Nothing is asynchronous in the
// procedural placeholder environment, so this effectively never shows today —
// it exists as the integration point for the future .glb load.
export default function LoadingScreen() {
  const { progress, active } = useProgress();

  // useProgress starts inactive (nothing to load) when the scene is purely
  // procedural, as it is today — so "nothing active" alone means "done".
  if (!active) return null;

  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.label}>Loading environment</span>
      <span className={styles.value}>{Math.round(progress)}%</span>
    </div>
  );
}
