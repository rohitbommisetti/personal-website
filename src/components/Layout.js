import React, { useEffect, useState } from 'react';
import Link from './Link';
import styles from './Site.module.css';

const formatTime = () =>
  new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

const Layout = ({ children }) => {
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const timer = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <Link to="/" className={styles.name}>Rohit Bommisetti</Link>
          <nav aria-label="Elsewhere" className={styles.social}>
            <a href="https://twitter.com/rohitbommisetti">X</a>
            <a href="https://www.linkedin.com/in/rohitbommisetti">LinkedIn</a>
          </nav>
        </header>
        {children}
      </main>

      <footer className={styles.footer}>
        <span>Philadelphia</span>
        <span className={styles.time}>{time}</span>
      </footer>
    </div>
  );
};

export default Layout;
