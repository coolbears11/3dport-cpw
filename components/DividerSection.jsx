import styles from "./DividerSection.module.css";

// Four internships, in reverse chronological order. Deliberately not
// paragraphs: company, delivery model, dates, and the skills that came out
// of it. The four entries also happen to cover four different delivery
// models — general contractor, general contractor, design-build,
// subcontractor — which makes a point about range on its own.
const EXPERIENCE = [
  {
    company: "Swinerton",
    type: "General Contractor",
    location: "Los Angeles, CA",
    period: "2026 — Present",
    skills: [
      "Quantity takeoffs",
      "Trade package estimating",
      "On-Screen Takeoff / Bluebeam",
      "Destini",
      "Bid leveling",
    ],
  },
  {
    company: "VCC Construction",
    type: "General Contractor",
    location: "Irvine, CA",
    period: "2025",
    skills: [
      "MEP takeoffs",
      "Job walks",
      "Subcontractor coordination",
      "Drawing overlays",
      "Hard-bid support",
    ],
  },
  {
    company: "The Austin Company",
    type: "Design-Build",
    location: "Irvine, CA",
    period: "2025",
    skills: [
      "Owner-side preconstruction",
      "CSI Div 01–33 cost modeling",
      "30/60/90% design coordination",
      "Aerospace / mission-critical",
    ],
  },
  {
    company: "AMPCO Contracting",
    type: "Subcontractor",
    location: "Irvine, CA",
    period: "2024",
    skills: [
      "RFIs & submittals",
      "Demolition plan review",
      "Scheduling",
      "OAC coordination",
    ],
  },
];

export default function DividerSection() {
  return (
    <section id="divider" className={styles.divider}>
      <div className={styles.inner}>
        <p className={`eyebrow-label ${styles.eyebrow}`}>One System</p>
        <h2 className={styles.statement}>
          One grid. One compound.
          <br />
          One connected environment.
        </h2>
        <p className={styles.support}>
          What follows isn&rsquo;t a gallery &mdash; it&rsquo;s a single place,
          scrolled through.
        </p>
      </div>

      <div className={styles.experience}>
        <p className={`eyebrow-label ${styles.experienceLabel}`}>
          Where It Came From
        </p>
        <ol className={styles.grid}>
          {EXPERIENCE.map((role) => (
            <li key={role.company} className={styles.role}>
              <h3 className={styles.company}>{role.company}</h3>
              <p className={styles.meta}>
                <span className={styles.type}>{role.type}</span>
                <span className={styles.dot} aria-hidden="true">
                  /
                </span>
                {role.location}
              </p>
              <p className={styles.period}>{role.period}</p>
              <ul className={styles.skills}>
                {role.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
