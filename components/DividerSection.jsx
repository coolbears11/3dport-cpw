import styles from "./DividerSection.module.css";

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
    </section>
  );
}
