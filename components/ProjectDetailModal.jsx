"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./ProjectDetailModal.module.css";

// The full-screen "View Project" case study. Rendered as a portal straight
// onto <body> so it always sits above the pinned 3D section regardless of
// GSAP's scroll transform. The 3D scene keeps rendering behind it — the
// backdrop is a blur + dim, not a solid cover, and the card grid's own
// gutter is what lets the environment read through between cards.
export default function ProjectDetailModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  if (!project || typeof document === "undefined") return null;

  const detail = project.detail || {};

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <button className={styles.close} onClick={onClose} aria-label="Close project detail">
        <span aria-hidden="true">&times;</span>
      </button>

      <div className={styles.frame} onClick={(event) => event.stopPropagation()}>
        <figure className={styles.mediaCard}>
          <img src={project.media} alt="" />
        </figure>

        <div className={styles.headerCard}>
          <p className={`eyebrow-label ${styles.eyebrow}`}>
            {project.sectionLabel}&nbsp;&mdash;&nbsp;{project.category}
          </p>
          <h2 className={styles.title}>{project.title}</h2>
          <dl className={styles.metaRow}>
            {project.employer && (
              <div>
                <dt>Employer</dt>
                <dd>{project.employer}</dd>
              </div>
            )}
            {project.location && (
              <div>
                <dt>Location</dt>
                <dd>{project.location}</dd>
              </div>
            )}
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.bodyCard}>
          <p className={styles.summary}>{detail.summary || project.description}</p>
          {detail.highlights && detail.highlights.length > 0 && (
            <ul className={styles.highlights}>
              {detail.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        {detail.stats && detail.stats.length > 0 && (
          <div className={styles.statsCard}>
            {detail.stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {detail.costBreakdown && (
          <div className={styles.tableCard}>
            <p className={styles.tableCaption}>{detail.costBreakdown.caption}</p>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Div</th>
                    <th>Description</th>
                    <th>Total</th>
                    <th>$ / SF</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.costBreakdown.rows.map((row) => (
                    <tr key={row.div}>
                      <td>{row.div}</td>
                      <td>{row.description}</td>
                      <td>{row.total}</td>
                      <td>{row.perSf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {detail.gallery && detail.gallery.length > 0 && (
          <div className={styles.galleryCard}>
            {detail.gallery.map((src) => (
              <img key={src} src={src} alt="" />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
