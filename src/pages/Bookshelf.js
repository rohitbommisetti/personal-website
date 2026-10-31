import React from 'react';
import Link from '../components/Link';
import books, { lastUpdated } from '../data/books';
import styles from '../components/Site.module.css';

const Bookshelf = () => (
  <>
    <section className={styles.section} aria-labelledby="bookshelf-title">
      <h1 id="bookshelf-title" className={styles.sectionTitle}>Bookshelf</h1>
      <ul className={styles.list}>
        {books.map((book) => (
          <li key={book.title} className={styles.book}>
            <span>{book.title}</span>
            <span className={styles.author}>{book.author}</span>
          </li>
        ))}
      </ul>
    </section>

    <div className={styles.pageFoot}>
      <Link to="/" className={styles.muted}>← Back</Link>
      <span>Last updated {lastUpdated}</span>
    </div>
  </>
);

export default Bookshelf;
