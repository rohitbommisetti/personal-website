import React from 'react';
import styles from './PersonalWebsite.module.css';

const PersonalWebsite = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Rohit Bommisetti</h1>
        <p className={styles.subtitle}>exploring the latent space</p>
        
        <section className={styles.section}>
          <p>i studied neuroscience in college, and apply that lens to the world of technology</p>
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
        {['Email', 'Twitter', 'LinkedIn', 'Substack'].map((link) => (
          <a key={link} href="#" className={styles.link}>
            {link}
          </a>
        ))}
      </footer>
    </div>
  );
};

export default PersonalWebsite;