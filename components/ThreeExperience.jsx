"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "@/data/sections";
import { cameraSequence } from "@/data/cameraStops";
import CameraRig from "./CameraRig";
import PlaceholderEnvironment from "./PlaceholderEnvironment";
import Hotspots from "./Hotspots";
import ProjectChapter from "./ProjectChapter";
import ProjectDetailModal from "./ProjectDetailModal";
import LoadingScreen from "./LoadingScreen";
import styles from "./ThreeExperience.module.css";

const VH_PER_SEGMENT = 130;
const SEGMENTS = cameraSequence.length - 1;

// A single tall section pins its inner viewport-height wrapper for the
// duration of the whole camera sequence. One master ScrollTrigger drives
// everything:
// - progressRef feeds CameraRig (read inside useFrame, no React re-render)
// - each chapter's opacity/position is set imperatively on its DOM node,
//   centered on wherever its camera stop sits in the overall sequence —
//   not on an even index partition, since stops are no longer evenly
//   "one per chapter" (some stops are pure camera travel with no content,
//   and the two rack-view-1 cards share a single stop).
export default function ThreeExperience() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const chapterRefs = useRef([]);
  const progressRef = useRef(0);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const activeProject = chapters.find((chapter) => chapter.id === activeProjectId) ?? null;

  // Each chapter's center progress, plus a fade window (hold + entrance/exit
  // ramp) sized as a fraction of the *tightest* gap between any two
  // centers — so chapters never overlap-fade into each other even when some
  // camera stops sit much closer together in scroll-progress than others
  // (the two server-room beats sit one segment apart; the supporting-
  // building stops are more spread out). Bundled into one memo so the
  // effect below has a single stable dependency instead of mixing an array
  // with primitives.
  const windowConfig = useMemo(() => {
    const centers = chapters.map(
      (chapter) => cameraSequence.indexOf(chapter.cameraStop) / SEGMENTS
    );
    // Dedupe first: chapters meant to co-display (e.g. the two rack-view-1
    // cards) intentionally share a center, which is a zero gap, not the
    // "tightest real spacing" this window sizing needs to respect.
    const sorted = [...new Set(centers)].sort((a, b) => a - b);
    let minGap = Infinity;
    for (let i = 1; i < sorted.length; i += 1) {
      minGap = Math.min(minGap, sorted[i] - sorted[i - 1]);
    }
    if (!Number.isFinite(minGap) || minGap <= 0) minGap = 1;
    const fadeWindow = minGap * 0.45;
    return { centers, holdHalf: fadeWindow * 0.29, rampWidth: fadeWindow * 0.71 };
  }, []);

  // Hotspot markers should only be present while the camera is actually
  // over the compound — visible from the establishing shot through the
  // hero reveal, hidden for the entire server-room interior sequence (the
  // camera is inside a building then, markers hovering outside would read
  // as broken), then visible again once the camera returns to the compound
  // through to the final wide shot. Two independent windows, each with a
  // one-segment ramp.
  const hotspotFadeRanges = useMemo(() => {
    const ramp = 1 / SEGMENTS;
    return [
      { start: cameraSequence.indexOf("zoneAEstablish") / SEGMENTS, end: cameraSequence.indexOf("jttReveal") / SEGMENTS, ramp },
      { start: cameraSequence.indexOf("campusResume") / SEGMENTS, end: cameraSequence.indexOf("campusFarewell") / SEGMENTS, ramp },
    ];
  }, []);

  useEffect(() => {
    const { centers: chapterCenters, holdHalf, rampWidth } = windowConfig;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function applyChapterStyles(progress) {
      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        const center = chapterCenters[i];
        const d = progress - center;
        const ad = Math.abs(d);

        let opacity = 0;
        let y = d < 0 ? 28 : -28;

        if (ad <= holdHalf) {
          opacity = 1;
          y = 0;
        } else if (ad <= holdHalf + rampWidth) {
          const t = (ad - holdHalf) / rampWidth;
          opacity = 1 - t;
          y = (d < 0 ? 1 : -1) * 28 * t;
        }

        el.style.opacity = opacity;
        el.style.transform = `translateY(${y}px)`;
        el.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
      });
    }

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        scrub: reduceMotion ? true : 0.6,
        onUpdate(self) {
          progressRef.current = self.progress;
          applyChapterStyles(self.progress);
        },
      });

      applyChapterStyles(0);
      return () => trigger.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [windowConfig]);

  return (
    <section
      id="chapters"
      ref={sectionRef}
      className={styles.scrollContainer}
      style={{ height: `${SEGMENTS * VH_PER_SEGMENT}vh` }}
    >
      <div ref={pinRef} className={styles.pinned}>
        <Canvas
          className={styles.canvas}
          shadows="percentage"
          dpr={[1, 1.75]}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          camera={{ fov: 42, near: 0.1, far: 200 }}
        >
          {/* Suspense is the integration seam for the future .glb load —
              nothing here is actually async yet. */}
          <Suspense fallback={null}>
            <PlaceholderEnvironment />
            <Hotspots progressRef={progressRef} fadeRanges={hotspotFadeRanges} />
          </Suspense>
          <CameraRig progressRef={progressRef} />
        </Canvas>

        <LoadingScreen />

        <div className={styles.overlayLayer}>
          {chapters.map((chapter, index) => (
            <ProjectChapter
              key={chapter.id}
              ref={(el) => (chapterRefs.current[index] = el)}
              project={chapter}
              index={index}
              onOpenDetail={setActiveProjectId}
            />
          ))}
        </div>
      </div>

      <ProjectDetailModal project={activeProject} onClose={() => setActiveProjectId(null)} />
    </section>
  );
}
