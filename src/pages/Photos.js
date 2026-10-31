import React from 'react';
import Link from '../components/Link';
import photos from '../data/photos';
import styles from '../components/Site.module.css';

const Photos = () => (
  <>
    <section className={styles.section} aria-labelledby="photos-title">
      <h1 id="photos-title" className={styles.sectionTitle}>Photos</h1>
      <ul className={styles.photoGrid}>
        {photos.map((photo) => (
          <li key={photo.src}>
            <a href={photo.src} className={styles.photoLink}>
              <figure className={styles.photo}>
                <img src={photo.src} alt={photo.caption} loading="lazy" />
                <figcaption className={styles.author}>{photo.caption}</figcaption>
              </figure>
            </a>
          </li>
        ))}
      </ul>
    </section>

    <div className={styles.pageFoot}>
      <Link to="/" className={styles.muted}>← Back</Link>
    </div>
  </>
);

export default Photos;
