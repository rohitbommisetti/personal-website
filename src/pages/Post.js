import React, { useEffect, useState } from 'react';
import Link from '../components/Link';
import { fetchPost, formatDate } from '../lib/posts';
import styles from '../components/Site.module.css';

const Post = ({ slug }) => {
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    setPost(undefined);
    fetchPost(slug)
      .then(setPost)
      .catch(() => setPost(null));
  }, [slug]);

  useEffect(() => {
    if (post) document.title = `${post.title} — Rohit Bommisetti`;
  }, [post]);

  if (post === undefined) return null;

  return (
    <>
      {post ? (
        <article className={styles.section}>
          <header className={styles.postHeader}>
            <h1 className={styles.postTitle}>
              {post.title}
              {post.draft && <span className={styles.draftBadge}>Draft</span>}
            </h1>
            <span className={styles.date}>{formatDate(post.date)}</span>
          </header>
          {post.cover && <img className={styles.cover} src={post.cover} alt="" />}
          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
      ) : (
        <p style={{ margin: 0 }}>This post doesn't exist.</p>
      )}

      <div className={styles.pageFoot}>
        <Link to="/writing" className={styles.muted}>← Writing</Link>
      </div>
    </>
  );
};

export default Post;
