import React from 'react';
import Link from '../components/Link';
import quotes from '../data/quotes';
import styles from '../components/Site.module.css';

const Quotes = () => (
  <>
    <section className={styles.section} aria-labelledby="quotes-title">
      <h1 id="quotes-title" className={styles.sectionTitle}>Quotes</h1>
      <ul className={styles.quoteList}>
        {quotes.map((quote) => (
          <li key={quote.text}>
            <blockquote className={styles.quote}>
              <p>“{quote.text}”</p>
              <footer className={styles.author}>
                {quote.author}
                {quote.source && <>, <cite>{quote.source}</cite></>}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </section>

    <div className={styles.pageFoot}>
      <Link to="/" className={styles.muted}>← Back</Link>
    </div>
  </>
);

export default Quotes;
