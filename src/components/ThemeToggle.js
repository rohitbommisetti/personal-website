import React, { useEffect, useState } from 'react';
import styles from './Site.module.css';

const BG = { light: '#faf8f0', dark: '#1c1d1b' };

const readSaved = () => {
  try {
    return localStorage.getItem('theme');
  } catch (e) {
    return null;
  }
};

const apply = (theme) => {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = BG[theme];
};

const Sun = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const Moon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  // Follow the system setting until the visitor picks a theme themselves.
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      if (readSaved()) return;
      const next = e.matches ? 'dark' : 'light';
      apply(next);
      setTheme(next);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    apply(next);
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // Private mode or blocked storage: the choice just won't persist.
    }
  };

  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
};

export default ThemeToggle;
