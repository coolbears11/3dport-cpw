import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.statement}>
          Currently open to new collaborations
          <br />
          in energy, infrastructure, and systems design.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.column}>
          <p className={styles.label}>Email</p>
          <a href="mailto:jloubusiness2005@gmail.com" className={styles.value}>
            jloubusiness2005@gmail.com
          </a>
        </div>
        <div className={styles.column}>
          <p className={styles.label}>LinkedIn</p>
          <a
            href="https://www.linkedin.com/in/jason-lou-332031254/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.value}
          >
            linkedin.com/in/jason-lou
          </a>
        </div>
        <div className={styles.column}>
          <p className={styles.label}>Resume</p>
          <a
            href="/JasonLou-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.value}
          >
            Download PDF
          </a>
        </div>
        <div className={styles.column}>
          <p className={styles.label}>Location</p>
          <p className={styles.value}>Los Angeles, CA</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Jason Lou. All rights reserved.
        </p>
        <p className={styles.mark}>
          <span className={styles.dot} aria-hidden="true" />
          Los Angeles, CA
        </p>
      </div>
    </footer>
  );
}
