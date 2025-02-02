import React from 'react';
import Link from 'next/link';
import { Film } from 'lucide-react'; // Icône du cinéma (utilise lucide-react ou une autre bibliothèque)
import styles from './nav.module.css';

export default function Nav() {
  return (
    <div className={styles.nav}>
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logoLink}>
          <Film className={styles.logoIcon} />
          <span className={styles.logoText}>Movies</span>
        </Link>
      </div>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <Link href="/page1" className={styles.link}>Genre</Link>
        </li>
        <li className={styles.li}>
          <Link href="/page2" className={styles.link}>Notes et votes</Link>
        </li>
        <li className={styles.li}>
          <Link href="/page3" className={styles.link}>Réalisateur et budget</Link>
        </li>
      </ul>
    </div>
  );
}
