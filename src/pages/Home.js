import React from 'react';
import Link from '../components/Link';
import styles from '../components/Site.module.css';

const Home = () => (
  <>
    <div className={styles.bio}>
      <p>
        I'm working on transforming businesses with AI at{' '}
        <a href="http://renovuscapital.com">Renovus Capital</a>. I believe the next chapter of American
        dynamism will be written in how we apply AI to the real economy.
      </p>
      <p>
        Before that, I worked on reducing oncology readmissions at CMU, built a student entrepreneurship
        community, and taught AI with a team from Stanford. I studied economics at the University of
        Pittsburgh.
      </p>
      <p>When I'm not working, I'm probably deep in a biography, on a trail, or in the ocean.</p>
    </div>

    <div className={styles.links}>
      <Link to="/writing">Writing</Link>
      <Link to="/bookshelf">Bookshelf</Link>
    </div>
  </>
);

export default Home;
