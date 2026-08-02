import { forwardRef } from "react";
import ProjectOverlay from "./ProjectOverlay";
import styles from "./ProjectChapter.module.css";

// Positions one chapter's HTML content over the shared 3D canvas.
// Opacity/transform (entrance → hold → exit) are driven imperatively by
// ThreeExperience via `ref`, in sync with the master scroll progress —
// not by React state, so 7 chapters updating every scroll tick stays cheap.
const ProjectChapter = forwardRef(function ProjectChapter(
  { project, index, onOpenDetail },
  ref
) {
  return (
    <div
      ref={ref}
      className={`${styles.chapter} ${styles[toCamel(project.alignment)]}`}
      data-chapter-index={index}
    >
      <ProjectOverlay project={project} onOpenDetail={onOpenDetail} />
    </div>
  );
});

function toCamel(alignment) {
  return alignment.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export default ProjectChapter;
