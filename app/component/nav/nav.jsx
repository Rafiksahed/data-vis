import React from 'react'
import Link from 'next/link'
import styles from './nav.module.css'

export default function Nav() {
  return (
    <div className={styles.nav}>
         <ul className={styles.ul}>
            <li className={styles.li}>
              <Link href="/" className={styles.link}>Home</Link>
            </li>
            <li className={styles.li}>
              <Link href="/page1" className={styles.link}>Page 1</Link>
            </li>
            <li className={styles.li}>
              <Link href="/page2" className={styles.link}>Page 2</Link>
            </li>
            <li className={styles.li}>
              <Link href="/page3" className={styles.link}>Page 3</Link>
            </li>
         </ul>
    </div>
  )
}
