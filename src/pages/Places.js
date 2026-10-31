import React from 'react';
import Link from '../components/Link';
import places from '../data/places';
import styles from '../components/Site.module.css';

const Places = () => (
  <>
    <section className={styles.section} aria-labelledby="places-title">
      <h1 id="places-title" className={styles.sectionTitle}>Places in Philadelphia</h1>
      {places.map((group) => (
        <div key={group.category} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.category}</h2>
          <ul className={styles.list}>
            {group.items.map((place) => (
              <li key={place.name} className={styles.book}>
                <span>{place.name}</span>
                <span className={styles.author}>
                  {place.area} · {place.note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <div className={styles.pageFoot}>
      <Link to="/" className={styles.muted}>← Back</Link>
    </div>
  </>
);

export default Places;
