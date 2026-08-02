import styles from "./ProjectOverlay.module.css";

export default function ProjectOverlay({ project, onOpenDetail }) {
  return (
    <div className={styles.card}>
      <p className={`eyebrow-label ${styles.eyebrow}`}>
        {project.sectionLabel}
        &nbsp;&mdash;&nbsp;{project.category}
      </p>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.description}>{project.description}</p>

      <dl className={styles.meta}>
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Year</dt>
          <dd>{project.year}</dd>
        </div>
      </dl>

      <div className={styles.media}>
        <img src={project.media} alt="" loading="lazy" />
      </div>

      <button type="button" className={styles.cta} onClick={() => onOpenDetail(project.id)}>
        View project
        <span className={styles.ctaArrow} aria-hidden="true">
          &rarr;
        </span>
      </button>
    </div>
  );
}
