import React from 'react';
import Link from '../components/Link';
import styles from '../components/Site.module.css';

const Home = () => (
  <>
    <div className={styles.bio}>
      <p>
        I work at <a href="https://renovuscapital.com">Renovus Capital</a>, a private equity firm with over
        $2.5B AUM, focused on modernizing the service economy with AI. We've been{' '}
        <a href="https://www.businesswire.com/news/home/20260511889861/en/">ranked</a> the world's #1
        small-cap PE firm four years running.
      </p>
      <p>
        Before that, I worked on reducing oncology readmissions at Carnegie Mellon, built a student
        entrepreneurship community, and taught AI with a team from Stanford. I studied economics at the
        University of Pittsburgh.
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
