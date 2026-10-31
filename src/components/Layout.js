import React, { useEffect, useState } from 'react';
import Link from './Link';
import ThemeToggle from './ThemeToggle';
import Seasonal from './Seasonal';
import { currentSeason } from '../lib/seasons';
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
  const [season] = useState(currentSeason);

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
            <ThemeToggle />
          </nav>
        </header>
        {children}
      </main>

      {season && <Seasonal season={season.id} />}
      <footer className={styles.footer}>
        <span>
          Philadelphia
          {season && <span className={styles.seasonLabel}> · {season.label}</span>}
        </span>
        <span className={styles.time}>{time}</span>
      </footer>
    </div>
  );
};

export default Layout;
