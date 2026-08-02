"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroVideo.module.css";

const VIDEO_SRC = "/videos/hero-construction.mp4";
const POSTER_SRC = "/images/hero-poster.svg";

const CREDENTIALS = [
  "B.S. Construction Engineering",
  "Cal Poly Pomona",
  "Electrical Trade Foundations",
  "Rio Hondo College",
];

export default function HeroVideo() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    video.play().catch(() => {
      // autoplay can be blocked by the browser; poster stays visible
    });
  }, []);

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.mediaWrap}>
        {!videoFailed && (
          <video
            ref={videoRef}
            className={styles.video}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoFailed(true)}
          />
        )}
        {videoFailed && (
          <img
            className={styles.video}
            src={POSTER_SRC}
            alt=""
            aria-hidden="true"
          />
        )}
        <div className={styles.overlay} />
        <div className={styles.vignette} />
      </div>

      <div className={styles.content}>
        <div className={styles.textBlock}>
          <p className={`eyebrow-label ${styles.eyebrow}`}>
            Jason Lou / Portfolio
          </p>
          <h1 className={styles.headline}>
            Construction &amp;
            <br />
            Engineering.
          </h1>
          <p className={styles.lede}>
            Power, site intelligence, preconstruction, estimating, and
            digital execution for energy-intensive and mission-critical
            projects.
          </p>

          <div className={styles.divider} role="presentation" />

          <ul className={styles.credentials}>
            {CREDENTIALS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className={styles.ctaRow}>
            <a href="#chapters" className={styles.ctaPrimary}>
              Explore the Portfolio
              <span className={styles.ctaArrow} aria-hidden="true">
                &#8600;
              </span>
            </a>
            <a href="/JasonLou-Resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary}>
              View Resume
            </a>
          </div>
        </div>

        <div className={styles.graphic} aria-hidden="true">
          <svg viewBox="0 0 360 360" className={styles.graphicSvg}>
            <polygon
              points="60,120 300,50 320,200 90,280"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
            />
            <line x1="180" y1="0" x2="180" y2="360" stroke="currentColor" strokeWidth="1" opacity="0.18" />
            <line x1="60" y1="120" x2="80" y2="330" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <circle cx="60" cy="120" r="3.5" fill="currentColor" opacity="0.7" />
            <circle cx="80" cy="330" r="3.5" fill="currentColor" opacity="0.7" />
          </svg>
          <p className={styles.graphicLabel}>Site / Before Infrastructure</p>
        </div>
      </div>

      <p className={styles.chapterLabel}>
        01&nbsp;&nbsp;JL / Construction &amp; Engineering
      </p>

      <div className={styles.cornerInfo}>
        <p className={styles.coordinates}>34.0522&deg; N&nbsp;&nbsp;118.2437&deg; W</p>
        <p className={styles.scrollLabel}>
          Scroll to Explore
          <span className={styles.scrollLine} aria-hidden="true" />
        </p>
      </div>
    </section>
  );
}
