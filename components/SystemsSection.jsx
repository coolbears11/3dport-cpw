"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SystemsSection.module.css";

// The closing section, and what the "Systems" nav link was always meant to
// open. Order is deliberate: direction first, then the evidence (tools,
// certifications, affiliations), then the video, then one light note at
// the very end. Humour placed after the evidence reads as confidence;
// placed before it, it reads as a student who isn't serious.

const SOFTWARE = [
  "On-Screen Takeoff",
  "Bluebeam Revu",
  "Destini",
  "BuildingConnected",
  "Procore",
  "Primavera P6",
  "MS Project",
  "Excel",
  "Civil 3D",
  "AutoCAD",
  "MicroStation",
  "SolidWorks",
  "HTML",
  "CSS",
  "React",
];

const CERTIFICATIONS = ["OSHA 10-Hour", "LEED Green Associate"];

// The journey column, sitting beside the Direction copy. Chronological,
// and the point is the last entry rather than the joke: four of these
// went nowhere, one came with drawings.
const DREAM_JOBS = [
  { job: "Astronaut", when: "Age six" },
  { job: "Pro League player", when: "Middle school" },
  { job: "Pro basketball player", when: "High school" },
  { job: "Electrician", when: "Rio Hondo" },
  { job: "Construction engineer", when: "Cal Poly Pomona", here: true },
];

// Reveals children one after another as the section scrolls into view.
// IntersectionObserver rather than GSAP: no extra dependency, nothing
// running per frame, and it disconnects the moment it has fired.
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, shown];
}

const HOBBIES = [
  "Tennis",
  "Basketball",
  "Backpacking",
  "League of Legends",
  "Traveling",
  "Eating, a lot",
  "Training AI models",
];

const AFFILIATIONS = [
  { org: "DBIA", role: "Social Chair, Design-Build Institute of America" },
  { org: "CMAA", role: "Member" },
  { org: "ASCE", role: "Member" },
  { org: "CEMA", role: "Member" },
  { org: "AGC", role: "Member" },
];

export default function SystemsSection() {
  const [playing, setPlaying] = useState(false);
  // A missing poster should read as an empty frame, not a broken icon.
  const [posterOk, setPosterOk] = useState(true);
  const [revealRef, revealed] = useReveal();

  return (
    <section id="systems" className={styles.systems}>
      <div className={styles.inner}>
        <p className={`eyebrow-label ${styles.eyebrow}`}>Systems</p>
        <h2 className={styles.heading}>Direction</h2>

        <div className={styles.split} ref={revealRef} data-revealed={revealed}>
          <div className={styles.prose}>
            <p>
              What I want to build is the infrastructure behind the AI race:
            data centers for hyperscalers and neoclouds. Most of what I read
            outside work is the vertical stack. Where the power comes from,
            what interconnection actually costs in time, how land and water
            constrain a site long before anyone draws a building, and how
            those pieces price against each other.
          </p>
            <p>
              The energy side is where I keep going deeper. Generation,
            available capacity, utility timelines. You can&rsquo;t evaluate a
            site for compute without understanding the grid it plugs into,
            and that&rsquo;s a field I&rsquo;d rather know properly than
            approximately.
          </p>
            <p>
              Longer term I want to work on the owner&rsquo;s side, in capital
            projects and infrastructure consulting, without leaving
            commercial construction behind. I&rsquo;m also drawn to
            construction delay and forensic analysis, because understanding
            how projects fail is how you learn what to price for.
          </p>
            <p>
              I started in the trades. A year of electrical foundations
              before construction engineering, and it&rsquo;s why I read a
              set of drawings the way I do.
            </p>
          </div>

          <aside className={styles.journey}>
            <h3 className={styles.columnTitle}>List of dream jobs</h3>
            <ol className={styles.timeline}>
              {DREAM_JOBS.map((item) => (
                <li
                  key={item.job}
                  className={styles.step}
                  data-here={item.here ? "true" : undefined}
                >
                  <span className={styles.stepJob}>{item.job}</span>
                  <span className={styles.stepWhen}>{item.when}</span>
                  {item.here && (
                    <span className={styles.stepHere}>I am here</span>
                  )}
                </li>
              ))}
            </ol>
            <p className={styles.journeyNote}>
              Four of them went nowhere. The one that stuck came with
              drawings to read.
            </p>
          </aside>
        </div>

        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Software</h3>
            <ul className={styles.tags}>
              {SOFTWARE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h3 className={`${styles.columnTitle} ${styles.columnTitleSpaced}`}>
              Certifications
            </h3>
            <ul className={styles.tags}>
              {CERTIFICATIONS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Affiliations</h3>
            <dl className={styles.affiliations}>
              {AFFILIATIONS.map((item) => (
                <div key={item.org} className={styles.affiliation}>
                  <dt>{item.org}</dt>
                  <dd>{item.role}</dd>
                </div>
              ))}
            </dl>

            <h3 className={`${styles.columnTitle} ${styles.columnTitleSpaced}`}>
              Competition
            </h3>
            <dl className={styles.affiliations}>
              <div className={styles.affiliation}>
                <dt>ASC Reno</dt>
                <dd>
                  Sustainable Building Competition, Cal Poly Pomona. A full
                  sustainable building proposal built against Skanska&rsquo;s
                  requirements inside a timed window.
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <figure className={styles.videoBlock}>
          <figcaption className={styles.videoCaption}>
            <h3 className={styles.videoTitle}>
              Freeway &amp; Bridge Civil Design
            </h3>
            <p className={styles.videoMeta}>
              MicroStation + LumenRT / Cal Poly Pomona Civil Design Lab
            </p>
            <p className={styles.videoText}>
              A full freeway interchange and bridge network modeled in
              MicroStation, covering road geometry, lane configurations,
              grading and structural elements, then rendered as a
              photorealistic flythrough.
            </p>
          </figcaption>

          <div className={styles.videoFrame}>
            {playing ? (
              <video
                className={styles.video}
                src="/videos/microstation-freeway.mp4"
                poster="/images/projects/microstation-freeway-poster.jpg"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <button
                type="button"
                className={styles.videoPoster}
                onClick={() => setPlaying(true)}
                aria-label="Play the freeway flythrough"
              >
                {posterOk && (
                  <img
                    src="/images/projects/microstation-freeway-poster.jpg"
                    alt=""
                    loading="lazy"
                    onError={() => setPosterOk(false)}
                  />
                )}
                <span className={styles.playIcon} aria-hidden="true" />
                <span className={styles.videoLength}>36 sec</span>
              </button>
            )}
          </div>
        </figure>

        <div className={styles.personal}>
          <figure className={styles.portrait}>
            <img src="/images/jason-lou.jpg" alt="Jason Lou" loading="lazy" />
          </figure>
          <div className={styles.personalText}>
            <h3 className={styles.columnTitle}>Off the clock</h3>
            <ul className={styles.tags}>
              {HOBBIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.personalNote}>
              The last two are related more often than you&rsquo;d think.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
