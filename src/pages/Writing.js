import React, { useEffect, useState } from 'react';
import Link from '../components/Link';
import { fetchPosts, formatDate } from '../lib/posts';
import styles from '../components/Site.module.css';

const Writing = () => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  return (
    <>
      <section className={styles.section} aria-labelledby="writing-title">
        <h1 id="writing-title" className={styles.sectionTitle}>Writing</h1>
        {posts === null ? null : posts.length ? (
          <ul className={styles.list}>
            {posts.map((post) => (
              <li key={post.slug} className={styles.post}>
                <Link to={`/writing/${post.slug}`} className={styles.postLink}>
                  {post.title}
                  {post.draft && <span className={styles.draftBadge}>Draft</span>}
                </Link>
                <span className={styles.date}>{formatDate(post.date)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: 0 }}>New writing is on the way.</p>
        )}
      </section>

      <div className={styles.pageFoot}>
        <Link to="/" className={styles.muted}>← Back</Link>
      </div>
    </>
  );
};

export default Writing;
