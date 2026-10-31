import React from 'react';
import Link from '../components/Link';
import posts from '../data/posts';
import styles from '../components/Site.module.css';

const ExternalIcon = () => (
  <svg aria-hidden="true" width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#5f6a59" strokeWidth="1.2" strokeLinecap="round">
    <path d="M4 2h6v6M10 2 3 9" />
  </svg>
);

const Writing = () => (
  <>
    <section className={styles.section} aria-labelledby="writing-title">
      <h1 id="writing-title" className={styles.sectionTitle}>Writing</h1>
      {posts.length ? (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.href} className={styles.post}>
              <a href={post.href} className={styles.postLink}>
                {post.title}
                <ExternalIcon />
              </a>
              <span className={styles.date}>{post.date}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ margin: 0 }}>
          New writing is on the way. Older posts live on{' '}
          <a href="https://rohit.posthaven.com">Posthaven</a>.
        </p>
      )}
    </section>

    <div className={styles.pageFoot}>
      <Link to="/" className={styles.muted}>← Back</Link>
    </div>
  </>
);

export default Writing;
