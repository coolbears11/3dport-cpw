"use client";

import styles from "./SiteNavigation.module.css";

const LINKS = [
  { label: "Platform", href: "#divider" },
  { label: "Projects", href: "#chapters" },
  { label: "Systems", href: "#chapters" },
  { label: "Resume", href: "#footer" },
];

// Fixed nav uses mix-blend-mode: difference (see .module.css) so a single
// white-text bar reads correctly over both the dark hero/footer and the
// light divider/3D sections without any scroll-tracking JS.
export default function SiteNavigation() {
  return (
    <header className={styles.nav}>
      <a href="#top" className={styles.mark}>
        Jason&nbsp;Lou
      </a>
      <nav className={styles.links} aria-label="Primary">
        {LINKS.map((link) => (
          <a key={link.label} href={link.href} className={styles.link}>
            {link.label}
          </a>
        ))}
      </nav>
      <button type="button" className={styles.menu} aria-label="Menu">
        <span>Menu</span>
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>
    </header>
  );
}
