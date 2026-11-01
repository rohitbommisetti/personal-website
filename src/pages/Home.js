import React from 'react';
import Link from '../components/Link';
import profile from '../data/profile';
import styles from '../components/Site.module.css';

const Home = () => (
  <>
    <div className={styles.bio}>
      {profile.bio.map((paragraph, i) => (
        <p key={i}>
          {paragraph.map((piece, j) =>
            typeof piece === 'string' ? piece : <a key={j} href={piece.href}>{piece.text}</a>
          )}
        </p>
      ))}
    </div>

    <div className={styles.links}>
      <Link to="/writing">Writing</Link>
      <Link to="/bookshelf">Bookshelf</Link>
      <Link to="/quotes">Quotes</Link>
      <Link to="/trails">Trails</Link>
      <Link to="/places">Places</Link>
      <Link to="/photos">Photos</Link>
    </div>
  </>
);

export default Home;
