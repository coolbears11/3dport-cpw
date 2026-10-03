import styles from "./DividerSection.module.css";

// Four internships, in reverse chronological order. Deliberately not
// paragraphs: company, delivery model, dates, and the skills that came out
// of it. The four entries also happen to cover four different delivery
// models — general contractor, general contractor, design-build,
// subcontractor — which makes a point about range on its own.
// Roles not yet started. Kept in their own block, clearly labelled, so a
// reader never mistakes an incoming internship for a completed one.
const INCOMING = [
  {
    company: "Tesla",
    role: "Construction Project Management Intern",
    detail: "Megapack and Optimus facilities",
    location: "Lathrop, CA",
    period: "Spring 2027",
  },
  {
    company: "FTI Consulting",
    role: "Consulting Intern",
    detail: "Construction, Projects & Assets",
    location: "New York, NY",
    period: "Summer 2027",
  },
];

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
        <p className={`eyebrow-label ${styles.eyebrow}`}>Intent</p>
        <h2 className={styles.statement}>
          I want to build things
          <br />
          that outlast me.
        </h2>
        <p className={styles.support}>
          The work so far, and the teams I learned it from.
        </p>
      </div>

      <div className={styles.experience}>
        <p className={`eyebrow-label ${styles.experienceLabel}`}>
          What&rsquo;s Next
        </p>
        <ul className={styles.incomingGrid}>
          {INCOMING.map((item) => (
            <li key={item.company} className={styles.incoming}>
              <span className={styles.incomingTag}>Incoming</span>
              <h3 className={styles.company}>{item.company}</h3>
              <div>
                <p className={styles.incomingRole}>{item.role}</p>
              <p className={styles.incomingMeta}>
                {item.detail}
                <span className={styles.dot} aria-hidden="true">
                  /
                </span>
                {item.location}
                </p>
              </div>
              <p className={styles.period}>{item.period}</p>
            </li>
          ))}
        </ul>

        <p className={`eyebrow-label ${styles.experienceLabel} ${styles.experienceLabelSpaced}`}>
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
