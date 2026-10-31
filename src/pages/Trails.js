import React from 'react';
import Link from '../components/Link';
import trails from '../data/trails';
import styles from '../components/Site.module.css';

const Trails = () => (
  <>
    <section className={styles.section} aria-labelledby="trails-title">
      <h1 id="trails-title" className={styles.sectionTitle}>Trails</h1>
      <ul className={styles.entryList}>
        {trails.map((trail) => (
          <li key={trail.name} className={styles.entry}>
            <div className={styles.entryHead}>
              <span>{trail.name}</span>
              <span className={styles.date}>{trail.type}</span>
            </div>
            <span className={styles.author}>
              {trail.place} · {trail.distance}
            </span>
            {trail.note && <span className={styles.entryNote}>{trail.note}</span>}
          </li>
        ))}
      </ul>
    </section>

    <div className={styles.pageFoot}>
      <Link to="/" className={styles.muted}>← Back</Link>
    </div>
  </>
);

export default Trails;
