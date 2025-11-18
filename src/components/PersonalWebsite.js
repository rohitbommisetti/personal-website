import React from 'react';
import styles from './PersonalWebsite.module.css';

const PersonalWebsite = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Rohit Bommisetti</h1>
        <p className={styles.subtitle}>in pursuit of intentionality</p>
      
        <section className={styles.section}>
          <p>I'm currently working on transforming America's essential service industries with AI at <Link to="hhtp://renovuscapital.com">Renovus Capital</Link>.</p>
        </section>
        
        <section className={styles.section}>
          <p>favorited: pomegranates, alpine lakes, french press, summer rain, moonlit beaches</p>
        </section>

        <section className={styles.section}>
          <p>favorite hobbies: learning surfing, reading, guitar, trying new restaurants, weekend getaways</p>
          
        </section>
        
        <section className={styles.section}>
          <p>favorite places: nyc, istanbul, rishikesh, cannes, barcelona</p>
        </section>
        
        <section className={styles.section}>
          <p>🎸🌴🥭🥊</p>
        </section>
      
      </div>
      
      <footer className={styles.footer}>
  <a href="mailto:rohitbommisetti@pitt.edu" className={styles.link}>Email</a>
  <a href="https://twitter.com/rohitbommisetti" className={styles.link}>Twitter</a>
  <a href="https://www.linkedin.com/in/rohitbommisetti" className={styles.link}>LinkedIn</a>
  <a href="https://bommisetti.substack.com" className={styles.link}>Substack</a>
</footer>
    </div>
  );
};

export default PersonalWebsite;
